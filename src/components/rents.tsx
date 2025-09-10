import { Button } from './ui/button'
import { Search, Plus, Filter } from 'lucide-react'
import { Input } from './ui/input'
import { PaginationComponent } from './pagination'
import { useState } from 'react'
import { RentDetailsModal } from './rentModal'

type Product = {
  id: string
  name: string
  oluvchi: string
  muddat: string
  status: string
  price: string
  olingan_muddat: string
  ijara_summasi: string
  date: string
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Perfarator',
    price: '20 000',
    muddat: 'kunlik',
    status: 'Mavjud',
    oluvchi: '-',
    olingan_muddat: '10 kun',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '2',
    name: 'Perfarator',
    oluvchi: '-',
    muddat: 'kunlik',
    price: '13 000',
    status: 'Mavjud',
    olingan_muddat: '10 kun',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '3',
    name: 'Perfarator',
    oluvchi: '-',
    muddat: 'kunlik',
    price: '9 000',
    status: 'Ijarada',
    olingan_muddat: '10 kun',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '4',
    name: 'Perfarator',
    oluvchi: 'Bekmurod',
    muddat: 'kunlik',
    status: 'Mavjud',
    price: '4 000',
    olingan_muddat: '10 kun',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '5',
    name: 'Perfarator',
    price: '22 000',
    status: 'Ijarada',
    oluvchi: 'Bekmurod',
    muddat: 'kunlik',
    olingan_muddat: '10 kun',
    ijara_summasi: '-',
    date: '-',
  },
]

export default function Rents() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Mahsulotlar
        </h1>
        <div className="flex gap-4">
          <Button variant={'outline'}>
            <Plus className="mr-2 h-4 w-4" />
            Mahsulot qo'shish
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pr-10 w-[300px]"
            placeholder="Mahsulotlarni qidirish..."
          />
        </div>
        <Button variant={'outline'}>
          <Filter /> Filter: Hammasi
        </Button>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Nomi</th>
              <th className="px-6 py-3 text-center font-medium">Narxi</th>
              <th className="px-6 py-3 text-left font-medium">Muddat</th>
              <th className="px-6 py-3 text-center font-medium">Status</th>
              <th className="px-6 py-3 text-center font-medium">Oluvchi</th>
              <th className="px-6 py-3 text-center font-medium">
                Olingan muddat
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Ijara summasi
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Olingan sana
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {dummyProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-[#F9F9F9]"
                onClick={() => handleProductClick(product)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400">📱</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#18181B]">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {product.price} so'm
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-[#18181B]">{product.muddat}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {/* <span className="px-2 py-1 text-xs rounded-sm bg-green-100 text-green-800"> */}
                  <span
                    className={
                      product.status === 'Mavjud'
                        ? 'px-2 py-1 text-xs rounded-sm bg-green-100 text-green-800'
                        : 'px-2 py-1 text-xs rounded-sm bg-amber-100 text-[#B45309]'
                    }
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {product.oluvchi}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {product.olingan_muddat}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {product.ijara_summasi}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">{product.date}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RentDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
      <PaginationComponent />
    </div>
  )
}
