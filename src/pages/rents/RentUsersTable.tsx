import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TablePagination } from '@/components/ui/table-pagination'
import {
  useGetAllRentsQuery,
  useDeleteRentMutation,
} from '@/store/rent/rent.api'
import type { RentStatus } from '@/store/rent/types'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { toast } from 'sonner'

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB')
}

const isOverdue = (deliveryDate: string, status: RentStatus): boolean => {
  if (status !== 'IN_PROGRESS') return false
  const today = new Date()
  const delivery = new Date(deliveryDate)
  today.setHours(0, 0, 0, 0)
  delivery.setHours(0, 0, 0, 0)
  return delivery < today
}

// Translate API error messages to Uzbek
const translateApiError = (errorMsg: string): string => {
  if (errorMsg.includes('Only rents created today can be deleted')) {
    return "Faqat bugun yaratilgan ijaralarni o'chirish mumkin!"
  }
  if (errorMsg.includes('Product not found')) {
    return "Mahsulot topilmadi! Ijara mavjud emas yoki o'chirilgan."
  }
  if (errorMsg.includes('Rent not found')) {
    return "Ijara topilmadi! Ijara o'chirilgan yoki mavjud emas."
  }
  if (errorMsg.includes('Forbidden')) {
    return "Bu amalni bajarish uchun ruxsatingiz yo'q!"
  }

  // Default message for unknown errors
  return `Xatolik: ${errorMsg}`
}

export default function RentUsersTable() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const branch = useGetBranch()
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedStatus, setSelectedStatus] = useState<RentStatus | '' | 'all'>(
    ''
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteRentId, setDeleteRentId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [deleteRent, { isLoading: isDeleting }] = useDeleteRentMutation()

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

  // Check permissions for rent operations
  const canViewRents = CheckRole(userRole, ['ceo', 'manager', 'rent_cashier'])
  const canManageRents = CheckRole(userRole, ['rent_cashier'])

  const {
    data: rentsData,
    isLoading: rentsLoading,
    error: rentsError,
  } = useGetAllRentsQuery(
    {
      status:
        selectedStatus === 'all' ? undefined : selectedStatus || undefined,
      search: searchTerm || undefined,
      branch: branch?._id,
      page: currentPage,
      limit: limit,
    },
    { skip: !canViewRents || !branch }
  )

  // Navigate to dashboard if no permission
  if (!canViewRents) {
    navigate('/dashboard')
    return null
  }

  const rents = rentsData?.data || []
  const pagination = {
    total: rentsData?.after_filtering_count || 0,
    total_pages: rentsData?.page_count || 1,
    page: rentsData?.current_page || 1,
    next_page: rentsData?.next_page !== null,
    prev_page: (rentsData?.current_page || 1) > 1,
  }

  const handleStatusChange = (value: RentStatus | '') => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  const handleEditClick = (rentId: string, createdDate: string) => {
    // Check if the rent was created today
    const today = new Date()
    const created = new Date(createdDate)
    today.setHours(0, 0, 0, 0)
    created.setHours(0, 0, 0, 0)

    if (created.getTime() !== today.getTime()) {
      toast.error('Faqat bugun yaratilgan ijaralarni tahrirlash mumkin!')
      return
    }

    navigate(`/rents/edit/${rentId}`)
  }

  const handleDeleteClick = (rentId: string, createdDate: string) => {
    // Check if the rent was created today
    const today = new Date()
    const created = new Date(createdDate)
    today.setHours(0, 0, 0, 0)
    created.setHours(0, 0, 0, 0)

    if (created.getTime() !== today.getTime()) {
      toast.error("Faqat bugun yaratilgan ijaralarni o'chirish mumkin!")
      return
    }

    setDeleteRentId(rentId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteRentId) return

    try {
      await deleteRent(deleteRentId).unwrap()
      toast.success("Ijara muvaffaqiyatli o'chirildi")
      setIsDeleteModalOpen(false)
      setDeleteRentId(null)
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as any
        if (apiError.data?.error?.msg) {
          const translatedError = translateApiError(apiError.data.error.msg)
          toast.error(translatedError)
        } else {
          toast.error("Ijarani o'chirishda xatolik yuz berdi")
        }
      } else {
        toast.error("Ijarani o'chirishda xatolik yuz berdi")
      }
    }
  }

  if (rentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (rentsError) {
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
          {canManageRents && (
            <Button
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              onClick={() => navigate('/rents/add')}
            >
              Ijara qo'shish
            </Button>
          )}

          <Input
            placeholder="Mijoz nomi bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-[200px]"
          />

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Holatni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha holatlar</SelectItem>
              <SelectItem value="IN_PROGRESS">Jarayonda</SelectItem>
              <SelectItem value="COMPLETED">Tugallangan</SelectItem>
              <SelectItem value="CANCELLED">Bekor qilingan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Mijoz ismi</th>
              <th className="px-6 py-3 text-center font-medium">
                Mahsulotlar soni
              </th>
              <th className="px-6 py-3 text-center font-medium">Jami summa</th>
              <th className="px-6 py-3 text-center font-medium">
                To'langan summa
              </th>
              <th className="px-6 py-3 text-center font-medium">Holat</th>
              <th className="px-6 py-3 text-center font-medium">
                Qabul sanasi
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Qaytarish sanasi
              </th>
              <th className="px-6 py-3 text-center font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {rents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Ijaralar topilmadi
                </td>
              </tr>
            ) : (
              rents.map((rent) => (
                <tr
                  key={rent._id}
                  className="hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                  onClick={() => navigate(`/rent-details/${rent._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {rent.client_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rent.client?.phone || "Telefon raqam ko'rsatilmagan"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {rent.rent_products?.length || 0} ta
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(rent.total_rent_price)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(
                        Array.isArray(rent.payments)
                          ? rent.payments.reduce((sum, payment) => {
                              const amount =
                                typeof payment === 'object' && payment?.amount
                                  ? payment.amount
                                  : 0
                              return sum + amount
                            }, 0)
                          : 0
                      )}{' '}
                      so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rent.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : rent.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rent.status === 'COMPLETED'
                          ? 'Tugallangan'
                          : rent.status === 'IN_PROGRESS'
                            ? 'Jarayonda'
                            : 'Bekor qilingan'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(rent.received_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div
                      className={`text-sm ${
                        isOverdue(rent.delivery_date, rent.status)
                          ? 'text-red-600 font-semibold'
                          : 'text-[#18181B]'
                      }`}
                    >
                      {formatDate(rent.delivery_date)}
                      {isOverdue(rent.delivery_date, rent.status) && (
                        <span className="ml-1 text-red-500">⚠️</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(rent._id, rent.created_at)
                        }}
                        disabled={
                          rent.status === 'COMPLETED' ||
                          rent.status === 'CANCELLED'
                        }
                        className={`h-8 w-8 p-0 ${
                          rent.status === 'COMPLETED' ||
                          rent.status === 'CANCELLED'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        title={
                          rent.status === 'COMPLETED' ||
                          rent.status === 'CANCELLED'
                            ? 'Tugallangan yoki bekor qilingan ijaralarni tahrirlash mumkin emas'
                            : 'Ijarani tahrirlash'
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(rent._id, rent.created_at)
                        }}
                        disabled={
                          rent.status === 'COMPLETED' ||
                          rent.status === 'CANCELLED'
                        }
                        className={`h-8 w-8 p-0 text-red-600 hover:text-red-800 ${
                          rent.status === 'COMPLETED' ||
                          rent.status === 'CANCELLED'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        title={
                          rent.status === 'COMPLETED' ||
                          rent.status === 'CANCELLED'
                            ? "Tugallangan yoki bekor qilingan ijaralarni o'chirish mumkin emas"
                            : "Ijarani o'chirish"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
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

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Ijarani o'chirish"
        description="Haqiqatan ham bu ijarani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."
        isLoading={isDeleting}
      />
    </div>
  )
}
