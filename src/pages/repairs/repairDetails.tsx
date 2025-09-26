import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetServiceQuery } from '@/store/service/service.api'
import {
  useCancelServiceMutation,
  useCompleteServiceMutation,
} from '@/store/service/service.api'
import ProductDetailsModal from '@/components/product-details-modal'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import { formatCurrency } from '@/utils/numberFormat'
import type { ProductWarehouseItem } from '@/store/product/types'
import {
  ChevronLeft,
  User,
  Phone,
  Calendar,
  DollarSign,
  Package,
  Wrench,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default function RepairDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userRole = useGetRole()
  const branch = useGetBranch()
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWarehouseItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Payment form state
  const [payments, setPayments] = useState({
    cash: 0,
    plastic: 0,
    terminal: 0,
    bank: 0,
    usd: 0,
    eur: 0,
  })

  // Exchange rates state (adjustable and persistent)
  const [exchangeRates, setExchangeRates] = useState({
    usd: 12810,
    eur: 14310,
  })

  // Load exchange rates from localStorage on mount
  useEffect(() => {
    const savedRates = localStorage.getItem('exchangeRates')
    if (savedRates) {
      try {
        const rates = JSON.parse(savedRates)
        setExchangeRates(rates)
      } catch (error) {
        console.warn('Failed to load exchange rates from localStorage:', error)
      }
    }
  }, [])

  const {
    data: serviceResponse,
    isLoading,
    isError,
  } = useGetServiceQuery(
    {
      id: id!,
      branch: branch?._id,
    },
    {
      skip: !id || !CheckRole(userRole, ['rent_cashier']) || !branch,
    }
  )

  const [cancelService, { isLoading: isCanceling }] = useCancelServiceMutation()
  const [completeService, { isLoading: isCompleting }] =
    useCompleteServiceMutation()

  // Check permissions - only allow rent_cashier role
  useEffect(() => {
    if (!CheckRole(userRole, ['rent_cashier'])) {
      toast.error('Bu ilova siz uchun emas!')
      navigate('/auth/login')
      return
    }
  }, [userRole, navigate])

  // Early return if user doesn't have permission
  if (!CheckRole(userRole, ['rent_cashier'])) {
    return null
  }

  const service = serviceResponse?.data
  // The mechanic is already included in the service response
  const mechanic = service?.mechanic

  // Calculate products summary
  const calculateProductsSummary = () => {
    if (!service?.products)
      return { totalQuantity: 0, totalCount: 0, totalSum: 0 }

    const totalQuantity = service.products.reduce(
      (sum, item) => sum + item.product_count,
      0
    )
    const totalCount = service.products.length
    const totalSum = service.products.reduce((sum, item) => {
      // Handle both cases: when product is embedded object or just ID
      let price = 0
      if (
        typeof item.product === 'object' &&
        item.product &&
        'price' in item.product
      ) {
        price = item.product.price || 0
      }
      return sum + item.product_count * price
    }, 0)

    return { totalQuantity, totalCount, totalSum }
  }

  const productsSummary = calculateProductsSummary()

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleCancelService = async () => {
    try {
      await cancelService(id!).unwrap()
      toast.success('Xizmat bekor qilindi')
      setIsCancelModalOpen(false)
      // Optionally navigate back or refresh data
    } catch {
      toast.error('Xizmatni bekor qilishda xatolik yuz berdi')
    }
  }

  const handleFinishService = async () => {
    try {
      // Convert USD and EUR to UZS for payment submission
      const paymentsToSubmit = []

      if (payments.cash > 0)
        paymentsToSubmit.push({ type: 'cash', amount: payments.cash })
      if (payments.plastic > 0)
        paymentsToSubmit.push({ type: 'plastic', amount: payments.plastic })
      if (payments.terminal > 0)
        paymentsToSubmit.push({ type: 'terminal', amount: payments.terminal })
      if (payments.bank > 0)
        paymentsToSubmit.push({ type: 'bank', amount: payments.bank })
      if (payments.usd > 0)
        paymentsToSubmit.push({
          type: 'usd',
          amount: payments.usd * exchangeRates.usd,
        })
      if (payments.eur > 0)
        paymentsToSubmit.push({
          type: 'eur',
          amount: payments.eur * exchangeRates.eur,
        })

      await completeService({
        id: id!,
        payments: paymentsToSubmit,
      }).unwrap()

      toast.success('Xizmat tugallandi')
      setIsPaymentModalOpen(false)
      // Reset payments
      setPayments({ cash: 0, plastic: 0, terminal: 0, bank: 0, usd: 0, eur: 0 })
    } catch {
      toast.error('Xizmatni tugatishda xatolik yuz berdi')
    }
  }

  const handlePaymentChange = (type: keyof typeof payments, value: string) => {
    // Remove all non-digit characters for parsing
    const cleanValue = value.replace(/\D/g, '')
    const numericValue = parseFloat(cleanValue) || 0
    setPayments((prev) => ({ ...prev, [type]: numericValue }))
  }

  const formatPaymentValue = (value: number): string => {
    if (value === 0) return ''
    return value.toLocaleString('en-US').replace(/,/g, ' ')
  }

  const calculateTotalPayment = (): number => {
    const { cash, plastic, terminal, bank, usd, eur } = payments
    const usdInUzs = usd * exchangeRates.usd
    const eurInUzs = eur * exchangeRates.eur
    return cash + plastic + terminal + bank + usdInUzs + eurInUzs
  }

  const handleExchangeRateChange = (currency: 'usd' | 'eur', value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    const numericValue = parseFloat(cleanValue) || 0
    const newRates = { ...exchangeRates, [currency]: numericValue }
    setExchangeRates(newRates)

    // Save to localStorage
    try {
      localStorage.setItem('exchangeRates', JSON.stringify(newRates))
    } catch (error) {
      console.warn('Failed to save exchange rates to localStorage:', error)
    }
  }

  const formatExchangeRate = (value: number): string => {
    if (value === 0) return ''
    return value.toLocaleString('en-US').replace(/,/g, ' ')
  }

  const totalPayment = calculateTotalPayment()
  const serviceTotal = service?.totalAmount || 0
  const remainingAmount = Math.max(0, serviceTotal - totalPayment)
  const isOverpaid = totalPayment > serviceTotal && serviceTotal > 0
  const isZeroPayment = totalPayment === 0
  const canFinishService = !isOverpaid && !isZeroPayment

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm"
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  // Calculate days overdue for a rental
  const calculateDaysOverdue = (
    deliveryDate: string,
    status: string
  ): number => {
    if (status !== 'IN_PROGRESS') return 0

    const today = new Date()
    const returnDate = new Date(deliveryDate)
    const timeDiff = today.getTime() - returnDate.getTime()
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))

    return daysDiff > 0 ? daysDiff : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Jarayonda'
      case 'COMPLETED':
        return 'Tugallangan'
      case 'CANCELLED':
        return 'Bekor qilingan'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Xizmat ma'lumotlari</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-500">Yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Xizmat ma'lumotlari</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Xizmat topilmadi
          </h3>
          <p className="text-gray-500 mb-4">
            Kechirasiz, bunday xizmat mavjud emas yoki o'chirilgan.
          </p>
          <Button onClick={() => navigate('/repairs')}>
            Xizmatlar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Xizmat ma'lumotlari</h1>
        </div>

        {/* Action Buttons */}
        {service.status === 'IN_PROGRESS' && (
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={() => setIsCancelModalOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Tugatish
            </Button>
          </div>
        )}
      </div>

      {/* Main Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Asosiy ma'lumotlar</span>
            <Badge className={getStatusColor(service.status)}>
              {getStatusText(service.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* First Row: Client, Phone, Mechanic */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Mijoz</div>
                <div className="font-medium">{service.client_name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Telefon</div>
                <div className="font-medium">{service.client_phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Wrench className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Usta</div>
                <div className="font-medium">
                  {mechanic?.fullName || "Noma'lum"}
                </div>
              </div>
            </div>

            {/* Second Row: Mechanic Salary, Products Total, Received Date, Delivery Date */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Usta maoshi</div>
                <div className="font-medium">
                  {formatPrice(service.mechanic_salary)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Xizmat narxi</div>
                <div className="font-medium">
                  {formatPrice(service.totalAmount)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Qabul qilingan</div>
                <div className="font-medium">
                  {formatDate(service.received_date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Topshirish sanasi</div>
                <div className={`font-medium`}>
                  {formatDate(service.delivery_date)}
                </div>
                {(() => {
                  const daysOverdue = calculateDaysOverdue(
                    service.delivery_date,
                    service.status
                  )
                  if (daysOverdue > 0) {
                    return (
                      <div className="flex items-start gap-2 mt-1">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          {daysOverdue} kun kechiktirilgan
                        </span>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Moliyaviy ma'lumotlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-500">Umumiy summa</div>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(service.totalAmount)}
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-500">Usta maoshi</div>
              <div className="text-xl font-semibold text-blue-600">
                {formatPrice(service.mechanic_salary)}
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Mahsulotlar summasi</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatCurrency(productsSummary.totalSum)}
              </div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-500">Mahsulotlar miqdori</div>
              <div className="text-xl font-semibold text-yellow-600">
                {productsSummary.totalQuantity}
              </div>
            </div>
          </div>

          {/* Payment History - Larger and More Visible */}
          {service.payments && service.payments.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-800">
                  To'lov tarixi
                </h4>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {service.payments.length} ta to'lov
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(() => {
                  // Group payments by type and sum amounts
                  const paymentSummary = {
                    cash: 0,
                    plastic: 0,
                    terminal: 0,
                    bank: 0,
                    usd: 0,
                    eur: 0,
                  }

                  service.payments.forEach((payment) => {
                    if (payment.type in paymentSummary) {
                      paymentSummary[
                        payment.type as keyof typeof paymentSummary
                      ] += payment.amount
                    }
                  })

                  const paymentTypes = [
                    { key: 'cash', label: 'Naqd', color: 'green' },
                    { key: 'plastic', label: 'Plastik', color: 'blue' },
                    { key: 'terminal', label: 'Terminal', color: 'purple' },
                    { key: 'bank', label: 'Bank', color: 'orange' },
                    { key: 'usd', label: 'Dollar', color: 'emerald' },
                    { key: 'eur', label: 'Euro', color: 'indigo' },
                  ]

                  return paymentTypes.map(({ key, label, color }) => (
                    <div
                      key={key}
                      className={`bg-${color}-50 p-3 rounded-lg border border-${color}-200`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-xs font-medium text-${color}-700 mb-1`}
                          >
                            {label}
                          </div>
                          <div
                            className={`text-sm font-bold text-${color}-900`}
                          >
                            {formatPrice(
                              paymentSummary[key as keyof typeof paymentSummary]
                            )}{' '}
                            <span className="text-xs">so'm</span>
                          </div>
                        </div>
                        <div className={`p-1 bg-white rounded-full`}>
                          <DollarSign className={`h-3 w-3 text-${color}-600`} />
                        </div>
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mahsulotlar ({service.products.length})
            </CardTitle>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Jami miqdor: {productsSummary.totalQuantity}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(productsSummary.totalSum)}
              </div>
            </div>
          </div>
          {service.products.length > 10 && (
            <div className="relative mt-4">
              <Input
                type="text"
                placeholder="Mahsulotlarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {service.products.length > 0 ? (
            <div className="space-y-4">
              {/* Products Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mahsulot
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Barcode
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategoriya
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Miqdor
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Narx
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jami
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.products
                        .filter((item) => {
                          if (searchTerm === '') return true
                          if (
                            typeof item.product === 'object' &&
                            item.product?.name
                          ) {
                            return item.product.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          }
                          return false
                        })
                        .map((productItem, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              // Pass the whole productItem which has the ProductWarehouseItem structure
                              if (
                                typeof productItem.product === 'object' &&
                                productItem.product
                              ) {
                                setSelectedProduct(productItem as any)
                                setIsModalOpen(true)
                              }
                            }}
                          >
                            {/* Product Column */}
                            <TableCell className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                  {typeof productItem.product === 'object' &&
                                  productItem.product?.images &&
                                  productItem.product.images.length > 0 ? (
                                    <img
                                      src={productItem.product.images[0]}
                                      alt={productItem.product.name}
                                      className="w-10 h-10 object-cover rounded border"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement
                                        target.src =
                                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMEMyNS41MjI5IDMwIDMwIDI1LjUyMjkgMzAgMjBDMzAgMTQuNDc3MSAyNS41MjI5IDEwIDIwIDEwQzE0LjQ3NzEgMTAgMTAgMTQuNDc3MSAxMCAyMEMxMCAyNS41MjI5IDE0LjQ3NzEgMzAgMjAgMzBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNCAyMEwxNy41IDIzLjVMMjYgMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=='
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
                                      <span className="text-gray-400 text-sm">
                                        📦
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {/* Product Name */}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {typeof productItem.product === 'object' &&
                                    productItem.product?.name
                                      ? productItem.product.name
                                      : "Noma'lum mahsulot"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Barcode Column */}
                            <TableCell className="px-4 py-4">
                              <span className="font-mono text-sm bg-blue-50 px-2 py-1 rounded border">
                                {typeof productItem.product === 'object' &&
                                productItem.product?.barcode
                                  ? productItem.product.barcode
                                  : 'N/A'}
                              </span>
                            </TableCell>

                            {/* Category Column */}
                            <TableCell className="px-4 py-4 text-gray-600">
                              {typeof productItem.product === 'object' &&
                              productItem.product?.category_id
                                ? typeof productItem.product.category_id ===
                                  'object'
                                  ? productItem.product.category_id.name
                                  : productItem.product.category_id
                                : "Noma'lum"}
                            </TableCell>

                            {/* Quantity Column */}
                            <TableCell className="px-4 py-4">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                {productItem.product_count}
                              </span>
                            </TableCell>

                            {/* Price Column */}
                            <TableCell className="px-4 py-4 font-medium text-gray-900">
                              {formatPrice(
                                typeof productItem.product === 'object' &&
                                  productItem.product?.price
                                  ? productItem.product.price
                                  : 0
                              )}
                            </TableCell>

                            {/* Total Column */}
                            <TableCell className="px-4 py-4 font-semibold text-gray-900">
                              {formatPrice(
                                productItem.product_count *
                                  (typeof productItem.product === 'object' &&
                                  productItem.product?.price
                                    ? productItem.product.price
                                    : 0)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Hech qanday mahsulot yo'q
            </div>
          )}
        </CardContent>
      </Card>

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />

      {/* Cancel Service Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Xizmatni bekor qilish
            </DialogTitle>
            <DialogDescription>
              Rostdan ham bu xizmatni bekor qilmoqchimisiz? Bu amalni qaytarib
              bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Yo'q
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelService}
              disabled={isCanceling}
            >
              {isCanceling ? 'Yuklanmoqda...' : 'Ha, bekor qil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              Xizmatni tugatish
            </DialogTitle>
            <DialogDescription>
              To'lov turlarini kiriting va xizmatni tugating.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Service Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Jami summa:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(service.totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cash */}
              <div className="space-y-2">
                <Label htmlFor="cash" className="text-sm font-medium">
                  Naqd
                </Label>
                <Input
                  id="cash"
                  type="text"
                  placeholder="0"
                  value={formatPaymentValue(payments.cash)}
                  onChange={(e) => handlePaymentChange('cash', e.target.value)}
                />
                <div className="text-xs text-gray-500">UZS</div>
              </div>

              {/* Plastic */}
              <div className="space-y-2">
                <Label htmlFor="plastic" className="text-sm font-medium">
                  Plastik
                </Label>
                <Input
                  id="plastic"
                  type="text"
                  placeholder="0"
                  value={formatPaymentValue(payments.plastic)}
                  onChange={(e) =>
                    handlePaymentChange('plastic', e.target.value)
                  }
                />
                <div className="text-xs text-gray-500">UZS</div>
              </div>

              {/* Terminal */}
              <div className="space-y-2">
                <Label htmlFor="terminal" className="text-sm font-medium">
                  Terminal
                </Label>
                <Input
                  id="terminal"
                  type="text"
                  placeholder="0"
                  value={formatPaymentValue(payments.terminal)}
                  onChange={(e) =>
                    handlePaymentChange('terminal', e.target.value)
                  }
                />
                <div className="text-xs text-gray-500">UZS</div>
              </div>

              {/* Bank */}
              <div className="space-y-2">
                <Label htmlFor="bank" className="text-sm font-medium">
                  Bank (hisob raqamidan to'lov)
                </Label>
                <Input
                  id="bank"
                  type="text"
                  placeholder="0"
                  value={formatPaymentValue(payments.bank)}
                  onChange={(e) => handlePaymentChange('bank', e.target.value)}
                />
                <div className="text-xs text-gray-500">UZS</div>
              </div>

              {/* USD and EUR - Side by Side */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* USD Column */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dollar</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        id="usd"
                        type="text"
                        placeholder="0"
                        value={formatPaymentValue(payments.usd)}
                        onChange={(e) =>
                          handlePaymentChange('usd', e.target.value)
                        }
                        className="text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">
                        USD
                      </div>
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={formatExchangeRate(exchangeRates.usd)}
                        onChange={(e) =>
                          handleExchangeRateChange('usd', e.target.value)
                        }
                        className="text-center"
                        placeholder="12 810"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">
                        UZS
                      </div>
                    </div>
                  </div>
                </div>

                {/* EUR Column */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Euro</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        id="eur"
                        type="text"
                        placeholder="0"
                        value={formatPaymentValue(payments.eur)}
                        onChange={(e) =>
                          handlePaymentChange('eur', e.target.value)
                        }
                        className="text-center"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">
                        EUR
                      </div>
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={formatExchangeRate(exchangeRates.eur)}
                        onChange={(e) =>
                          handleExchangeRateChange('eur', e.target.value)
                        }
                        className="text-center"
                        placeholder="14 310"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">
                        UZS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div
              className={`p-4 rounded-lg space-y-3 ${isOverpaid ? 'bg-red-50' : 'bg-blue-50'}`}
            >
              {/* Service Total */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Xizmat narxi:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(serviceTotal)}
                </span>
              </div>

              {/* Total Paid */}
              <div className="flex justify-between items-center">
                <span className="font-medium">Jami to'langan:</span>
                <span
                  className={`text-lg font-bold ${isOverpaid ? 'text-red-600' : 'text-blue-600'}`}
                >
                  {formatPrice(totalPayment)}
                </span>
              </div>

              {/* Remaining Amount */}
              {!isOverpaid && remainingAmount > 0 && (
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-gray-600">Qolgan summa:</span>
                  <span className="font-medium text-orange-600">
                    {formatPrice(remainingAmount)}
                  </span>
                </div>
              )}

              {/* Overpaid Amount */}
              {isOverpaid && (
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-gray-600">Ortiqcha to'langan:</span>
                  <span className="font-medium text-red-600">
                    {formatPrice(totalPayment - serviceTotal)}
                  </span>
                </div>
              )}

              {/* Warnings */}
              {isOverpaid && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ To'lov miqdori xizmat narxidan oshib ketdi!
                </div>
              )}
              {isZeroPayment && (
                <div className="mt-2 text-sm text-orange-600">
                  ⚠️ To'lov miqdorini kiriting!
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleFinishService}
              disabled={isCompleting || !canFinishService}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {isCompleting ? 'Yuklanmoqda...' : 'Tugatish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="21 21l-4.35-4.35" />
    </svg>
  )
}
