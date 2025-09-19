import { Card, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
} from 'lucide-react'
import type { Rent } from '@/store/rent/types'

interface OrderStatsSummaryProps {
  orders: Rent[]
}

export function OrderStatsSummary({ orders }: OrderStatsSummaryProps) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total_rent_price,
    0
  )
  const totalPaid = orders.reduce(
    (sum, order) =>
      sum + order.payments.reduce((pSum, payment) => pSum + payment.amount, 0),
    0
  )
  const activeOrders = orders.filter(
    (order) => order.status === 'IN_PROGRESS'
  ).length
  const completedOrders = orders.filter(
    (order) => order.status === 'COMPLETED'
  ).length

  const stats = [
    {
      title: 'Jami buyurtmalar',
      value: totalOrders.toString(),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      title: 'Jami summa',
      value: `${totalRevenue.toLocaleString('uz-UZ')} so'm`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      title: "To'langan",
      value: `${totalPaid.toLocaleString('uz-UZ')} so'm`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      title: 'Faol buyurtmalar',
      value: activeOrders.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
    },
  ]

  if (totalOrders === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Buyurtmalar statistikasi
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${stat.bg} ${stat.border} text-center`}
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Additional Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">{completedOrders}</div>
              <div className="text-gray-500">Yakunlangan</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {totalOrders > 0
                  ? Math.round((totalPaid / totalRevenue) * 100)
                  : 0}
                %
              </div>
              <div className="text-gray-500">To'lov foizi</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {totalOrders > 0
                  ? Math.round(totalRevenue / totalOrders).toLocaleString(
                      'uz-UZ'
                    )
                  : 0}
              </div>
              <div className="text-gray-500">O'rtacha summa</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {(totalRevenue - totalPaid).toLocaleString('uz-UZ')}
              </div>
              <div className="text-gray-500">Qarz (so'm)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
