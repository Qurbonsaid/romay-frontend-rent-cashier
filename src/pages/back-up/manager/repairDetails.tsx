import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Simple pill badge
function Pill({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'muted'
}) {
  const cls =
    variant === 'muted' ? 'bg-gray-100 text-gray-800' : 'bg-zinc-900 text-white'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${cls}`}
    >
      {children}
    </span>
  )
}

export default function ManagerRepairDetailsPage() {
  const { id } = useParams()
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
    status: string
    category: string
    barcode: string
    price: string
    desc: string
    serialNumber: string
    model: string
    addedDate: string
    warranty: string
    notes?: string
  } | null>(null)

  // Mock header data (normally fetched by id)
  const header = {
    id,
    place: 'Termiz shahri “bolol rarshid” MCHJ',
    filial: 'Surxondaryo, Termiz',
    manzil: 'Surxondaryo, Termiz',
    manager: 'Abdullo Holiqov',
    orderDate: '02.02.2025',
    servicePrice: '2 540 000',
    productsCount: 17,
  }

  const products = Array.from({ length: header.productsCount }).map((_, i) => ({
    id: String(i + 1),
    name: 'Texnika 123',
    status: i % 2 ? 'Active' : 'Draft',
    category: i % 3 ? 'Active' : 'Sovutish tizimlari',
    barcode: i % 2 ? '2442424242' : 'Draft',
    price: '$' + (8467.44 - i * 10).toLocaleString('en-US'),
    desc: 'Romay can refer to a type of cooling system or air conditioning unit, commonly used in industrial or commercial settings.',
    serialNumber: 'SN' + Math.floor(100000 + Math.random() * 900000),
    model: 'Model-' + (i + 100),
    addedDate: '2025-08-' + (i + 10).toString().padStart(2, '0'),
    warranty: '12 oy',
    notes:
      'Bu mahsulot uchun maxsus eslatmalar mavjud' + (i % 3 ? '' : ' (muhim)'),
  }))

  return (
    <>
      <div className="space-y-6">
        {/* Header title */}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-[#09090B]">
            {header.place}
          </h1>
          <div className="border rounded-lg p-4 min-w-52">
            <div className="text-sm text-muted-foreground">Xizmat narxi</div>
            <div className="text-2xl font-semibold mt-1">
              {header.servicePrice}
            </div>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground">Filial</div>
              <div className="mt-1 font-medium">{header.filial}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Menejer</div>
              <div className="mt-1 font-medium">{header.manager}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Manzili</div>
              <div className="mt-1 font-medium">{header.manzil}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                Buyurtma sanasi
              </div>
              <div className="mt-1 font-medium">{header.orderDate}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">
            Mahsulotlar ({header.productsCount})
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">nomi</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Kategoriya
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Bar-kod</th>
                  <th className="px-4 py-3 text-left font-medium">Narxi</th>
                  <th className="px-4 py-3 text-left font-medium">Tasnifi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#F9F9F9] cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded" />
                        <div className="text-sm text-[#18181B]">{p.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        variant={p.status === 'Draft' ? 'muted' : 'default'}
                      >
                        {p.status}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        variant={p.category === 'Active' ? 'default' : 'muted'}
                      >
                        {p.category}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        variant={p.barcode === 'Draft' ? 'muted' : 'default'}
                      >
                        {p.barcode}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#18181B]">
                      {p.price}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#18181B]">
                      {p.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center text-[#0F172A] mb-2">
              Mahsulot ma'lumotlari
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-8">
              <div className="flex gap-8">
                {/* Product Image */}
                <div className="w-1/3 bg-gray-100 rounded-lg flex items-center justify-center p-6">
                  <img
                    src="/placeholder-product.jpg"
                    alt={selectedProduct.name}
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="w-2/3 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#64748B] mb-1">
                          Nomi
                        </h4>
                        <p className="text-[#0F172A] font-medium">
                          {selectedProduct.name}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#64748B] mb-1">
                          Seriya raqami
                        </h4>
                        <p className="text-[#0F172A]">
                          {selectedProduct.serialNumber}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#64748B] mb-1">
                          Model
                        </h4>
                        <p className="text-[#0F172A]">
                          {selectedProduct.model}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#64748B] mb-1">
                          Kategoriya
                        </h4>
                        <Pill
                          variant={
                            selectedProduct.category === 'Active'
                              ? 'default'
                              : 'muted'
                          }
                        >
                          {selectedProduct.category}
                        </Pill>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#64748B] mb-1">
                          Kiritilgan sana
                        </h4>
                        <p className="text-[#0F172A]">
                          {selectedProduct.addedDate}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#64748B] mb-1">
                          Kafolat
                        </h4>
                        <p className="text-[#0F172A]">
                          {selectedProduct.warranty}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-[#64748B] mb-1">
                        Tasnifi
                      </h4>
                      <p className="text-[#0F172A] text-sm leading-6">
                        {selectedProduct.desc}
                      </p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-[#B45309] mb-1">
                        Qo'shimcha eslatmalar
                      </h4>
                      <p className="text-[#B45309] text-sm">
                        {selectedProduct.notes || 'Mavjud emas'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0F172A] hover:bg-gray-50"
                  onClick={() => setSelectedProduct(null)}
                >
                  Yopish
                </button>
                <button className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-medium hover:bg-[#1E293B]">
                  Tahrirlash
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
