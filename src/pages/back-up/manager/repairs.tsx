import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export type RepairRow = {
  id: string
  place: string
  manager: string
  manager2: string
  productsCount: number
  servicePrice: string
  date: string
}

const mockRows: RepairRow[] = [
  {
    id: '1',
    place: "Tramiz shahri 'bolol rarshid' MCHJ",
    manager: 'Kissiah Balassa',
    manager2: 'Kissiah Balassa',
    productsCount: 20,
    servicePrice: '2 540 000',
    date: '25.06.2025',
  },
  {
    id: '2',
    place: "Tramiz shahri 'bolol rarshid' MCHJ",
    manager: 'Jemie Chessman',
    manager2: 'Kissiah Balassa',
    productsCount: 20,
    servicePrice: '2 540 000',
    date: '25.06.2025',
  },
  {
    id: '3',
    place: "Tramiz shahri 'bolol rarshid' MCHJ",
    manager: 'Jemie Chessman',
    manager2: 'Kissiah Balassa',
    productsCount: 20,
    servicePrice: '2 540 000',
    date: '25.06.2025',
  },
  {
    id: '4',
    place: "Tramiz shahri 'bolol rarshid' MCHJ",
    manager: 'Ivor Trayhorn',
    manager2: 'Kissiah Balassa',
    productsCount: 20,
    servicePrice: '2 540 000',
    date: '25.06.2025',
  },
  {
    id: '5',
    place: "Tramiz shahri 'bolol rarshid' MCHJ",
    manager: 'Latrena Shrive',
    manager2: 'Kissiah Balassa',
    productsCount: 20,
    servicePrice: '2 540 000',
    date: '25.06.2025',
  },
]

export default function ManagerRepairsPage() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return mockRows
    return mockRows.filter((r) =>
      [r.place, r.manager, r.manager2].some((v) => v.toLowerCase().includes(s))
    )
  }, [q])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#09090B]">
            Ta’mirlashlar
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            Barcha filiallar <ChevronDown className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Mahsulot qo'shish
          </Button>
        </div>
      </div>

      <div className="max-w-md">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="menejerni izlash"
        />
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">
                Xizmat ko'rsatiladigan joy nomi
              </th>
              <th className="px-6 py-3 text-left font-medium">Menejer</th>
              <th className="px-6 py-3 text-left font-medium">Menejer</th>
              <th className="px-6 py-3 text-center font-medium">
                Mahsulotlar soni
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Xizmat narxi
              </th>
              <th className="px-6 py-3 text-center font-medium">Sana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-[#F9F9F9] cursor-pointer"
                onClick={() => navigate(`/manager/repairs/${r.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-[#18181B]">{r.place}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-[#18181B]">{r.manager}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-[#18181B]">{r.manager2}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {r.productsCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">{r.servicePrice}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">{r.date}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
