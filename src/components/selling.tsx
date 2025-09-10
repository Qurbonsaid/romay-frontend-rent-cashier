import { useState } from 'react'
import { Input } from './ui/input'
import { Check, Minus, Plus, Printer, ScanBarcode, Trash2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Calendar22 } from './calendar'
import { SelectItem } from '@radix-ui/react-select'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'

type Product = {
  id: number
  name: string
  price: number
  qty: number
  img: string
  stock: number
}

export default function Selling({ role = 'default' }: { role?: string }) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Shurupovert Ubay CD1015',
      price: 8467.44,
      qty: 1,
      img: '/vite.svg',
      stock: 10,
    },
    {
      id: 2,
      name: 'BIYOTI BYT-CD1016 Shurupovert',
      price: 1987.48,
      qty: 2,
      img: '/vite.svg',
      stock: 10,
    },
    {
      id: 3,
      name: 'Texnika 123',
      price: 8539.35,
      qty: 2,
      img: '/vite.svg',
      stock: 10,
    },
  ])

  const total = products.reduce((sum, p) => sum + p.price * p.qty, 0)

  const increaseQty = (id: number) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    )

  const decreaseQty = (id: number) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p))
    )

  const removeProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-4">
        <Input
          placeholder="Mahsulot nomi yoki kodini kiriting"
          className="pr-10"
        />
        <ScanBarcode
          size={24}
          className="absolute right-2 top-2"
          color="#71717A"
        />
      </div>

      {/* If products exist */}
      {products.length > 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="text-[#71717A] text-sm border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium"></th>
                <th className="px-6 py-3 text-left font-medium">Narx</th>
                <th className="px-6 py-3 text-center font-medium">Summa</th>
                {role !== 'default' && (
                  <th className="px-6 py-3 text-right font-medium">
                    <span>Minimal qolmadi</span>
                  </th>
                )}
                <th className="px-6 py-3 font-medium text-center">
                  <span>Soni</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-3 text-sm text-left">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-12 h-12 rounded"
                      />
                      <div>{p.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-left ">{p.price}</td>
                  <td className="px-6 py-3 text-sm text-center">
                    {p.price * p.qty}
                  </td>
                  {role !== 'default' && (
                    <td className="px-6 pl-20 py-3 text-sm text-center">
                      {p.stock}
                    </td>
                  )}
                  <td className="px-6 py-3 text-sm flex justify-center">
                    <div className="flex items-center gap-8 rounded-md bg-[#F9F9F9] w-fit justify-end">
                      {p.qty === 1 ? (
                        <Button
                          size="sm"
                          className="bg-red-100 text-red-700"
                          variant="outline"
                          onClick={() => removeProduct(p.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-red-100 text-red-700"
                          variant="outline"
                          onClick={() => decreaseQty(p.id)}
                        >
                          <Minus size={14} />
                        </Button>
                      )}
                      <span className="text-center">{p.qty}</span>
                      <Button
                        size="sm"
                        className="bg-green-100 text-green-700"
                        variant="outline"
                        onClick={() => increaseQty(p.id)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Your empty state here
        <Card>
          <div className="py-7 flex items-center justify-center flex-col">
            <div className="mb-4">
              <img src="/empty.svg" alt="" />
            </div>
            <h2 className="text-[20px] font-semibold text-slate-800">
              Hozircha mahsulotlar yo'q
            </h2>
            <p className="text-[14px] text-slate-600">
              Mahsulotlar kiritilishi bilan bu yerda ko’rinadi
            </p>
          </div>
        </Card>
      )}

      {/* Bottom section same as your old one */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>
                {role === 'warehouse'
                  ? "Ta'minotchi"
                  : role === 'branch'
                    ? 'Filialga berish'
                    : 'Mijoz'}
              </Label>
              {role !== 'branch' && (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={
                      role === 'warehouse'
                        ? "Ta'minotchi ismi yozing"
                        : 'Mijozni ismi yozing'
                    }
                  />
                  <Button variant="outline">
                    <Plus size={14} className="mr-2" />{' '}
                    {role === 'warehouse'
                      ? "Ta'minotchi qo'shish"
                      : "Mijoz qo'shish"}
                  </Button>
                </div>
              )}
              {role === 'branch' && (
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filial tanlash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filial1">Filial 1</SelectItem>
                    <SelectItem value="filial2">Filial 2</SelectItem>
                    <SelectItem value="filial3">Filial 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center gap-2">
                <Input
                  placeholder={
                    role === 'warehouse'
                      ? "Ta'minotchi ismi yozing"
                      : 'Mijozni ismi yozing'
                  }
                />
                <Button variant="outline">
                  <Plus size={14} className="mr-2" />{' '}
                  {role === 'warehouse'
                    ? "Ta'minotchi qo'shish"
                    : "Mijoz qo'shish"}
                </Button>
              </div>
              <p className="text-[14px] text-[#71717A]">
                Qarz bo’lmasa majburiy emas
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Naqd</Label>
              <div className="relative">
                <Input className="py-2 px-3 pr-10" placeholder="0" />
                <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                  UZS
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Plastik</Label>
              <div className="relative">
                <Input className="py-2 px-3 pr-10" placeholder="0" />
                <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                  UZS
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Terminal</Label>
              <div className="relative">
                <Input className="py-2 px-3 pr-10" placeholder="0" />
                <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                  UZS
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bank (hisob raqamidan to’lov)</Label>
              <div className="relative">
                <Input className="py-2 px-3 pr-10" placeholder="0" />
                <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                  UZS
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Dollar</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input className="py-2 px-3 pr-10" placeholder="0" />
                  <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                    USD
                  </span>
                </div>

                <div className="relative">
                  <Input className="py-2 px-3 pr-10" placeholder="0" />
                  <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                    UZS
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Euro</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input className="py-2 px-3 pr-10" placeholder="0" />
                  <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                    EUR
                  </span>
                </div>

                <div className="relative">
                  <Input className="py-2 px-3 pr-10" placeholder="0" />
                  <span className="absolute right-2 top-[10px] text-[14px] text-[#71717A]">
                    UZS
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Sana: </span>
                <span>12.08.24 18:38</span>
              </div>
              {role !== 'default' && products.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Naqd: </span>
                    <span>9 000 000 UZS</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Valyuta: </span>
                    <span>125 USD (12 810)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bank: </span>
                    <span>
                      1 000 000{' '}
                      <span className="text-amber-500">kutilmoqda</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Mijoz: </span>
                    <span>Xumoyunmirzo.Y</span>
                  </div>
                </>
              )}
            </div>
            <div>
              <div className="text-[20px] font-semibold flex items-center justify-between">
                <span>Jami:</span>
                <span>{total.toLocaleString()} UZS</span>
              </div>
              {role !== 'branch' && (
                <>
                  <div className="text-[20px] font-semibold flex items-center justify-between">
                    <span>Berildi:</span>
                    <span className="text-green-600">8 250 000 UZS</span>
                  </div>
                  <div className="text-[20px] font-semibold flex items-center justify-between">
                    <span>Qarz:</span>
                    <span className="text-[#DC3E42]">200 000 UZS</span>
                  </div>
                </>
              )}
            </div>
            {role === 'default' && (
              <div className="flex flex-col gap-2">
                <Label>Qarzni berish sanasi</Label>
                <Calendar22 className="w-full" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Button variant={'secondary'}>
                <Printer size={16} className="mr-2" /> Print
              </Button>
              <Button className="bg-green-700 text-white">
                <Check size={16} className="mr-2" />{' '}
                {role === 'warehouse' ? 'Qabul qilish' : "To'lov qilish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
