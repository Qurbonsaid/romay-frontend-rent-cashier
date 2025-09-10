import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Buyurtmalar
        </h1>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filialni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Filiallar</SelectItem>
              <SelectItem value="filial1">Termiz Filiali</SelectItem>
              <SelectItem value="filial2">Filial 2</SelectItem>
              <SelectItem value="filial3">Filial 3</SelectItem>
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
            {customers.map((customer) => (
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
                  <div className="text-sm text-[#18181B]">{customer.debt}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {/* <div className="text-sm text-[#18181B]">{customer.download}</div> */}
                  <Button disabled={!customer.download} variant={'outline'}>
                    <Download /> To'lov cheki
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
