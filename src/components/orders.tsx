import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Download, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'

const customers = [
  {
    id: 1,
    ismi: 'Alijon Vohidov',
    buyurtmaRaqami: '123456',
    buyurtmaSanasi: '12.08.2025',
    totalCost: "1 500 000 so'm",
    payment: "1 500 000 so'm",
    debt: "0 so'm",
    download: false,
  },
  {
    id: 2,
    ismi: 'Nigina Qodirova',
    buyurtmaRaqami: '123456',
    buyurtmaSanasi: '12.08.2025',
    totalCost: "1 500 000 so'm",
    payment: "1 500 000 so'm",
    debt: "0 so'm",
    download: true,
  },
  {
    id: 3,
    ismi: 'Dilshod Ikromov',
    buyurtmaRaqami: '123456',
    buyurtmaSanasi: '12.08.2025',
    totalCost: "1 500 000 so'm",
    payment: "1 500 000 so'm",
    debt: "0 so'm",
    download: false,
  },
  {
    id: 4,
    ismi: 'Madina Sobirova',
    buyurtmaRaqami: '123456',
    buyurtmaSanasi: '12.08.2025',
    totalCost: "1 500 000 so'm",
    payment: "1 500 000 so'm",
    debt: "0 so'm",
    download: true,
  },
]

export default function Orders() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>('all')

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.ismi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.buyurtmaRaqami.includes(searchTerm)

      const matchesPaymentStatus =
        selectedPaymentStatus === 'all' ||
        (selectedPaymentStatus === 'paid' && customer.debt === "0 so'm") ||
        (selectedPaymentStatus === 'debt' && customer.debt !== "0 so'm")

      return matchesSearch && matchesPaymentStatus
    })
  }, [searchTerm, selectedPaymentStatus])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Buyurtmalar
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Mijoz yoki buyurtma raqami bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={selectedPaymentStatus}
            onValueChange={setSelectedPaymentStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="To'lov holati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha holatlar</SelectItem>
              <SelectItem value="paid">To'langan</SelectItem>
              <SelectItem value="debt">Qarzdor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Mijoz</th>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma raqami
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma sanasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Umumiy to'lov summasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                To’lov qilingan summa
              </th>
              <th className="px-6 py-3 text-left font-medium">Qarzdorlik</th>
              <th className="px-6 py-3 text-left font-medium">Yuklab olish</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Buyurtmalar topilmadi
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => navigate(`/ceo/orders/${customer.id}`)}
                >
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {customer.ismi}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {customer.buyurtmaRaqami}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {customer.buyurtmaSanasi}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {customer.totalCost}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {customer.payment}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {customer.debt}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {/* <div className="text-sm text-[#18181B]">{customer.download}</div> */}
                    <Button disabled={!customer.download} variant={'outline'}>
                      <Download /> To'lov cheki
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
