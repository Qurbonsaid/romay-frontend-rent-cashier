import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

// Custom Components
import ProductSelectionTable from '@/components/repairs/ProductSelectionTable'
import SelectedProductsList from '@/components/repairs/SelectedProductsList'

// API and Types
import { useAddServiceMutation } from '@/store/service/service.api'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import { useGetAllSaleProductsQuery } from '@/store/product/product.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { AddServiceRequest } from '@/store/service/types'
import type { ProductWarehouseItem } from '@/store/product/types.d'
import type { Client } from '@/types/clients.d'

// Hooks and Utils
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useDebounce } from '@/hooks/use-debounce'
import { CheckRole } from '@/utils/checkRole'
import { formatNumberInput, formatCurrency } from '@/utils/numberFormat'

// Service form schema with conditional validation for mechanic and salary
const serviceSchema = z
  .object({
    client_id: z.string().min(1, 'Mijoz tanlash majburiy'),
    mechanic: z.string().optional(),
    mechanic_salary: z.number().min(0, "Usta maoshi manfiy bo'lmasligi kerak"),
    received_date: z.date({ message: 'Qabul qilish sanasi majburiy' }),
    delivery_date: z.date({ message: 'Topshirish sanasi majburiy' }),
    comment: z.string().optional(),
    discount: z.number().min(0, "Chegirma manfiy bo'lmasligi kerak").optional(),
  })
  .refine(
    (data) => {
      // Agar usta tanlangan bo'lsa, maosh majburiy
      if (
        data.mechanic &&
        data.mechanic.trim() !== '' &&
        data.mechanic !== 'none'
      ) {
        return data.mechanic_salary > 0
      }
      return true
    },
    {
      message: "Usta tanlangan bo'lsa, maosh belgilash majburiy",
      path: ['mechanic_salary'],
    }
  )
  .refine(
    (data) => {
      // Agar maosh belgilangan bo'lsa, usta majburiy
      if (data.mechanic_salary > 0) {
        return (
          data.mechanic &&
          data.mechanic.trim() !== '' &&
          data.mechanic !== 'none'
        )
      }
      return true
    },
    {
      message: "Maosh belgilangan bo'lsa, usta tanlash majburiy",
      path: ['mechanic'],
    }
  )
// Note: maxDiscount validation will be done in onSubmit since it's dynamic runtime value

type ServiceFormData = z.infer<typeof serviceSchema>

interface SelectedProduct {
  product: ProductWarehouseItem
  product_count: number
  product_change_price: number
}

export default function AddService() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const branch = useGetBranch()

  // State for selected products
  const [selectedProducts, setSelectedProducts] = useState<{
    [productId: string]: SelectedProduct
  }>({})

  // State for search and filtering
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [salaryDisplay, setSalaryDisplay] = useState('')

  // State for tracking price changes
  const [hasPriceChanges, setHasPriceChanges] = useState(false)

  // State for discount (bonus)
  const [discountDisplay, setDiscountDisplay] = useState('')
  const [maxDiscount, setMaxDiscount] = useState(0)

  // Debounce search term for API optimization
  const debouncedProductSearch = useDebounce(productSearch, 300)

  // API hooks
  const [addService, { isLoading: isSubmitting }] = useAddServiceMutation()

  const { data: mechanicsData, isLoading: mechanicsLoading } =
    useGetAllMechanicsQuery({
      page: 1,
      limit: 100,
      work_type: 'SERVICE',
    })

  const { data: productsData, isLoading: productsLoading } =
    useGetAllSaleProductsQuery({
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

  // Form setup
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      client_id: '',
      mechanic: 'none',
      mechanic_salary: 0,
      received_date: new Date(), // Current date and time
      delivery_date: (() => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow // Tomorrow same time
      })(),
      comment: '',
      discount: 0,
    },
  })

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedProductSearch])

  // Computed values
  const selectedProductsList = Object.values(selectedProducts)
  const availableProducts = productsData?.data || []

  // Helper function to reset bonus discount
  const resetBonusDiscount = useCallback(() => {
    if (maxDiscount !== 0) {
      setMaxDiscount(0)
      form.setValue('discount', 0, { shouldValidate: false })
      setDiscountDisplay('')
    }
  }, [maxDiscount, form])

  // Effect to handle discount when products change or client changes
  useEffect(() => {
    // 1. Mijozda bonus yo'qligi yoki bonus ob'ekti noto'g'ri bo'lsa
    if (!selectedClient || !selectedClient.bonus) {
      resetBonusDiscount()
      return
    }

    const bonus = selectedClient.bonus

    // 2. Bonus_type mavjudligini tekshirish (API dan kelmagan bo'lishi mumkin)
    if (!bonus.bonus_type || typeof bonus.bonus_type !== 'object') {
      resetBonusDiscount()
      return
    }

    // 3. Bonus turi SERVICE emasligini tekshirish
    if (bonus.type !== 'SERVICE') {
      resetBonusDiscount()
      return
    }

    // 4. Bonus sanasi oralig'ini tekshirish
    const now = new Date()
    const startDate = new Date(bonus.start_date)
    const endDate = new Date(bonus.end_date)

    if (now < startDate || now > endDate) {
      resetBonusDiscount()
      return
    }

    // 5. Mahsulotlar jami summani hisoblash
    const totalProductsSum = selectedProductsList.reduce((total, item) => {
      const price = item.product_change_price || 0
      return total + item.product_count * price
    }, 0)

    const targetAmount = bonus.bonus_type.target_amount || 0
    const maxDiscountAmount = bonus.client_discount_amount || 0

    // 6. Jami summa maqsad summaga yetganligi tekshiruvi
    if (totalProductsSum >= targetAmount && maxDiscountAmount > 0) {
      // Maksimal chegirmani o'rnatish (faqat o'zgargan bo'lsa)
      if (maxDiscount !== maxDiscountAmount) {
        setMaxDiscount(maxDiscountAmount)
      }

      // Chegirmani avtomatik o'rnatish (FAQAT 0 bo'lganda)
      // Agar foydalanuvchi qiymat kiritgan bo'lsa, o'zgartirmaymiz
      const currentDiscount = form.getValues('discount') || 0
      if (currentDiscount === 0) {
        form.setValue('discount', maxDiscountAmount, { shouldValidate: false })
        setDiscountDisplay(
          formatNumberInput(maxDiscountAmount.toString()).display
        )
      }
    } else {
      // Maqsad summaga yetmagan yoki bonus yo'q
      resetBonusDiscount()
    }
  }, [
    selectedClient,
    selectedProductsList,
    maxDiscount,
    form,
    resetBonusDiscount,
  ])

  // Check permissions
  if (!CheckRole(userRole, ['manager', 'rent_cashier', 'ceo'])) {
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

  // Product management functions
  const updateProductCount = (productId: string, change: number) => {
    const currentCount = selectedProducts[productId]?.product_count || 0
    const newCount = currentCount + change

    if (newCount < 0) {
      return
    }

    if (newCount === 0) {
      setSelectedProducts((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
      return
    }

    const product = availableProducts.find((p) => p._id === productId)
    if (!product) return

    const existingProduct = selectedProducts[productId]

    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        product,
        product_count: newCount,
        product_change_price:
          existingProduct?.product_change_price || product.product?.price || 0,
      },
    }))
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  const updateProductPrice = (productId: string, newPrice: number) => {
    const currentProduct = selectedProducts[productId]
    if (currentProduct) {
      const originalPrice = currentProduct.product.product?.price || 0
      const isPriceChanged = newPrice !== originalPrice

      // Check if any product has changed price
      const anyPriceChanged = Object.values(selectedProducts).some((p) => {
        if (p.product._id === productId) {
          return isPriceChanged
        }
        return p.product_change_price !== (p.product.product?.price || 0)
      })

      setHasPriceChanges(anyPriceChanged)
    }

    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        product_change_price: newPrice,
      },
    }))
  }

  // Form submission
  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (!selectedClient) {
        toast.error('Mijoz tanlanmagan')
        return
      }

      if (selectedProductsList.length === 0) {
        toast.error('Hech qanday mahsulot tanlanmagan')
        return
      }

      // Check if any product price has been changed and comment is required
      if (hasPriceChanges && (!data.comment || data.comment.trim() === '')) {
        toast.error("Mahsulot narxi o'zgartirilgan! Izoh qoldirish majburiy.")
        return
      }

      // Check if discount exceeds maxDiscount
      if (maxDiscount > 0 && data.discount && data.discount > maxDiscount) {
        toast.error(
          `Chegirma maksimal miqdordan oshib ketgan! Maksimal: ${formatCurrency(
            maxDiscount
          )}`
        )
        return
      }

      // Prepare products array for API
      const products = selectedProductsList.map((item) => ({
        product: item.product.product._id,
        product_count: item.product_count,
        product_change_price: item.product_change_price,
      }))

      // Prepare service request according to API spec (without totalAmount)
      const serviceRequest: Partial<AddServiceRequest> = {
        branch: branch._id,
        client_name: selectedClient.username,
        client_phone: selectedClient.phone,
        products,
        received_date: data.received_date.toISOString(),
        delivery_date: data.delivery_date.toISOString(),
        ...(data.comment &&
          data.comment.trim() !== '' && { comment: data.comment }),
      }

      // Faqat usta va maosh bo'lsa qo'shish (none emas)
      if (
        data.mechanic &&
        data.mechanic.trim() !== '' &&
        data.mechanic !== 'none'
      ) {
        serviceRequest.mechanic = data.mechanic
        serviceRequest.mechanic_salary = data.mechanic_salary
      }

      // Add discount if it's greater than 0
      if (data.discount && data.discount > 0) {
        serviceRequest.discount = data.discount
      }

      await addService(serviceRequest as AddServiceRequest).unwrap()

      toast.success("Xizmat muvaffaqiyatli qo'shildi!")
      navigate('/repairs')
    } catch (error: any) {
      // Handle specific error messages
      let errorMessage = "Xizmat qo'shishda xatolik yuz berdi"

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

  // Calculate total products sum
  const getTotalProductsSum = () => {
    return selectedProductsList.reduce((total, item) => {
      const price = item.product_change_price || 0
      return total + item.product_count * price
    }, 0)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/repairs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Orqaga
        </Button>
        <h1 className="text-3xl font-bold">Yangi xizmat qo'shish</h1>
      </div>

      {/* Product Selection Section */}
      <ProductSelectionTable
        products={availableProducts}
        loading={productsLoading}
        selectedProducts={selectedProducts}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        updateProductCount={updateProductCount}
        totalPages={productsData?.page_count}
        totalItems={productsData?.after_filtering_count}
      />
      {/* Two-column layout for form and information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Service Form */}
        <Card>
          <CardHeader>
            <CardTitle>Xizmat yaratish</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="service-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Client Selection */}
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mijoz *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          const client = clientsData?.data.find(
                            (c) => c._id === value
                          )
                          setSelectedClient(client || null)
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

                {/* Mechanic Selection */}
                <FormField
                  control={form.control}
                  name="mechanic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usta (ixtiyoriy)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Ustani tanlang (ixtiyoriy)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Usta tanlanmagan</SelectItem>
                          {mechanicsLoading ? (
                            <SelectItem value="loading" disabled>
                              Yuklanmoqda...
                            </SelectItem>
                          ) : (
                            mechanicsData?.data.map((mechanic) => (
                              <SelectItem
                                key={mechanic._id}
                                value={mechanic._id}
                              >
                                {mechanic.fullName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mechanic Salary */}
                <FormField
                  control={form.control}
                  name="mechanic_salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usta maoshi (ixtiyoriy)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0"
                          value={
                            salaryDisplay ||
                            (field.value > 0
                              ? formatNumberInput(field.value.toString())
                                  .display
                              : '')
                          }
                          onChange={(e) => {
                            const inputValue = e.target.value
                            if (inputValue === '' || inputValue === '0') {
                              setSalaryDisplay('')
                              field.onChange(0)
                            } else {
                              const formatted = formatNumberInput(inputValue)
                              setSalaryDisplay(formatted.display)
                              field.onChange(formatted.numeric)
                            }
                          }}
                          onBlur={() => {
                            // Update display to match the numeric value
                            if (field.value > 0) {
                              setSalaryDisplay(
                                formatNumberInput(field.value.toString())
                                  .display
                              )
                            } else {
                              setSalaryDisplay('')
                            }
                          }}
                        />
                      </FormControl>
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
                                format(field.value, 'dd/MM/yyyy HH:mm')
                              ) : (
                                <span>Sana va vaqtni tanlang</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                // Keep existing time if available, otherwise set current time
                                const existingTime = field.value || new Date()
                                const newDate = new Date(date)
                                newDate.setHours(existingTime.getHours())
                                newDate.setMinutes(existingTime.getMinutes())
                                field.onChange(newDate)
                              }
                            }}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                          <div className="p-3 border-t">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-medium">
                                Vaqt:
                              </label>
                              <div className="flex space-x-1">
                                <Select
                                  value={
                                    field.value ? format(field.value, 'HH') : ''
                                  }
                                  onValueChange={(hour) => {
                                    if (field.value) {
                                      const newDate = new Date(field.value)
                                      newDate.setHours(parseInt(hour))
                                      field.onChange(newDate)
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-20 h-8">
                                    <SelectValue placeholder="--" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-48 overflow-y-auto">
                                    {Array.from({ length: 24 }, (_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0')}
                                      >
                                        {i.toString().padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span className="text-sm self-center">:</span>
                                <Select
                                  value={
                                    field.value ? format(field.value, 'mm') : ''
                                  }
                                  onValueChange={(minute) => {
                                    if (field.value) {
                                      const newDate = new Date(field.value)
                                      newDate.setMinutes(parseInt(minute))
                                      field.onChange(newDate)
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-20 h-8">
                                    <SelectValue placeholder="--" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-48 overflow-y-auto">
                                    {Array.from({ length: 60 }, (_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0')}
                                      >
                                        {i.toString().padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
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
                      <FormLabel>Topshirish sanasi *</FormLabel>
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
                                format(field.value, 'dd/MM/yyyy HH:mm')
                              ) : (
                                <span>Sana va vaqtni tanlang</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                // Keep existing time if available, otherwise set current time
                                const existingTime = field.value || new Date()
                                const newDate = new Date(date)
                                newDate.setHours(existingTime.getHours())
                                newDate.setMinutes(existingTime.getMinutes())
                                field.onChange(newDate)
                              }
                            }}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                          <div className="p-3 border-t">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-medium">
                                Vaqt:
                              </label>
                              <div className="flex space-x-1">
                                <Select
                                  value={
                                    field.value ? format(field.value, 'HH') : ''
                                  }
                                  onValueChange={(hour) => {
                                    if (field.value) {
                                      const newDate = new Date(field.value)
                                      newDate.setHours(parseInt(hour))
                                      field.onChange(newDate)
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-20 h-8">
                                    <SelectValue placeholder="--" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-48 overflow-y-auto">
                                    {Array.from({ length: 24 }, (_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0')}
                                      >
                                        {i.toString().padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span className="text-sm self-center">:</span>
                                <Select
                                  value={
                                    field.value ? format(field.value, 'mm') : ''
                                  }
                                  onValueChange={(minute) => {
                                    if (field.value) {
                                      const newDate = new Date(field.value)
                                      newDate.setMinutes(parseInt(minute))
                                      field.onChange(newDate)
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-20 h-8">
                                    <SelectValue placeholder="--" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-48 overflow-y-auto">
                                    {Array.from({ length: 60 }, (_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0')}
                                      >
                                        {i.toString().padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comment Field - Only shown when prices are changed */}
                {hasPriceChanges && (
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Izoh <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mahsulot narxi o'zgartirildi. Sababini yozing..."
                            className="resize-none border-red-200 focus:border-red-300"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-red-600">
                          Mahsulot narxi o'zgartirilgan! Izoh majburiy.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Discount Field - Only shown when client has bonus and eligible */}
                {maxDiscount > 0 && (
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Bonus chegirma: {formatCurrency(maxDiscount)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="0"
                            className={cn(
                              maxDiscount > 0 &&
                                (field.value || 0) > maxDiscount
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                            )}
                            value={
                              discountDisplay ||
                              ((field.value || 0) > 0
                                ? formatNumberInput(
                                    (field.value || 0).toString()
                                  ).display
                                : '')
                            }
                            onChange={(e) => {
                              const inputValue = e.target.value
                              if (inputValue === '' || inputValue === '0') {
                                setDiscountDisplay('')
                                field.onChange(0)
                              } else {
                                const formatted = formatNumberInput(inputValue)
                                const numericValue = formatted.numeric

                                // Foydalanuvchi istalgan qiymat kirita oladi
                                // Validatsiya faqat vizual va submit paytida
                                setDiscountDisplay(formatted.display)
                                field.onChange(numericValue)
                              }
                            }}
                            onBlur={() => {
                              // Update display to match the numeric value
                              if ((field.value || 0) > 0) {
                                setDiscountDisplay(
                                  formatNumberInput(
                                    (field.value || 0).toString()
                                  ).display
                                )
                              } else {
                                setDiscountDisplay('')
                              }
                            }}
                          />
                        </FormControl>
                        {maxDiscount > 0 &&
                          (field.value || 0) > maxDiscount && (
                            <p className="text-sm text-red-600">
                              ⚠️ Chegirma maksimal miqdordan oshmasligi kerak!
                            </p>
                          )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right Column: Service Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Xizmat xulosasi</CardTitle>
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

              {/* Mechanic Information */}
              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Usta (ixtiyoriy):</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ismi</span>
                    <span className="text-sm font-medium">
                      {form.watch('mechanic') &&
                      form.watch('mechanic') !== '' &&
                      form.watch('mechanic') !== 'none'
                        ? mechanicsData?.data.find(
                            (m) => m._id === form.watch('mechanic')
                          )?.fullName || 'Tanlanmagan'
                        : 'Tanlanmagan'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maosh</span>
                    <span className="text-sm font-medium">
                      {form.watch('mechanic_salary') > 0
                        ? formatCurrency(form.watch('mechanic_salary'))
                        : 'Belgilanmagan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Total */}
              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Mahsulotlar jami:</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jami narx</span>
                  <span
                    className={`text-sm font-medium ${maxDiscount > 0 && selectedClient?.bonus && 'line-through text-red-500'}`}
                  >
                    {formatCurrency(getTotalProductsSum())}
                  </span>
                </div>

                {maxDiscount > 0 && selectedClient?.bonus && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Chegirma bilan
                    </span>
                    <span className="text-sm font-medium text-green-500">
                      {formatCurrency(
                        getTotalProductsSum() - (form.watch('discount') || 0)
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Discount Information - Only shown when discount > 0 and bonus exists */}
              {maxDiscount > 0 && selectedClient?.bonus?.bonus_type && (
                <div className="p-2 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Bonus chegirma:</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bonus turi</span>
                      <span className="text-sm font-medium">
                        {selectedClient.bonus.bonus_type?.bonus_name || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Maqsad summa
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(
                          selectedClient.bonus.bonus_type?.target_amount || 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Maksimal chegirma
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(maxDiscount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates Information */}
              <div className="p-2 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Sanalar:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Qabul qilish</span>
                    <span className="text-sm font-medium">
                      {form.watch('received_date')
                        ? format(
                            form.watch('received_date'),
                            'dd/MM/yyyy HH:mm'
                          )
                        : 'Tanlanmagan'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Topshirish</span>
                    <span className="text-sm font-medium">
                      {form.watch('delivery_date')
                        ? format(
                            form.watch('delivery_date'),
                            'dd/MM/yyyy HH:mm'
                          )
                        : 'Tanlanmagan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Create Service Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  form="service-form"
                  disabled={
                    isSubmitting ||
                    !selectedClient ||
                    selectedProductsList.length === 0
                  }
                  className="w-full"
                >
                  {isSubmitting ? 'Saqlanmoqda...' : 'Xizmat yaratish'}
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
        onUpdatePrice={updateProductPrice}
        availableProducts={availableProducts}
      />
    </div>
  )
}
