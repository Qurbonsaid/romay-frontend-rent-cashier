import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ArrowLeft, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Custom Components
import ProductSelectionTable from '@/components/rentals/ProductSelectionTable'
import SelectedProductsList from '@/components/rentals/SelectedProductsList'

// API and Types
import { useUpdateRentMutation, useGetRentQuery } from '@/store/rent/rent.api'
import { useGetAllRentProductsQuery } from '@/store/rent/rent.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { Client } from '@/types/clients.d'

// Hooks and Utils
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useDebounce } from '@/hooks/use-debounce'
import { CheckRole } from '@/utils/checkRole'

// Rent form schema matching API requirements
const rentSchema = z.object({
  branch: z.string().optional(),
  client: z.string().min(1, 'Mijoz tanlash majburiy'),
  client_name: z.string().min(1, 'Mijoz ismi majburiy'),
  received_date: z.date({ message: 'Qabul qilish sanasi majburiy' }),
  delivery_date: z.date({ message: 'Qaytarish sanasi majburiy' }),
})

type RentFormData = z.infer<typeof rentSchema>

interface SelectedProduct {
  rent_product: string
  rent_product_count: number
  name: string
  rent_price: number
  rent_change_price: number
  available_quantity: number
}

export default function EditRent() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const userRole = useGetRole()
  const branch = useGetBranch()

  // State for product selection and UI
  const [productQuantities, setProductQuantities] = useState<{
    [productId: string]: number
  }>({})
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientSearch, setClientSearch] = useState('')

  // State for ProductSelectionTable
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Debounce search term for API optimization
  const debouncedProductSearch = useDebounce(productSearch, 300)

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedProductSearch])

  // API hooks
  const { data: rentData, isLoading: rentLoading } = useGetRentQuery(
    {
      id: id!,
      branch: branch?._id,
    },
    {
      skip: !id || !branch,
    }
  )
  const [updateRent, { isLoading: isSubmitting }] = useUpdateRentMutation()

  // Form setup with React Hook Form
  const form = useForm<RentFormData>({
    resolver: zodResolver(rentSchema),
    defaultValues: {
      branch: branch?._id || '',
      client: '',
      client_name: '',
      received_date: new Date(),
      delivery_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  // Fetch data for selection components
  const { data: allProductsData, isLoading: productsLoading } =
    useGetAllRentProductsQuery({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedProductSearch || undefined,
      branch: branch?._id,
    })

  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery(
    {
      search: clientSearch,
      branch_id: branch?._id,
      page: 1,
      limit: 1000,
    },
    { skip: !branch }
  )

  // Load rent data into form when available
  useEffect(() => {
    if (rentData?.data && clientsData?.data && allProductsData?.data) {
      const rent = rentData.data

      // Use a small timeout to ensure form is ready
      setTimeout(() => {
        // Find the client by name
        const client = clientsData.data.find(
          (c) => c.username === rent.client_name
        )

        if (client) {
          setSelectedClient(client)
          form.setValue('client', client._id)
          form.setValue('client_name', client.username)
          form.resetField('client', { defaultValue: client._id })
          form.resetField('client_name', { defaultValue: client.username })
        } else {
          // If client not found in list, use the name from rent data
          form.setValue('client_name', rent.client_name)
          form.resetField('client_name', { defaultValue: rent.client_name })
        }

        // Set dates
        form.setValue('received_date', new Date(rent.received_date))
        form.setValue('delivery_date', new Date(rent.delivery_date))

        // Set branch
        form.setValue('branch', branch?._id || '')

        // Set selected products with proper quantities
        const initialQuantities: { [productId: string]: number } = {}
        rent.rent_products?.forEach((p) => {
          let productId = ''

          // Handle both cases: embedded object or string ID
          if (
            p.rent_product &&
            typeof p.rent_product === 'object' &&
            '_id' in p.rent_product
          ) {
            // Product data is embedded
            productId = (p.rent_product as any)._id
          } else if (typeof p.rent_product === 'string') {
            // Product is just an ID reference
            productId = p.rent_product
          }

          if (productId && p.rent_product_count > 0) {
            initialQuantities[productId] = p.rent_product_count
          }
        })
        setProductQuantities(initialQuantities)
      }, 100)
    }
  }, [rentData, clientsData, allProductsData, form, branch])

  // Check permissions
  if (!CheckRole(userRole, ['rent_cashier'])) {
    navigate('/dashboard')
    return null
  }

  if (!branch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">Branch ma'lumotlari topilmadi</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Dashboard ga qaytish
          </Button>
        </div>
      </div>
    )
  }

  // Handle form submission
  const onSubmit = async (data: RentFormData) => {
    try {
      // Validate that we have products selected
      const selectedProductsArray = Object.entries(productQuantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({
          rent_product: productId,
          rent_product_count: quantity,
        }))

      if (selectedProductsArray.length === 0) {
        toast.error('Kamida bitta mahsulot tanlash kerak')
        return
      }

      // Validate dates
      if (data.delivery_date <= data.received_date) {
        toast.error(
          "Qaytarish sanasi qabul qilish sanasidan keyin bo'lishi kerak"
        )
        return
      }

      const updateData = {
        id: id!,
        data: {
          branch: data.branch || branch?._id,
          client: data.client,
          client_name: data.client_name.trim(),
          received_date: format(data.received_date, 'yyyy-MM-dd'),
          delivery_date: format(data.delivery_date, 'yyyy-MM-dd'),
          rent_products: selectedProductsArray,
        },
      }

      await updateRent(updateData).unwrap()
      toast.success('Ijara muvaffaqiyatli yangilandi')
      navigate(`/rent-details/${id}`)
    } catch {
      toast.error('Ijarani yangilashda xatolik yuz berdi')
    }
  }

  // Handle client change (for form compatibility)
  const handleClientChange = (clientId: string) => {
    const client = clientsData?.data.find((c: Client) => c._id === clientId)
    setSelectedClient(client || null)
    form.setValue('client', clientId)
    form.setValue('client_name', client?.username || '')
  }

  // Handle product quantity changes - matching AddRent pattern
  const updateProductCount = (productId: string, change: number) => {
    const currentCount = productQuantities[productId] || 0
    const newCount = currentCount + change

    if (newCount <= 0) {
      setProductQuantities((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
      return
    }

    const product = allProductsData?.data.find((p) => p._id === productId)
    if (!product) return

    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(newCount, product.product_active_count),
    }))
  }

  // Handle product removal - matching AddRent pattern
  const removeProduct = (productId: string) => {
    setProductQuantities((prev) => {
      const newQuantities = { ...prev }
      delete newQuantities[productId]
      return newQuantities
    })
  }

  // Get product images for SelectedProductsList
  const getProductImages = () => {
    const images: { [productId: string]: string[] } = {}

    allProductsData?.data.forEach((product) => {
      images[product._id] = product.product.images || []
    })

    return images
  }

  // Get selected products data for display
  const getSelectedProducts = (): SelectedProduct[] => {
    if (!allProductsData?.data) return []

    return Object.entries(productQuantities)
      .map(([productId, quantity]) => {
        const productData = allProductsData.data.find(
          (p) => p._id === productId
        )
        if (!productData) return null

        return {
          rent_product: productId,
          rent_product_count: quantity,
          name: productData.product.name,
          rent_price: productData.product_rent_price,
          rent_change_price: productData.product_rent_price,
          available_quantity: productData.product_active_count,
        }
      })
      .filter((product): product is SelectedProduct => product !== null)
  }

  // Calculate total price
  const calculateTotalPrice = (): number => {
    return getSelectedProducts().reduce((total, product) => {
      return total + product.rent_price * product.rent_product_count
    }, 0)
  }

  // Format currency helper (matching AddRent)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
  }

  // Loading state
  if (rentLoading || productsLoading || clientsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Ijarani tahrirlash</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">Yuklanmoqda...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (!rentData?.data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Ijarani tahrirlash</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ijara topilmadi
          </h3>
          <p className="text-gray-500 mb-4">
            Kechirasiz, bunday ijara mavjud emas yoki o'chirilgan.
          </p>
          <Button onClick={() => navigate('/rents')}>
            Ijaralar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Ijarani tahrirlash</h1>
      </div>

      {/* Product Selection Section */}
      <ProductSelectionTable
        products={allProductsData?.data || []}
        loading={productsLoading}
        selectedProducts={productQuantities}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        updateProductCount={updateProductCount}
        totalPages={allProductsData?.page_count}
        totalItems={allProductsData?.after_filtering_count}
      />

      {/* Two-column layout for form and information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ijarani tahrirlash</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="edit-rent-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Client Selection */}
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mijoz *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          handleClientChange(value)
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Mijozni tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Mijoz qidirish..."
                              value={clientSearch}
                              onChange={(e) => setClientSearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {clientsLoading ? (
                            <SelectItem value="loading" disabled>
                              Yuklanmoqda...
                            </SelectItem>
                          ) : clientsData?.data.length === 0 ? (
                            <SelectItem value="no-clients" disabled>
                              Mijozlar topilmadi
                            </SelectItem>
                          ) : (
                            clientsData?.data.map((client) => (
                              <SelectItem key={client._id} value={client._id}>
                                {client.username} - {client.phone}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Received Date */}
                <FormField
                  control={form.control}
                  name="received_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Qabul qilish sanasi *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Sanani tanlang</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Date */}
                <FormField
                  control={form.control}
                  name="delivery_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Qaytarish sanasi *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Sanani tanlang</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right Column: Rental Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ijara xulosasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Client Information */}
              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Tanlangan mijoz:</h4>
                {selectedClient ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ismi</span>
                      <span className="text-sm font-medium">
                        {selectedClient.username}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Telefon</span>
                      <span className="text-sm font-medium">
                        {selectedClient.phone}
                      </span>
                    </div>
                    {selectedClient.profession && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Kasbi</span>
                        <span className="text-sm font-medium">
                          {selectedClient.profession}
                        </span>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Manzil</span>
                        <span className="text-sm font-medium text-right max-w-[60%]">
                          {selectedClient.address}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-1">
                    Mijoz tanlanmagan
                  </p>
                )}
              </div>

              {/* Products Total */}
              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Mahsulotlar jami:</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jami narx</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(calculateTotalPrice())}
                  </span>
                </div>
              </div>

              {/* Dates Information */}
              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Sanalar:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Qabul qilish</span>
                    <span className="text-sm font-medium">
                      {form.watch('received_date')
                        ? format(form.watch('received_date'), 'dd:MM:yyyy')
                        : 'Tanlanmagan'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Qaytarish</span>
                    <span className="text-sm font-medium">
                      {form.watch('delivery_date')
                        ? format(form.watch('delivery_date'), 'dd:MM:yyyy')
                        : 'Tanlanmagan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Rental Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  form="edit-rent-form"
                  disabled={
                    isSubmitting ||
                    !selectedClient ||
                    getSelectedProducts().length === 0
                  }
                  className="w-full"
                >
                  {isSubmitting ? 'Saqlanmoqda...' : 'Ijarani yangilash'}
                </Button>
                {(!selectedClient || getSelectedProducts().length === 0) && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {!selectedClient && 'Mijoz tanlang va '}
                    {getSelectedProducts().length === 0 && 'mahsulot tanlang'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Products Section */}
      <SelectedProductsList
        selectedProducts={getSelectedProducts()}
        onRemoveProduct={removeProduct}
        onUpdateQuantity={updateProductCount}
        images={getProductImages()}
      />
    </div>
  )
}
