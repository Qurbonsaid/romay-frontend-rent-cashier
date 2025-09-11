import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CalendarIcon, ArrowLeft, Navigation } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import { toast } from 'sonner'
import ProductCard from '@/components/ProductCard'
import ProductSearch from '@/components/ProductSearch'
import type { ProductWarehouseItem } from '@/store/product/types.d'

// Service schema based on the image design
const addServiceSchema = z.object({
  client_name: z.string().min(2, 'Mijoz ismi kamida 2 ta belgi'),
  cash_amount: z.number().min(0, "Naqd miqdor manfiy bo'lmasligi kerak"),
  terminal_amount: z
    .number()
    .min(0, "Terminal miqdor manfiy bo'lmasligi kerak"),
  mechanic: z.string().min(1, 'Usta shart'),
  service_date: z.string().min(1, 'Sana shart'),
  service_end_date: z.string().min(1, 'Sana shart'),
  time_spent: z.string().min(1, 'Ketgan vaqt shart'),
  service_price: z.number().min(0, "Xizmat narxi manfiy bo'lmasligi kerak"),
})

type AddServiceValues = z.infer<typeof addServiceSchema>

export default function AddService() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [paymentDate, setPaymentDate] = useState<Date>()

  // Product state management
  const [selectedProducts, setSelectedProducts] = useState<{
    [productId: string]: { product: ProductWarehouseItem; quantity: number }
  }>({})

  // API queries
  const { data: mechanicsData } = useGetAllMechanicsQuery({
    page: 1,
    limit: 100,
    work_type: 'SERVICE',
  })

  const mechanics = mechanicsData?.data || []

  const form = useForm<AddServiceValues>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      client_name: '',
      cash_amount: 9000000,
      terminal_amount: 0,
      mechanic: '',
      service_date: '',
      service_end_date: '',
      time_spent: '',
      service_price: 0,
    },
  })

  // Product handler functions
  const handleProductSelect = (product: ProductWarehouseItem) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product._id]: { product, quantity: 1 },
    }))
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleProductRemove(productId)
      return
    }

    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantity },
    }))
  }

  const handleProductRemove = (productId: string) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  // Calculate totals
  const selectedProductsList = Object.values(selectedProducts)
  const totalProductsPrice = selectedProductsList.reduce(
    (sum, item) => sum + item.product.product.price * item.quantity,
    0
  )
  const selectedProductIds = Object.keys(selectedProducts)

  // Check permissions
  if (!CheckRole(userRole, ['manager', 'rent_cashier', 'ceo'])) {
    return <Navigation to={'/dashboard'} />
  }

  const onSubmit = async (values: AddServiceValues) => {
    try {
      const serviceData = {
        ...values,
        products: selectedProductsList.map((item) => ({
          product_id: item.product._id,
          product_barcode: item.product.product_barcode,
          quantity: item.quantity,
          price: item.product.product.price,
          total_price: item.product.product.price * item.quantity,
        })),
        total_products_price: totalProductsPrice,
        total_service_price: totalService,
        total_paid: totalPaid,
        debt: debt,
      }

      console.log('Service data:', serviceData)
      toast.success("Xizmat muvaffaqiyatli qo'shildi!")
      navigate('/repairs')
    } catch (error) {
      console.error('Add service error:', error)
      toast.error('Xatolik yuz berdi')
    }
  }

  // Watch form values for dynamic calculations
  const watchedValues = form.watch()
  const selectedMechanic = mechanics.find(
    (m) => m._id === watchedValues.mechanic
  )

  // Calculate dynamic totals
  const servicePrice = watchedValues.service_price || 0
  const cashAmount = watchedValues.cash_amount || 0
  const terminalAmount = watchedValues.terminal_amount || 0
  const totalPaid = cashAmount + terminalAmount
  const totalService = servicePrice + totalProductsPrice
  const debt = totalService - totalPaid

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/repairs')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-[24px] font-semibold text-[#09090B]">Ta'mirlash</h1>
      </div>

      {/* Main Content */}
      <div className="flex-col gap-6">
        {/* Products Section */}
        <div className="bg-white rounded-lg border border-[#E4E4E7] p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Mahsulotlar</h3>

            {/* Product Search */}
            <ProductSearch
              onProductSelect={handleProductSelect}
              selectedProductIds={selectedProductIds}
            />

            {/* Selected Products */}
            {selectedProductsList.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Tanlangan mahsulotlar ({selectedProductsList.length})
                </h4>
                <div className="space-y-2">
                  {selectedProductsList.map(({ product, quantity }) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      quantity={quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleProductRemove}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedProductsList.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Hali mahsulot tanlanmagan</p>
                <p className="text-sm">
                  Mahsulot qo'shish uchun yuqoridagi qidiruv maydonidan
                  foydalaning
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          {/* Left Form */}
          <div className="flex-1 space-y-6">
            {/* Service Form */}
            <div className="bg-white rounded-lg border border-[#E4E4E7] p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Row 1: Mijoz ismi */}
                  <FormField
                    control={form.control}
                    name="client_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Mijoz ismi
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mijoz ismini kiriting"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Row 2: Naqd and Terminal */}
                  <FormField
                    control={form.control}
                    name="cash_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Naqd
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="9 000 000"
                              className="h-10 pr-12"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                              UZS
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terminal_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Terminal
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="0"
                              className="h-10 pr-12"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                              UZS
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Row 3: Usta */}
                  <FormField
                    control={form.control}
                    name="mechanic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Usta
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Ustani tanlang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mechanics.map((mechanic) => (
                              <SelectItem
                                key={mechanic._id}
                                value={mechanic._id}
                              >
                                {mechanic.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Row 4: Xizmat ko'rsatilgan sana */}
                  <FormField
                    control={form.control}
                    name="service_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Xizmat ko'rsatilgan sana
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full h-10 justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), 'dd.MM.yyyy')
                                ) : (
                                  <span>10.08.2025</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(date ? date.toISOString() : '')
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service_end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Xizmat ko'rsatilishi tugatiladigan sana
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full h-10 justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), 'dd.MM.yyyy')
                                ) : (
                                  <span>10.08.2025</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(date ? date.toISOString() : '')
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Xizmat narxi
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="Xizmat narxini kiriting"
                              className="h-10 pr-14"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                              so'm
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="flex-1 bg-white rounded-lg border border-[#E4E4E7] p-6">
            <div className="space-y-4">
              {/* Header Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sana:</span>
                  <span className="font-medium">
                    {format(
                      new Date(watchedValues.service_date || Date.now()),
                      'dd.MM.yy HH:mm'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usta:</span>
                  <span className="font-medium">
                    {selectedMechanic?.fullName || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ketgan vaqt:</span>
                  <span className="font-medium">
                    {watchedValues.time_spent || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Xizmat narxi:</span>
                  <span className="font-medium">
                    {watchedValues.service_price
                      ? `${watchedValues.service_price.toLocaleString()} so'm`
                      : "0 so'm"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maxsulotlar:</span>
                  <span className="font-medium">
                    {totalProductsPrice
                      ? `${totalProductsPrice.toLocaleString()} UZS`
                      : '0 UZS'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Naqd:</span>
                  <span className="font-medium">
                    {watchedValues.cash_amount
                      ? `${watchedValues.cash_amount.toLocaleString()} UZS`
                      : '0 UZS'}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Berildi:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {totalPaid.toLocaleString()} UZS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Qarz:</span>
                  <span
                    className={`font-bold ${debt > 0 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {Math.abs(debt).toLocaleString()} UZS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Jami:</span>
                  <span className="font-bold text-blue-600">
                    {totalService.toLocaleString()} UZS
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Payment Date Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Qarzni berish sanasi
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-10 justify-start text-left font-normal',
                        !paymentDate && 'text-muted-foreground'
                      )}
                    >
                      {paymentDate ? (
                        format(paymentDate, 'dd/MM/yyyy')
                      ) : (
                        <span>KK/OO/YYYY</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={setPaymentDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full h-10 bg-green-600 hover:bg-green-700 text-white"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Yaratish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
