import React from 'react'
import { CardComponent } from './card'
import { CreditCard, LayoutGrid, UsersRound } from 'lucide-react'
import { RevenueChart } from './revenue-chart'
import Recent from './recent'
import { Card, CardHeader } from './ui/card'

type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: string
  note: string | undefined
  image: string | undefined
  subtitle?: string
}

const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro Max',
    sku: 'IP13PM256GB',
    category: 'Smartfonlar',
    price: '12 500 000',
    stock: 15,
    status: 'Active',
    note: `Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.`,
    image:
      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0=',
  },
  // id: i + 1,
  // name: `Texnika ${i + 1}`,
  // status: i % 3 === 0 ? 'Draft' : 'Active',
  // category: i % 2 === 0 ? 'Sovutish tizimlari' : 'Issiqlik tizimlari',
  // barcode: i % 2 === 0 ? '2424242424' + i : '—',
  // price: 8467.44 + i * 1500,
  // note: 'Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.',
  {
    id: '2',
    name: 'Samsung Galaxy S22 Ultra',
    sku: 'SGS22U512GB',
    category: 'Smartfonlar',
    price: '13 200 000',
    stock: 8,
    status: 'Active',
    note: 'Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.',
    image:
      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0=',
  },
  {
    id: '3',
    name: 'Xiaomi 12 Pro',
    sku: 'XM12P256GB',
    category: 'Smartfonlar',
    price: '9 800 000',
    stock: 0,
    status: 'Active',
    note: 'Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.',
    image:
      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0=',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM4',
    sku: 'SONYWH1000XM4',
    category: 'Quloqchinlar',
    price: '4 500 000',
    stock: 12,
    status: 'Active',
    note: 'Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.',
    image:
      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0=',
  },
  {
    id: '5',
    name: 'MacBook Pro 14" M2',
    sku: 'MBP14M2-1TB',
    category: 'Noutbuklar',
    price: '22 000 000',
    stock: 5,
    status: 'Active',
    note: 'Bu mahsulot yaxshi ishlaydi va uzoq muddat xizmat qiladi. "Romay" brendining eng yaxshi mahsulotlaridan biri hisoblanadi.',
    image:
      'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0=',
  },
]

export const Dashboard: React.FC = () => {
  const formatUsd = (value: string) => {
    const num = Number(String(value).replace(/[^0-9]/g, '')) || 0
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-0 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <CardComponent
            title={'Balans'}
            description={'+20% bu oyda oshgan'}
            amount={"169,867,736 so'm"}
            icon={<LayoutGrid size={16} />}
          />
          <CardComponent
            title={'Qolgan tovarlar narxi'}
            description={'+22% bu oyda oshgan'}
            amount={"269,567,736 so'm"}
            icon={<CreditCard size={16} />}
          />
          <CardComponent
            title={'Ta’minotchilar'}
            description={'+99 ta bu oyda yangi mijoz'}
            amount={'527'}
            icon={<UsersRound size={16} />}
          />
          <CardComponent
            title={'Ta’minotchilardan qarzdorlik'}
            description={"+45% bu oyda yig'ib olingan"}
            amount={'54,896,709 so’m'}
            icon={<CreditCard size={16} />}
          />
        </div>
        <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <Recent
            title="So‘nggi qabullar"
            description="Do’konlardagi oxirgi qabul qilingan tovarlar"
          />
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-[#09090B]">
              Eng yaxshi sotilayotgan tovarlar
            </h2>
            <p className="text-sm text-[#71717A]">
              Barcha filiallar bo’yicha eng yaxshi mijozlar.
            </p>
          </CardHeader>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="border-y text-[#71717A] text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">nomi</th>
                  <th className="px-6 py-3 text-right font-medium">
                    Qolgan soni
                  </th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">
                    Kategoriya
                  </th>
                  <th className="px-6 py-3 text-center font-medium">Bar-kod</th>
                  <th className="px-6 py-3 text-center font-medium">Narxi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F9F9F9]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-8 w-8 object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">📱</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#18181B]">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {product.stock > 0 ? (
                        <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
                          mavjud
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">
                          qolmagan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B]">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-[#18181B]">
                        {formatUsd(product.price)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
