import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'

// Dummy dataset
const orders = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  date: '02.02.2025',
  number: '123456',
  total: 2040500,
  paid: 1500000,
  debt: 540500,
  downloadable: i % 2 === 1,
  image: '/vite.svg',
}))

function money(n: number, sign: 'neutral' | 'debt' | 'pos' = 'neutral') {
  const text = n.toLocaleString('uz-UZ')
  const cls =
    sign === 'debt'
      ? 'text-rose-600'
      : sign === 'pos'
        ? 'text-emerald-600'
        : 'text-[#18181B]'
  return <span className={cls}>{text}</span>
}

export default function ClientDetails() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-[30px] font-semibold text-[#09090B] mb-4">
        Mijoz haqida
      </h1>
      <div className="border border-[#E4E4E7] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info title="Ismi" value="Hikmatullo" />
            <Info title="segmenti" value="O'ta" />
            <Info title="Filial" value="Surxandaryo, Termiz" />
            <Info title="Phone Number" value="+998 90 123 45 67" />
            <Info title="Kasbi" value="Usta" />
            <Info title="Mijoz Manzili" value="Surxandaryo, Termiz" />
          </div>
          <div className="md:col-span-1">
            <div className="rounded-md border border-[#E4E4E7] p-5">
              <div className="text-sm text-[#71717A]">Balans</div>
              <div className="text-[28px] font-semibold text-rose-600">
                -5,500,000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <div className="px-6 py-3 font-medium text-[#18181B] border-b">
          Buyurtmalari
        </div>
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium"></th>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma sanasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma raqami
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Umumiy to'lov summasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                To'lov qilingan summa
              </th>
              <th className="px-6 py-3 text-left font-medium">Qarzdorlik</th>
              <th className="px-6 py-3 text-left font-medium">Yuklab olish</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-[#F9F9F9]">
                <td className="px-6 py-4">
                  <img src={o.image} alt="" className="w-9 h-9 rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">{o.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">
                    <Link
                      to={`/manager/orders/${o.number}`}
                      className="hover:underline"
                    >
                      {o.number}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">{money(o.total)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">{money(o.paid)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{money(o.debt, 'debt')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button disabled={!o.downloadable} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> To'lov cheki
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

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-0">
      <div className="text-sm text-[#71717A]">{title}</div>
      <div className="text-[16px] font-semibold text-[#18181B]">{value}</div>
    </div>
  )
}
