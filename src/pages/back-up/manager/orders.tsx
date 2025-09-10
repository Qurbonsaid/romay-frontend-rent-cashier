import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const mockOrders = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i + 1),
  orderNumber: `#${1000 + i}`,
  client: `Mijoz ${i + 1}`,
  phone: `+9989${Math.floor(10000000 + Math.random() * 90000000)}`,
  amount: (Math.random() * 1000).toFixed(2),
  date: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-GB'),
  items: Math.floor(Math.random() * 5) + 1,
}))

export default function ManagerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)

      return matchesSearch
    })
  }, [searchTerm])

  return (
    <div className="space-y-6">
      {/* Header with title */}
      <h1 className="text-2xl font-semibold text-[#09090B]">Buyurtmalar</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Qidirish..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Buyurtma raqami
                </th>
                <th className="px-4 py-3 text-left font-medium">Mijoz</th>
                <th className="px-4 py-3 text-left font-medium">
                  Telefon raqami
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Mahsulotlar soni
                </th>
                <th className="px-4 py-3 text-left font-medium">Jami summa</th>
                <th className="px-4 py-3 text-left font-medium">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#F9F9F9] cursor-pointer"
                  onClick={() => navigate(`/manager/orders/${order.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-[#18181B]">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#18181B]">
                    {order.client}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#18181B]">
                    {order.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#18181B]">
                    {order.items} ta
                  </td>
                  <td className="px-4 py-3 text-sm text-[#18181B] font-medium">
                    {parseFloat(order.amount).toLocaleString('en-US')} UZS
                  </td>
                  <td className="px-4 py-3 text-sm text-[#18181B]">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
