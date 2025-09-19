import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  Phone,
  User,
  MapPin,
  Calendar,
  Package,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetOneClientQuery } from '@/store/clients/clients.api'
import { useGetAllRentsQuery } from '@/store/rent/rent.api'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { OrderCard } from '@/components/orders/OrderCard'
import { OrderStatsSummary } from '@/components/orders/OrderStatsSummary'

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
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

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
      page: 1,
      limit: 10,
    },
    {
      skip: !id,
    }
  )

  const client = clientResponse?.data // Get client object directly
  const rents = rentsResponse?.data || []

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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Mijoz ma'lumotlari</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-500">Yuklanmoqda...</div>
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
            Mijoz topilmadi
          </h3>
          <p className="text-gray-500 mb-4">
            Kechirasiz, bunday mijoz mavjud emas yoki o'chirilgan.
          </p>
          <Button onClick={() => navigate('/clients')}>
            Mijozlar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Mijoz ma'lumotlari</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {client.username}
            </h2>
            <p className="text-gray-500 mt-1">ID: {client._id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Qarz</p>
            <div className="text-lg font-semibold">
              <BalanceCell value={client.debt?.amount || 0} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Shaxsiy ma'lumotlar</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{client.phone || 'Mavjud emas'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Manzil</p>
                  <p className="font-medium">
                    {client.address || 'Mavjud emas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Toifa</p>
                  <p className="font-medium">
                    {client.customer_tier || 'Mavjud emas'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Biznes ma'lumotlari</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Sotuvlar soni</p>
                <p className="font-medium text-lg">{client.sales_count || 0}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Filial</p>
                <p className="font-medium">
                  {typeof client.branch_id === 'object' &&
                  client.branch_id?.name
                    ? client.branch_id.name
                    : 'Mavjud emas'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Sana ma'lumotlari</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ro'yxatdan o'tgan</p>
                  <p className="font-medium">
                    {client.created_at
                      ? new Date(client.created_at).toLocaleDateString('en-GB')
                      : 'Mavjud emas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Oxirgi yangilanish</p>
                  <p className="font-medium">
                    {client.updated_at
                      ? new Date(client.updated_at).toLocaleDateString('en-GB')
                      : 'Mavjud emas'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Buyurtmalar tarixi
        </h3>

        {rentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Yuklanmoqda...</span>
          </div>
        ) : rentsError ? (
          <div className="text-center py-8 text-red-600">
            Buyurtmalar tarixi yuklanmadi. Qaytadan urinib ko'ring.
          </div>
        ) : rents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Hozircha buyurtmalar tarixi yo'q
          </div>
        ) : (
          <>
            {/* Order Statistics Summary */}
            <OrderStatsSummary orders={rents} />

            {/* Orders List */}
            <div className="space-y-6">
              {rents.map((rent) => (
                <OrderCard
                  key={rent._id}
                  rent={rent}
                  isExpanded={expandedOrders.has(rent._id)}
                  onToggleExpansion={() => toggleOrderExpansion(rent._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
