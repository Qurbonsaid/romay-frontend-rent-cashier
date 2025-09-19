import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TablePagination } from '@/components/ui/table-pagination'
import { useGetAllRentProductsQuery } from '@/store/rent/rent.api'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import type { RentProductDetail } from '@/store/rent/types'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import { useNavigate } from 'react-router-dom'

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB')
}

interface RentProductsTableProps {
  onProductClick: (productId: string) => void
}

export default function RentProductsTable({
  onProductClick,
}: RentProductsTableProps) {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLimit(itemsPerPage)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const canViewRents = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
    'storekeeper',
  ])

  const { data: categoriesData } = useGetAllCategoryQuery(
    {},
    { skip: !canViewRents }
  )

  const {
    data: rentProductsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllRentProductsQuery(
    {
      search: searchTerm || undefined,
      page: currentPage,
      limit: limit,
    },
    { skip: !canViewRents }
  )

  if (!canViewRents) {
    navigate('/dashboard')
    return null
  }

  const rentProducts = rentProductsData?.data || []

  // Filter products by category on client side
  const filteredProducts =
    selectedCategory && selectedCategory !== 'all'
      ? rentProducts.filter((product) => {
          const categoryId =
            typeof product.product?.category_id === 'object'
              ? product.product.category_id._id
              : product.product?.category_id
          return categoryId === selectedCategory
        })
      : rentProducts

  const pagination = {
    total: rentProductsData?.after_filtering_count || 0,
    total_pages: rentProductsData?.page_count || 1,
    page: rentProductsData?.current_page || 1,
    next_page: rentProductsData?.next_page !== null,
    prev_page: (rentProductsData?.current_page || 1) > 1,
  }

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-500">Xatolik yuz berdi</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Mahsulot nomi bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-[200px]"
          />

          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Kategoriya tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha kategoriyalar</SelectItem>
              {categoriesData?.data?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Mahsulot</th>
              <th className="px-6 py-3 text-center font-medium">Kategoriya</th>
              <th className="px-6 py-3 text-center font-medium">Shtrix kod</th>
              <th className="px-6 py-3 text-center font-medium">Ijara narxi</th>
              <th className="px-6 py-3 text-center font-medium">
                Mavjud miqdori
              </th>
              <th className="px-6 py-3 text-center font-medium">Jami miqdor</th>
              <th className="px-6 py-3 text-center font-medium">Filial</th>
              <th className="px-6 py-3 text-center font-medium">
                Yaratilgan sana
              </th>
              <th className="px-6 py-3 text-center font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  Ijara mahsulotlari topilmadi
                </td>
              </tr>
            ) : (
              filteredProducts.map((rentProduct: RentProductDetail) => (
                <tr
                  key={rentProduct._id}
                  className="hover:bg-[#F8F9FA] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={
                            rentProduct.product?.images?.[0] ||
                            '/placeholder-image.jpg'
                          }
                          alt={rentProduct.product?.name || 'Mahsulot'}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#18181B]">
                          {rentProduct.product?.name || "Noma'lum mahsulot"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rentProduct.product?.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {(() => {
                        const categoryId = rentProduct.product?.category_id
                        if (
                          typeof categoryId === 'object' &&
                          categoryId?.name
                        ) {
                          return categoryId.name
                        } else if (typeof categoryId === 'string') {
                          const category = categoriesData?.data?.find(
                            (cat) => cat._id === categoryId
                          )
                          return category?.name || "Kategoriya yo'q"
                        }
                        return "Kategoriya yo'q"
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {rentProduct.product?.barcode ||
                        rentProduct.product_barcode ||
                        "Kod yo'q"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(rentProduct.product_rent_price)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {rentProduct.product_active_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {rentProduct.product_total_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {typeof rentProduct.branch === 'object' &&
                      rentProduct.branch?.name
                        ? rentProduct.branch.name
                        : typeof rentProduct.branch === 'string'
                          ? rentProduct.branch
                          : "Filial ko'rsatilmagan"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(rentProduct.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onProductClick(rentProduct._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={pagination?.page || 1}
        totalPages={pagination?.total_pages || 1}
        totalItems={pagination?.total || 0}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        className="mt-6"
      />
    </div>
  )
}
