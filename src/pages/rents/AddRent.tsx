import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
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
import { useAddRentMutation } from '@/store/rent/rent.api'
import { useGetAllRentProductsQuery } from '@/store/rent/rent.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { Client } from '@/types/clients.d'

// Hooks and Utils
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
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
  available_quantity: number
}

export default function AddRent() {
  const navigate = useNavigate()
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

  // Check permissions
  const canAddRent = CheckRole(userRole, ['rent_cashier'])

  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery(
    {
      search: clientSearch,
      branch_id: branch?._id,
      page: 1,
      limit: 1000,
    },
    { skip: !branch }
  )

  const { data: rentProductsData, isLoading: rentProductsLoading } =
    useGetAllRentProductsQuery({
      search: productSearch || undefined,
      page: 1,
      limit: 1000,
      branch: branch?._id,
    })

  const [addRent, { isLoading: isSubmitting }] = useAddRentMutation()

  if (!canAddRent) {
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

  const handleClientChange = (clientId: string) => {
    const client = clientsData?.data.find((c: Client) => c._id === clientId)
    setSelectedClient(client || null)
    form.setValue('client', clientId)
    form.setValue('client_name', client?.username || '')
  }

  // Product management functions for ProductSelectionTable
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

    const product = rentProductsData?.data.find((p) => p._id === productId)
    if (!product) return

    setProductQuantities((prev) => ({
      ...prev,
      [productId]: newCount,
    }))
  }

  // Convert productQuantities to selected products for display
  const convertToSelectedProducts = (): SelectedProduct[] => {
    const products: SelectedProduct[] = []

    Object.entries(productQuantities).forEach(([productId, quantity]) => {
      const product = rentProductsData?.data.find((p) => p._id === productId)
      if (product && quantity > 0) {
        products.push({
          rent_product: product._id,
          rent_product_count: quantity,
          name: product.product.name,
          rent_price: product.product_rent_price,
          available_quantity: product.product_active_count,
        })
      }
    })

    return products
  }

  const selectedProductsList = convertToSelectedProducts()

  // Get product images for SelectedProductsList
  const getProductImages = (): Record<string, string[]> => {
    const images: Record<string, string[]> = {}
    rentProductsData?.data.forEach((product) => {
      images[product._id] = product.product.images || []
    })
    return images
  }

  // Function to remove product (for SelectedProductsList)
  const removeProduct = (productId: string) => {
    setProductQuantities((prev) => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  const handleSubmit = async (data: RentFormData) => {
    try {
      if (!selectedClient) {
        toast.error('Mijoz tanlanmagan')
        return
      }

      if (selectedProductsList.length === 0) {
        toast.error('Hech qanday mahsulot tanlanmagan')
        return
      }

      // Convert productQuantities to rent products
      const rentProducts = Object.entries(productQuantities).map(
        ([productId, quantity]) => ({
          rent_product: productId,
          rent_product_count: quantity,
        })
      )

      await addRent({
        branch: branch?._id || '',
        client: data.client,
        client_name: data.client_name,
        rent_products: rentProducts,
        received_date: data.received_date.toISOString(),
        delivery_date: data.delivery_date.toISOString(),
      }).unwrap()

      toast.success("Ijara muvaffaqiyatli qo'shildi")
      navigate('/')
    } catch (error: any) {
      // Handle specific error messages
      let errorMessage = "Ijara qo'shishda xatolik yuz berdi"

      if (error?.data?.error?.msg) {
        errorMessage = error.data.error.msg
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.error) {
        errorMessage =
          typeof error.data.error === 'string'
            ? error.data.error
            : JSON.stringify(error.data.error)
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

  const getTotalProductsSum = () => {
    return selectedProductsList.reduce((total, item) => {
      return total + item.rent_price * item.rent_product_count
    }, 0)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
  }

  const availableProducts = rentProductsData?.data || []

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Orqaga
        </Button>
        <h1 className="text-3xl font-bold">Yangi ijara qo'shish</h1>
      </div>

      {/* Product Selection Section */}
      <ProductSelectionTable
        products={availableProducts}
        loading={rentProductsLoading}
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
      />

      {/* Two-column layout for form and information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Rent Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ijara yaratish</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="rent-form"
                onSubmit={form.handleSubmit(handleSubmit)}
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
                    {formatCurrency(getTotalProductsSum())}
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

              {/* Create Rental Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  form="rent-form"
                  disabled={
                    isSubmitting ||
                    !selectedClient ||
                    selectedProductsList.length === 0
                  }
                  className="w-full"
                >
                  {isSubmitting ? 'Saqlanmoqda...' : 'Ijara yaratish'}
                </Button>
                {(!selectedClient || selectedProductsList.length === 0) && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {!selectedClient && 'Mijoz tanlang va '}
                    {selectedProductsList.length === 0 && 'mahsulot tanlang'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Products Section */}
      <SelectedProductsList
        selectedProducts={selectedProductsList}
        onRemoveProduct={removeProduct}
        onUpdateQuantity={updateProductCount}
        images={getProductImages()}
      />
    </div>
  )
}
