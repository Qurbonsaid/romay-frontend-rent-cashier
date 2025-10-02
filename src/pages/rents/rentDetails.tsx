import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import ProductDetailsModal from '@/components/ProductDetailsModal'
import {
  useGetRentQuery,
  useCompleteRentMutation,
  useCancelRentMutation,
  useUpdateDeliveryDateMutation,
} from '@/store/rent/rent.api'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import { formatCurrency } from '@/utils/numberFormat'
import type { RentProduct } from '@/store/rent/types.d'
import {
  ChevronLeft,
  User,
  Phone,
  Calendar,
  CalendarIcon,
  DollarSign,
  Package,
  Clock,
  AlertCircle,
  Search as SearchIcon,
} from 'lucide-react'

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDateLocal = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Translate API error messages to Uzbek
const translateApiError = (errorMsg: string): string => {
  if (errorMsg.includes('Rent cannot be completed before delivery date')) {
    return 'Ijarani topshirish sanasidan oldin tugata olmaysiz!'
  }
  if (errorMsg.includes('Only rents created today can be deleted')) {
    return "Faqat bugun yaratilgan ijaralarni o'chirish mumkin!"
  }
  if (errorMsg.includes('Product not found')) {
    return "Mahsulotlar bilan bog'liq muammo! Sahifani yangilang yoki administratorga murojaat qiling. (Backend xatoligi: mahsulot topilmadi)"
  }
  if (errorMsg.includes('Rent not found')) {
    return "Ijara topilmadi! Ijara o'chirilgan yoki mavjud emas."
  }
  if (errorMsg.includes('Forbidden')) {
    return "Bu amalni bajarish uchun ruxsatingiz yo'q!"
  }
  if (errorMsg.includes('Unauthorized')) {
    return 'Tizimga kirishingiz kerak!'
  }

  // Default message for unknown errors
  return `Xatolik: ${errorMsg}`
}

// Calculate days overdue for a rental
const calculateDaysOverdue = (deliveryDate: string, status: string): number => {
  if (status !== 'IN_PROGRESS') return 0

  const today = new Date()
  const returnDate = new Date(deliveryDate)
  const timeDiff = today.getTime() - returnDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))

  return daysDiff > 0 ? daysDiff : 0
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Tugallangan'
    case 'IN_PROGRESS':
      return 'Jarayonda'
    case 'CANCELLED':
      return 'Bekor qilingan'
    default:
      return "Noma'lum"
  }
}

export default function RentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userRole = useGetRole()
  const branch = useGetBranch()
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isUpdateDateModalOpen, setIsUpdateDateModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<RentProduct | null>(
    null
  )
  const [newDeliveryDate, setNewDeliveryDate] = useState('')

  // Modal handlers
  const openProductModal = (product: RentProduct) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(false)
  }

  // Update delivery date handler
  const handleUpdateDeliveryDate = async () => {
    try {
      if (!newDeliveryDate) {
        toast.error('Iltimos, yangi topshirish sanasini tanlang')
        return
      }

      await updateDeliveryDate({
        id: id!,
        data: { delivery_date: newDeliveryDate },
      }).unwrap()

      toast.success('Topshirish sanasi muvaffaqiyatli yangilandi')
      setIsUpdateDateModalOpen(false)
      setNewDeliveryDate('')
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as any
        if (apiError.data?.error?.msg) {
          const translatedError = translateApiError(apiError.data.error.msg)
          toast.error(translatedError)
        } else {
          toast.error('Topshirish sanasini yangilashda xatolik yuz berdi')
        }
      } else {
        toast.error('Topshirish sanasini yangilashda xatolik yuz berdi')
      }
    }
  }

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
      } catch {
        // Failed to load exchange rates from localStorage
      }
    }
  }, [])

  const {
    data: rentResponse,
    isLoading,
    isError,
  } = useGetRentQuery(
    {
      id: id!,
      branch: typeof branch === 'object' ? branch._id : branch,
    },
    {
      skip: !id || !CheckRole(userRole, ['rent_cashier']) || !branch,
    }
  )

  const [completeRent, { isLoading: isCompleting }] = useCompleteRentMutation()
  const [cancelRent, { isLoading: isCancelling }] = useCancelRentMutation()
  const [updateDeliveryDate, { isLoading: isUpdatingDate }] =
    useUpdateDeliveryDateMutation()

  // Extract rent data from response
  const rent = rentResponse?.data

  // Branch validation - ensure rent belongs to user's branch
  useEffect(() => {
    if (rent && branch) {
      const rentBranchId =
        typeof rent.branch === 'object' ? rent.branch._id : rent.branch
      const userBranchId = typeof branch === 'object' ? branch._id : branch
      if (rentBranchId !== userBranchId) {
        toast.error('Bu ijara sizning filialingizga tegishli emas')
        navigate('/')
        return
      }
    }
  }, [rent, branch, navigate])

  // Check if rent can be completed (delivery date validation)
  const canCompleteRent = () => {
    if (!rent || rent.status !== 'IN_PROGRESS') return false

    const today = new Date()
    const deliveryDate = new Date(rent.delivery_date)
    today.setHours(0, 0, 0, 0)
    deliveryDate.setHours(0, 0, 0, 0)

    return deliveryDate <= today
  }

  const isBeforeDeliveryDate = () => {
    if (!rent) return false

    const today = new Date()
    const deliveryDate = new Date(rent.delivery_date)
    today.setHours(0, 0, 0, 0)
    deliveryDate.setHours(0, 0, 0, 0)

    return deliveryDate > today
  }
  useEffect(() => {
    if (!CheckRole(userRole, ['rent_cashier'])) {
      toast.error('This application is not for you!')
      navigate('/auth/login')
      return
    }
  }, [userRole, navigate])

  // Early return if user doesn't have permission
  if (!CheckRole(userRole, ['rent_cashier'])) {
    return null
  }

  // Calculate rent products summary
  const calculateProductsSummary = () => {
    if (!rent?.rent_products)
      return { totalQuantity: 0, totalCount: 0, totalSum: 0 }

    const totalQuantity = rent.rent_products.reduce(
      (sum, item) => sum + item.rent_product_count,
      0
    )
    const totalCount = rent.rent_products.length
    const totalSum = rent.total_rent_price || 0

    return { totalQuantity, totalCount, totalSum }
  }

  // Calculate actual total with changed prices
  const calculateActualTotal = () => {
    if (!rent?.rent_products) return 0

    return rent.rent_products.reduce((sum, item) => {
      if (
        typeof item.rent_product === 'object' &&
        item.rent_product?.product_rent_price
      ) {
        const price =
          item.rent_change_price || item.rent_product.product_rent_price
        return sum + price * item.rent_product_count
      }
      return sum
    }, 0)
  }

  // Payment handling functions
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
    } catch {
      // Failed to save exchange rates to localStorage
    }
  }

  const formatExchangeRate = (value: number): string => {
    if (value === 0) return ''
    return value.toLocaleString('en-US').replace(/,/g, ' ')
  }

  const handleFinishRent = async () => {
    try {
      // Check if rent is in progress
      if (rent?.status !== 'IN_PROGRESS') {
        toast.error("Bu ijarani tugata olmaysiz - holati noto'g'ri")
        return
      }

      // Check delivery date
      if (isBeforeDeliveryDate()) {
        toast.error('Ijarani topshirish sanasidan oldin tugata olmaysiz!')
        return
      }

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

      // Complete rent with payments using API
      await completeRent({
        id: id!,
        data: { payments: paymentsToSubmit },
      }).unwrap()

      toast.success('Ijara tugallandi')
      setIsPaymentModalOpen(false)
      // Reset payments
      setPayments({ cash: 0, plastic: 0, terminal: 0, bank: 0, usd: 0, eur: 0 })
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as any
        if (apiError.data?.error?.msg) {
          const translatedError = translateApiError(apiError.data.error.msg)
          toast.error(translatedError)
        } else {
          toast.error('Ijarani tugatishda xatolik yuz berdi')
        }
      } else {
        toast.error('Ijarani tugatishda xatolik yuz berdi')
      }
    }
  }

  // Payment calculation variables
  const totalPayment = calculateTotalPayment()
  const rentTotal = calculateActualTotal() || 0
  const remainingAmount = Math.max(0, rentTotal - totalPayment)
  const isOverpaid = totalPayment > rentTotal && rentTotal > 0
  const isZeroPayment = totalPayment === 0
  const canFinishRent = !isOverpaid && !isZeroPayment

  const productsSummary = calculateProductsSummary()

  // Calculate total paid amount
  const calculateTotalPaid = () => {
    if (!rent?.payments || !Array.isArray(rent.payments)) return 0

    return rent.payments.reduce((sum, payment) => {
      const amount =
        typeof payment === 'object' && payment?.amount ? payment.amount : 0
      return sum + amount
    }, 0)
  }

  const totalPaid = calculateTotalPaid()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Ijara ma'lumotlari</h1>
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

  if (isError || !rent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Ijara ma'lumotlari</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ijara topilmadi
          </h3>
          <p className="text-gray-500 mb-4">
            Kechirasiz, bunday ijara mavjud emas yoki o'chirilgan.
          </p>
          <Button onClick={() => navigate('/')}>
            Ijaralar ro'yxatiga qaytish
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
          <h1 className="text-2xl font-semibold">Ijara ma'lumotlari</h1>
        </div>

        {/* Action Buttons */}
        {rent.status === 'IN_PROGRESS' && (
          <div className="flex flex-col items-end gap-2">
            {isBeforeDeliveryDate() && (
              <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
                ⚠️ Topshirish sanasi: {formatDateLocal(rent.delivery_date)}
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={() => setIsCancelModalOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Bekor qilish
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewDeliveryDate(rent.delivery_date.split('T')[0])
                  setIsUpdateDateModalOpen(true)
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600"
              >
                Sanani o'zgartirish
              </Button>
              <Button
                onClick={() => {
                  if (isBeforeDeliveryDate()) {
                    toast.error(
                      'Ijarani topshirish sanasidan oldin tugata olmaysiz!'
                    )
                    return
                  }
                  setIsPaymentModalOpen(true)
                }}
                disabled={!canCompleteRent()}
                className={`${
                  canCompleteRent()
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                title={
                  isBeforeDeliveryDate()
                    ? `Topshirish sanasi: ${formatDateLocal(rent.delivery_date)}`
                    : 'Ijarani tugatish'
                }
              >
                Tugatish
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Asosiy ma'lumotlar</span>
            <Badge className={getStatusColor(rent.status)}>
              {getStatusText(rent.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Mijoz ma'lumotlari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-blue-600">Mijoz ismi</div>
                  <div className="font-medium text-blue-900">
                    {rent.client_name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-green-600">Telefon raqami</div>
                  <div className="font-medium text-green-900">
                    {rent.client?.phone || "Telefon ko'rsatilmagan"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Mahsulotlar</div>
                <div className="font-medium">
                  {(() => {
                    const summary = calculateProductsSummary()
                    return `${summary.totalCount} dona`
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Jami ijara narxi</div>
                <div className="font-medium">
                  {formatPrice(calculateActualTotal())} so'm
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
                  {formatDateLocal(rent.received_date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">Qaytarish sanasi</div>
                <div className="font-medium">
                  {formatDateLocal(rent.delivery_date)}
                </div>
                {(() => {
                  const daysOverdue = calculateDaysOverdue(
                    rent.delivery_date,
                    rent.status
                  )
                  if (daysOverdue > 0) {
                    return (
                      <div className="flex items-center gap-2 mt-1">
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
              <div className="text-sm text-gray-500">Jami ijara narxi</div>
              <div className="flex items-center justify-center gap-3">
                {(() => {
                  const actualTotal = calculateActualTotal()
                  const originalTotal = rent.total_rent_price

                  if (actualTotal !== originalTotal) {
                    return (
                      <>
                        <div className="text-lg text-red-500 line-through">
                          {formatPrice(originalTotal)} so'm
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(actualTotal)} so'm
                        </div>
                      </>
                    )
                  } else {
                    return (
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(actualTotal)} so'm
                      </div>
                    )
                  }
                })()}
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-500">To'langan summa</div>
              <div className="text-xl font-semibold text-blue-600">
                {formatPrice(totalPaid)} so'm
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-500">Qarz</div>
              <div className="text-xl font-semibold text-orange-600">
                {formatPrice(Math.max(0, calculateActualTotal() - totalPaid))}{' '}
                so'm
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">To'lov holati</div>
              <div className="mt-2">
                <Badge
                  className={
                    totalPaid >= calculateActualTotal()
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {totalPaid >= calculateActualTotal()
                    ? "To'liq to'langan"
                    : "Qisman to'langan"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Payment History - Larger and More Visible */}
          {rent.payments && rent.payments.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-800">
                  To'lov tarixi
                </h4>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {rent.payments.length} ta to'lov
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

                  rent.payments.forEach((payment) => {
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

      {/* Rent Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Ijara mahsulotlari
            </CardTitle>
            {/* Product Summary - Prominent Display */}
            <div className="flex items-center gap-6 bg-blue-50 px-4 py-2 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-blue-600 font-medium">
                  MAHSULOTLAR
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {productsSummary.totalCount}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-green-600 font-medium">
                  JAMI MIQDOR
                </div>
                <div className="text-lg font-bold text-green-900">
                  {productsSummary.totalQuantity}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-600 font-medium">
                  JAMI SUMMA
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {formatCurrency(productsSummary.totalSum)}
                </div>
              </div>
            </div>
          </div>
          {(rent.rent_products?.length || 0) > 10 && (
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
          {(rent.rent_products?.length || 0) > 0 ? (
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
                      {(rent.rent_products || [])
                        .filter((item: RentProduct) => {
                          if (searchTerm === '') return true
                          if (
                            typeof item.rent_product === 'object' &&
                            item.rent_product?.product?.name
                          ) {
                            return item.rent_product.product.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          }
                          return false
                        })
                        .map((rentProduct: RentProduct, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 cursor-pointer h-12"
                            onClick={() => openProductModal(rentProduct)}
                          >
                            {/* Product Column */}
                            <TableCell className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                  <img
                                    src={
                                      (typeof rentProduct.rent_product ===
                                        'object' &&
                                        rentProduct.rent_product?.product
                                          ?.images?.[0]) ||
                                      '/placeholder.png'
                                    }
                                    alt={
                                      typeof rentProduct.rent_product ===
                                        'object' &&
                                      rentProduct.rent_product?.product?.name
                                        ? rentProduct.rent_product.product.name
                                        : "Noma'lum mahsulot"
                                    }
                                    className="w-8 h-8 object-cover rounded border"
                                  />
                                </div>
                                {/* Product Name */}
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-gray-900 text-sm truncate">
                                    {typeof rentProduct.rent_product ===
                                      'object' &&
                                    rentProduct.rent_product?.product?.name
                                      ? rentProduct.rent_product.product.name
                                      : "Noma'lum mahsulot"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Barcode Column */}
                            <TableCell className="px-4 py-2 text-gray-600 text-sm font-mono">
                              {typeof rentProduct.rent_product === 'object' &&
                              rentProduct.rent_product?.product?.barcode
                                ? rentProduct.rent_product.product.barcode
                                : '—'}
                            </TableCell>

                            {/* Category Column */}
                            <TableCell className="px-4 py-2 text-gray-600 text-sm">
                              {typeof rentProduct.rent_product === 'object' &&
                              rentProduct.rent_product?.product?.category_id
                                ? typeof rentProduct.rent_product.product
                                    .category_id === 'object'
                                  ? rentProduct.rent_product.product.category_id
                                      .name
                                  : rentProduct.rent_product.product.category_id
                                : "Noma'lum"}
                            </TableCell>

                            {/* Quantity Column */}
                            <TableCell className="px-4 py-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {rentProduct.rent_product_count}
                              </span>
                            </TableCell>

                            {/* Price Column */}
                            <TableCell className="px-4 py-2 font-medium text-gray-900 text-sm">
                              {typeof rentProduct.rent_product === 'object' &&
                              rentProduct.rent_product?.product_rent_price ? (
                                <div className="flex items-center gap-2">
                                  {rentProduct.rent_change_price &&
                                  rentProduct.rent_change_price !==
                                    rentProduct.rent_product
                                      .product_rent_price ? (
                                    <>
                                      {/* Asl narx - chizilgan, qizil, kichik */}
                                      <span className="text-xs text-red-500 line-through">
                                        {formatPrice(
                                          rentProduct.rent_product
                                            .product_rent_price
                                        )}
                                      </span>
                                      {/* Yangi narx - yashil, katta */}
                                      <span className="text-sm font-bold text-green-600">
                                        {formatPrice(
                                          rentProduct.rent_change_price
                                        )}
                                      </span>
                                    </>
                                  ) : (
                                    /* Odatiy narx */
                                    <span>
                                      {formatPrice(
                                        rentProduct.rent_product
                                          .product_rent_price
                                      )}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                "Narx yo'q"
                              )}
                            </TableCell>

                            {/* Total Column */}
                            <TableCell className="px-4 py-2 font-semibold text-gray-900 text-sm">
                              {typeof rentProduct.rent_product === 'object' &&
                              rentProduct.rent_product?.product_rent_price ? (
                                <span className="text-base">
                                  {formatPrice(
                                    (rentProduct.rent_change_price ||
                                      rentProduct.rent_product
                                        .product_rent_price) *
                                      (rentProduct.rent_product_count || 0)
                                  )}
                                </span>
                              ) : (
                                '—'
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
              Ijara mahsulotlari topilmadi
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ijarani bekor qilish</DialogTitle>
            <DialogDescription>
              Haqiqatan ham bu ijarani bekor qilmoqchimisiz? Bu amalni qaytarib
              bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await cancelRent(id!).unwrap()
                  toast.success('Ijara muvaffaqiyatli bekor qilindi')
                  setIsCancelModalOpen(false)
                } catch (error) {
                  if (error && typeof error === 'object' && 'data' in error) {
                    const apiError = error as any
                    if (apiError.data?.error?.msg) {
                      const translatedError = translateApiError(
                        apiError.data.error.msg
                      )
                      toast.error(translatedError)
                    } else {
                      toast.error('Ijarani bekor qilishda xatolik yuz berdi')
                    }
                  } else {
                    toast.error('Ijarani bekor qilishda xatolik yuz berdi')
                  }
                }
              }}
              disabled={isCancelling}
            >
              {isCancelling ? 'Bekor qilinmoqda...' : 'Ha, bekor qilish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              Ijarani tugatish
            </DialogTitle>
            <DialogDescription>
              To'lov turlarini kiriting va ijarani tugating.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Rent Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Jami summa:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(rentTotal)} so'm
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
              {/* Rent Total */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Ijara narxi:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(rentTotal)} so'm
                </span>
              </div>

              {/* Total Paid */}
              <div className="flex justify-between items-center">
                <span className="font-medium">Jami to'langan:</span>
                <span
                  className={`text-lg font-bold ${isOverpaid ? 'text-red-600' : 'text-blue-600'}`}
                >
                  {formatPrice(totalPayment)} so'm
                </span>
              </div>

              {/* Remaining Amount */}
              {!isOverpaid && remainingAmount > 0 && (
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-gray-600">Qolgan summa:</span>
                  <span className="font-medium text-orange-600">
                    {formatPrice(remainingAmount)} so'm
                  </span>
                </div>
              )}

              {/* Overpaid Amount */}
              {isOverpaid && (
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-gray-600">Ortiqcha to'langan:</span>
                  <span className="font-medium text-red-600">
                    {formatPrice(totalPayment - rentTotal)} so'm
                  </span>
                </div>
              )}

              {/* Warnings */}
              {isOverpaid && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ To'lov miqdori ijara narxidan oshib ketdi!
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
              onClick={handleFinishRent}
              disabled={!canFinishRent || isCompleting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {isCompleting ? 'Tugallanmoqda...' : 'Tugatish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <ProductDetailsModal
        selectedProduct={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        rentChangePrice={selectedProduct?.rent_change_price}
      />

      {/* Update Delivery Date Modal */}
      <Dialog
        open={isUpdateDateModalOpen}
        onOpenChange={setIsUpdateDateModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-yellow-700">
              Topshirish sanasini o'zgartirish
            </DialogTitle>
            <DialogDescription>
              Ijara mahsulotlarining yangi topshirish sanasini tanlang.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current delivery date */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">
                Hozirgi topshirish sanasi:
              </div>
              <div className="font-medium text-gray-900">
                {formatDateLocal(rent.delivery_date)}
              </div>
            </div>

            {/* New delivery date input */}
            <div className="space-y-3">
              <Label
                htmlFor="delivery-date"
                className="text-sm font-medium text-gray-700"
              >
                Yangi topshirish sanasi
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal border-2 border-yellow-200 focus:border-yellow-400',
                      !newDeliveryDate && 'text-muted-foreground'
                    )}
                  >
                    {newDeliveryDate ? (
                      format(new Date(newDeliveryDate), 'dd/MM/yyyy')
                    ) : (
                      <span>Sanani tanlang</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={
                      newDeliveryDate
                        ? new Date(newDeliveryDate + 'T12:00:00')
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        // Format date to YYYY-MM-DD in local timezone
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          '0'
                        )
                        const day = String(date.getDate()).padStart(2, '0')
                        setNewDeliveryDate(`${year}-${month}-${day}`)
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date <= today
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="text-xs text-gray-500">
                Yangi sana ertangi kundan boshlab bo'lishi kerak
              </div>
            </div>

            {/* Preview new date */}
            {newDeliveryDate && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Yangi topshirish sanasi:</span>
                </div>
                <div className="text-lg font-semibold text-yellow-900 mt-1">
                  {formatDateLocal(newDeliveryDate)}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDateModalOpen(false)
                setNewDeliveryDate('')
              }}
              className="border-gray-300"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleUpdateDeliveryDate}
              disabled={!newDeliveryDate || isUpdatingDate}
              className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
            >
              {isUpdatingDate ? "O'zgartirilmoqda..." : 'Saqlash'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
