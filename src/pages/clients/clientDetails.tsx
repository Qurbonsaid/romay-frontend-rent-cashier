import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  User,
  Package,
  Phone,
  MapPin,
  Calendar,
  Gift,
  TrendingUp,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetOneClientQuery } from '@/store/clients/clients.api'
import { useGetAllRentsQuery } from '@/store/rent/rent.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { OrderCard } from '@/components/orders/OrderCard'
import { OrderStatsSummary } from '@/components/orders/OrderStatsSummary'
import { Skeleton } from '@/components/ui/skeleton'
import { TablePagination } from '@/components/ui/table-pagination'

function BalanceCell({ value }: { value: number }) {
  const isZero = value === 0
  const isNegative = value < 0
  const formatted =
    (isNegative ? '-' : '') + Math.abs(value).toLocaleString('uz-UZ') + " so'm"
  return (
    <span
      className={
        isZero
          ? 'text-emerald-600'
          : isNegative
            ? 'text-rose-600'
            : 'text-emerald-600'
      }
    >
      {isZero ? "0 so'm" : formatted}
    </span>
  )
}

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const branch = useGetBranch()
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const {
    data: clientResponse,
    isLoading,
    isError,
  } = useGetOneClientQuery(id!, {
    skip: !id,
  })

  const {
    data: rentsResponse,
    isLoading: rentsLoading,
    isError: rentsError,
  } = useGetAllRentsQuery(
    {
      client: id!,
      page: currentPage,
      limit: limit,
      branch: typeof branch === 'object' ? branch._id : branch,
    },
    {
      skip: !id,
    }
  )

  const client = clientResponse?.data // Get client object directly
  const rents = rentsResponse?.data || []
  const pagination = {
    current_page: rentsResponse?.current_page || 1,
    page_count: rentsResponse?.page_count || 1,
    after_filtering_count: rentsResponse?.after_filtering_count || 0,
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLimit(itemsPerPage)
    setCurrentPage(1)
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Mijoz ma'lumotlari</h1>
        </div>

        {/* Skeleton for Client Info Card */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-3 w-20 mx-auto mb-2" />
                <Skeleton className="h-5 w-12 mx-auto" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton for Orders Section */}
        <div className="bg-white rounded-lg border p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Mijoz ma'lumotlari</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isError ? "Ma'lumotlarni yuklashda xatolik" : 'Mijoz topilmadi'}
          </h3>
          <p className="text-gray-500 mb-4">
            {isError
              ? "Mijoz ma'lumotlarini yuklashda xatolik yuz berdi"
              : 'Bunday mijoz mavjud emas yoki o`chirilgan'}
          </p>
          <Button onClick={() => navigate('/clients')}>
            Mijozlar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Mijoz ma'lumotlari</h1>
      </div>

      {/* Main Client Info Card - Compact */}
      <div className="bg-white rounded-lg border p-4">
        {/* Client Header - Most Important Info */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {client.username}
              </h2>
              <p className="text-sm text-gray-600">
                {client.phone || 'Telefon kiritilmagan'}
              </p>
            </div>
          </div>

          {/* Debt Status - Prominent */}
          <div className="text-right bg-gray-50 px-4 py-3 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">QARZ</p>
            <div className="text-xl font-bold">
              <BalanceCell value={client.debt?.amount || 0} />
            </div>
          </div>
        </div>

        {/* Key Information - Compact Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">SERVISLAR</div>
            <div className="text-lg font-bold text-blue-900">
              {client.service_count || 0}
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">IJARALAR</div>
            <div className="text-lg font-bold text-blue-900">
              {client.rent_count || 0}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 font-medium">TOIFA</div>
            <div className="text-lg font-bold text-green-900">
              {client.customer_tier || 'Oddiy'}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-600 font-medium">MANZIL</div>
            <div className="text-sm font-medium text-purple-900 truncate">
              {client.address || 'Kiritilmagan'}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-600 font-medium">RO'YXAT</div>
            <div className="text-sm font-medium text-orange-900">
              {client.created_at
                ? new Date(client.created_at).toLocaleDateString('en-GB')
                : "Noma'lum"}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-4 w-4" />
              Shaxsiy ma'lumotlar
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Telefon:</span>
                <span className="font-medium">
                  {client.phone || 'Kiritilmagan'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Manzil:</span>
                <span className="font-medium">
                  {client.address || 'Kiritilmagan'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Biznes ma'lumotlari
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Servislar soni:</span>
                <span className="font-medium ml-2">
                  {client.service_count || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Ijaralar soni:</span>
                <span className="font-medium ml-2">
                  {client.rent_count || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Sana ma'lumotlari
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Ro'yxatdan o'tgan:</span>
                <span className="font-medium ml-2">
                  {client.created_at
                    ? new Date(client.created_at).toLocaleDateString('en-GB')
                    : "Noma'lum"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Oxirgi yangilanish:</span>
                <span className="font-medium ml-2">
                  {client.updated_at
                    ? new Date(client.updated_at).toLocaleDateString('en-GB')
                    : "Noma'lum"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Information - If exists */}
      {client.bonus && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Bonus ma'lumotlari
              </h3>
            </div>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
              Faol
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Bonus Type Name */}
            <div className="bg-white/70 backdrop-blur p-2 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-amber-600" />
                <span className="text-xs text-gray-600">Bonus turi</span>
              </div>
              <p className="text-sm font-bold text-amber-900">
                {client.bonus.bonus_type?.bonus_name || 'Noma`lum'}
              </p>
            </div>

            {/* Target Amount */}
            <div className="bg-white/70 backdrop-blur p-2 rounded-lg">
              <span className="text-xs text-gray-600 block mb-1">
                Maqsad summasi
              </span>
              <p className="text-sm font-bold text-gray-900">
                {(client.bonus.bonus_type?.target_amount || 0).toLocaleString(
                  'uz-UZ'
                )}{' '}
                so'm
              </p>
            </div>

            {/* Client Discount */}
            <div className="bg-white/70 backdrop-blur p-2 rounded-lg">
              <span className="text-xs text-gray-600 block mb-1">Chegirma</span>
              <p className="text-sm font-bold text-emerald-600">
                {(client.bonus.client_discount_amount || 0).toLocaleString(
                  'uz-UZ'
                )}{' '}
                so'm
              </p>
            </div>

            {/* Bonus Period */}
            <div className="bg-white/70 backdrop-blur p-2 rounded-lg">
              <span className="text-xs text-gray-600 block mb-1">
                Amal qilish muddati
              </span>
              <p className="text-xs font-medium text-gray-900">
                {client.bonus.start_date
                  ? new Date(client.bonus.start_date).toLocaleDateString(
                      'en-GB'
                    )
                  : '?'}{' '}
                -{' '}
                {client.bonus.end_date
                  ? new Date(client.bonus.end_date).toLocaleDateString('en-GB')
                  : '?'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders History - Compact */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Buyurtmalar tarixi</h3>
          {rents.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {rents.length}
            </span>
          )}
        </div>

        {rentsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : rentsError ? (
          <div className="text-center py-6 space-y-3">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-red-600 text-sm font-medium">
              Buyurtmalar yuklanmadi. Iltimos, sahifani yangilang.
            </p>
          </div>
        ) : rents.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            Hozircha buyurtmalar tarixi yo'q
          </div>
        ) : (
          <div className="space-y-4">
            {/* Order Statistics Summary - Compact */}
            <OrderStatsSummary orders={rents} />

            {/* Orders List - Compact */}
            <div className="space-y-3">
              {rents.map((rent) => (
                <OrderCard
                  key={rent._id}
                  rent={rent}
                  isExpanded={expandedOrders.has(rent._id)}
                  onToggleExpansion={() => toggleOrderExpansion(rent._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.after_filtering_count > 0 && (
              <TablePagination
                currentPage={pagination.current_page}
                totalPages={pagination.page_count}
                totalItems={pagination.after_filtering_count}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
