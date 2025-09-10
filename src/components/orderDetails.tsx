const initialProducts = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  name: `Texnika ${i + 1}`,
  status: i % 3 === 0 ? 'Draft' : 'Active',
  category: i % 2 === 0 ? 'Sovutish tizimlari' : 'Issiqlik tizimlari',
  barcode: i % 2 === 0 ? '2424242424' + i : '—',
  price: 8467.44 + i * 1500,
  note: 'Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.',
}))

// type Product = (typeof initialProducts)[0]

function Tag({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'ghost'
}) {
  const base =
    'inline-flex items-center text-xs font-medium rounded-md px-2 py-1'
  const cls =
    variant === 'ghost'
      ? base + ' bg-[#F4F4F5] text-[#18181B]'
      : base + ' bg-[#EEF2FF] text-[#1D4ED8]'
  return <span className={cls}>{children}</span>
}

import { useState } from 'react'

export default function OrderDetails() {
  const [products] = useState(initialProducts)
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  // const [isModalOpen, setIsModalOpen] = useState(false)

  // const handleProductClick = (product: Product) => {
  //   setSelectedProduct(product)
  //   setIsModalOpen(true)
  // }

  // const closeModal = () => {
  //   setIsModalOpen(false)
  //   setSelectedProduct(null)
  // }
  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-[30px] font-semibold text-[#09090B]">
        Buyurtma: 123456
      </h1>

      {/* Summary card */}
      <div className="rounded-lg border border-[#E4E4E7] p-6 flex flex-col md:flex-row gap-6 items-start">
        <img src="/vite.svg" alt="product" className="w-28 h-28 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          <Info title="Buyurtma sanasi" value={<strong>02.02.2025</strong>} />
          <Info title="Filial" value={<strong>Surxandaryo, Termiz</strong>} />
          <Info title="Umumiy summa" value={<strong>+ 1 212 795 641</strong>} />
          <Info title="Manzili" value={<strong>Surxandaryo, Termiz</strong>} />
        </div>
        <div className="ml-auto">
          <div className="rounded-md border border-[#E4E4E7] p-5 w-[220px]">
            <div className="text-sm text-[#71717A]">Balans</div>
            <div className="text-[28px] font-semibold text-rose-600">
              -5,500,000
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <div className="text-[22px] font-semibold text-[#09090B] mb-3">
          Mahsulotlar (17)
        </div>
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">nomi</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Kategoriya</th>
                <th className="px-6 py-3 text-left font-medium">Bar-kod</th>
                <th className="px-6 py-3 text-left font-medium">Narxi</th>
                <th className="px-6 py-3 text-left font-medium">Tasnifi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#F9F9F9] cursor-pointer"
                  // onClick={() => handleProductClick(p)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src="/vite.svg" alt="" className="w-9 h-9 rounded" />
                      <div className="text-sm font-medium text-[#18181B]">
                        {p.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tag variant={p.status === 'Draft' ? 'ghost' : 'default'}>
                      {p.status}
                    </Tag>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tag>{p.category}</Tag>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.barcode !== '—' ? (
                      <Tag variant="ghost">{p.barcode}</Tag>
                    ) : (
                      <span className="text-sm text-[#71717A]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      $
                      {p.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#71717A] max-w-[260px] truncate">
                      {p.note}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        // product={selectedProduct}
      /> */}
    </div>
  )
}

function Info({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="p-0">
      <div className="text-sm text-[#71717A]">{title}</div>
      <div className="text-[16px] font-semibold text-[#18181B]">{value}</div>
    </div>
  )
}
