import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetRentQuery } from '@/store/rent/rent.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Package,
  CreditCard,
} from 'lucide-react'

interface RentDetailsModalProps {
  rentId: string | null
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
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
      return status
  }
}

export default function RentDetailsModal({
  rentId,
  isOpen,
  onClose,
}: RentDetailsModalProps) {
  const branch = useGetBranch()
  const {
    data: rentData,
    isLoading,
    error,
  } = useGetRentQuery(
    {
      id: rentId!,
      branch: branch?._id,
    },
    {
      skip: !rentId || !isOpen || !branch,
    }
  )

  const rent = rentData?.data

  if (!isOpen || !rentId) return null

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-500">Yuklanmoqda...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !rent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-red-500">Xatolik yuz berdi</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Ijara tafsilotlari
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Holat</span>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rent.status)}`}
              >
                {getStatusText(rent.status)}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Qabul sanasi
                </span>
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(rent.received_date)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Qaytarish sanasi
                </span>
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(rent.delivery_date)}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Mijoz ma'lumotlari
            </h3>
            {rent.client ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Ism</div>
                  <div className="text-sm text-gray-900">
                    {rent.client.username || rent.client_name || "Noma'lum"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Telefon
                  </div>
                  <div className="text-sm text-gray-900">
                    {rent.client.phone || "Telefon ko'rsatilmagan"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Manzil
                  </div>
                  <div className="text-sm text-gray-900">
                    {rent.client.address || "Manzil ko'rsatilmagan"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Kasbi</div>
                  <div className="text-sm text-gray-900">
                    {rent.client.profession || "Kasb ko'rsatilmagan"}
                  </div>
                </div>
                {rent.client.description && (
                  <div className="md:col-span-2">
                    <div className="text-sm font-medium text-gray-700">
                      Tavsif
                    </div>
                    <div className="text-sm text-gray-900">
                      {rent.client.description}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Mijoz ma'lumotlari mavjud emas
              </div>
            )}
          </div>

          {/* Products Information */}
          {/* Rent Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Ijara mahsulotlari
            </h3>
            <div className="space-y-3">
              {rent.rent_products.map((rentProduct, index) => (
                <div
                  key={rentProduct._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {rentProduct.rent_product
                          ? 'Mahsulot'
                          : "Noma'lum mahsulot"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Miqdori: {rentProduct.rent_product_count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              To'lov ma'lumotlari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Jami ijara narxi
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatPrice(rent.total_rent_price || 0)} so'm
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  To'lovlar soni
                </div>
                <div className="text-sm text-gray-900">
                  {rent.payments && Array.isArray(rent.payments)
                    ? rent.payments.length
                    : 0}{' '}
                  ta
                </div>
              </div>
            </div>

            {rent.payments && rent.payments.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  To'lovlar tarixi
                </div>
                <div className="space-y-2">
                  {rent.payments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">
                        To'lov #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {typeof payment === 'object' && payment?.amount
                          ? `${formatPrice(payment.amount)} so'm`
                          : "Summa ko'rsatilmagan"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Client Debt Information */}
          {rent.client?.debt && rent.client.debt.total_amount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Mijoz qarzi
              </h3>
              <div className="text-xl font-bold text-red-600">
                {formatPrice(rent.client.debt.total_amount)}{' '}
                {rent.client.debt.currency}
              </div>
              <div className="text-sm text-red-700 mt-1">
                Sotuvdan: {formatPrice(rent.client.debt.sale_amount)}{' '}
                {rent.client.debt.currency}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <span className="font-medium">Yaratilgan:</span>{' '}
              {formatDate(rent.created_at)}
            </div>
            <div>
              <span className="font-medium">Yangilangan:</span>{' '}
              {formatDate(rent.updated_at)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
