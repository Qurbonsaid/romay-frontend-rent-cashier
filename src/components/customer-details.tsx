'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

type Customer = {
  id: string
  name: string
  phone: string
  segment: string
  orders: number
  job: string
  branch: string
  totalSpent: number
  lastVisit: string
  registered: string
}

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // In a real app, you would fetch the customer data here using the ID
  const customer: Customer = {
    id: id || '',
    name: 'John Doe',
    phone: '+998 99 123 45 67',
    segment: "O'rta",
    orders: 15,
    job: 'Usta',
    branch: 'Termiz',
    totalSpent: 12500000,
    lastVisit: '2023-05-15',
    registered: '2022-01-10',
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
            <h2 className="text-xl font-semibold">{customer.name}</h2>
            <p className="text-muted-foreground">{customer.phone}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Tahrirlash</Button>
            <Button variant="destructive">O'chirish</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Segment</p>
            <p className="font-medium">{customer.segment}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Kasbi</p>
            <p className="font-medium">{customer.job}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Filial</p>
            <p className="font-medium">{customer.branch}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Buyurtmalar soni</p>
            <p className="font-medium">{customer.orders} ta</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sarflangan summa</p>
            <p className="font-medium">
              {customer.totalSpent.toLocaleString()} so'm
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Oxirgi tashrif</p>
            <p className="font-medium">{customer.lastVisit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Ro'yxatdan o'tgan sana
            </p>
            <p className="font-medium">{customer.registered}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Buyurtmalar tarixi</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>Hozircha buyurtmalar mavjud emas</p>
        </div>
      </div>
    </div>
  )
}
