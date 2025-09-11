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
import { useGetAllRentProductsQuery } from '@/store/rent/rent.api'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import type { RentProductDetail } from '@/store/rent/types'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import { useNavigate } from 'react-router-dom'

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU')
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
  const [pageSize] = useState(10)
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const canViewRents = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
    'storekeeper',
  ])

  const { data: branchesData } = useGetAllBranchesQuery(
    { page: 1, limit: 100 },
    { skip: userRole !== 'ceo' }
  )

  const {
    data: rentProductsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllRentProductsQuery(
    {
      search: searchTerm || undefined,
      page: currentPage,
      limit: pageSize,
    },
    { skip: !canViewRents }
  )

  if (!canViewRents) {
    navigate('/dashboard')
    return null
  }

  const rentProducts = rentProductsData?.data || []
  const pagination = {
    total: rentProductsData?.after_filtering_count || 0,
    total_pages: rentProductsData?.page_count || 1,
    page: rentProductsData?.current_page || 1,
    next_page: rentProductsData?.next_page !== null,
    prev_page: (rentProductsData?.current_page || 1) > 1,
  }

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value)
    setCurrentPage(1)
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px]"
          />

          {userRole === 'ceo' && (
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filialni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Barcha filiallar</SelectItem>
                {branchesData?.data.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Mahsulot</th>
              <th className="px-6 py-3 text-center font-medium">Ijara narxi</th>
              <th className="px-6 py-3 text-center font-medium">
                Mavjud miqdori
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Yaratilgan sana
              </th>
              <th className="px-6 py-3 text-center font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {rentProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Ijara mahsulotlari topilmadi
                </td>
              </tr>
            ) : (
              rentProducts.map((rentProduct: RentProductDetail) => (
                <tr
                  key={rentProduct._id}
                  className="hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                  onClick={() => onProductClick(rentProduct._id)}
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
                      {formatDate(rentProduct.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onProductClick(rentProduct._id)
                        }}
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

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Jami {pagination.total} ta natija, {pagination.page}-sahifa{' '}
            {pagination.total_pages} sahifadan
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.prev_page}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Oldingi
            </button>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              {pagination.page}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.next_page}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Keyingi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
