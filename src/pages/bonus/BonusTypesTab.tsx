import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Edit, Trash2, AlertCircle } from 'lucide-react'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  useGetBonusTypesQuery,
  useDeleteBonusTypeMutation,
} from '@/store/bonus/bonus.api'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import AddBonusDialog from './AddBonusDialog'
import EditBonusDialog from './EditBonusDialog'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { toast } from 'sonner'
import type { BonusType } from '@/types/bonus'

export default function BonusTypesTab() {
  const role = useGetRole()
  const branch = useGetBranch()

  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedBonusType, setSelectedBonusType] = useState<BonusType | null>(
    null
  )
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bonusTypeToDelete, setBonusTypeToDelete] = useState<string | null>(
    null
  )

  const {
    data: bonusTypesResponse,
    isLoading,
    isError,
  } = useGetBonusTypesQuery({
    search,
    page: currentPage,
    limit,
    branch_id: typeof branch === 'object' ? branch._id : branch,
  })

  const [deleteBonusType, { isLoading: isDeleting }] =
    useDeleteBonusTypeMutation()

  const bonusTypesData = bonusTypesResponse?.data || []
  const pagination = {
    current_page: bonusTypesResponse?.pagination?.page || 1,
    page_count: bonusTypesResponse?.pagination?.total_pages || 1,
    after_filtering_count: bonusTypesResponse?.pagination?.total || 0,
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLimit(itemsPerPage)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleEdit = (bonusType: BonusType, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBonusType(bonusType)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBonusTypeToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!bonusTypeToDelete) return

    try {
      await deleteBonusType(bonusTypeToDelete).unwrap()
      toast.success("Bonus turi muvaffaqiyatli o'chirildi")
      setDeleteModalOpen(false)
      setBonusTypeToDelete(null)
    } catch (error: any) {
      // Backend'dan kelgan error xabarni to'g'ridan-to'g'ri ko'rsatish
      let errorMessage = "Bonus turini o'chirishda xatolik yuz berdi"

      if (error?.data?.error?.msg) {
        errorMessage = error.data.error.msg
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.msg) {
        errorMessage = error.data.msg
      } else if (error?.data?.error) {
        errorMessage =
          typeof error.data.error === 'string'
            ? error.data.error
            : JSON.stringify(error.data.error)
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Bonus turi qidirish..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        {CheckRole(role, ['ceo', 'manager', 'rent_cashier']) && (
          <Button onClick={() => setAddDialogOpen(true)} variant="default">
            Bonus turi qo'shish
          </Button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">Xatolik yuz berdi</p>
          <p className="text-gray-600">
            Bonus turlarini yuklashda xatolik yuz berdi. Iltimos, qaytadan
            urinib ko'ring.
          </p>
        </div>
      ) : bonusTypesData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Bonus turlari topilmadi</p>
          <p className="text-gray-500">
            Hozircha hech qanday bonus turi mavjud emas
          </p>
        </div>
      ) : (
        <>
          <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">
                    Bonus nomi
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Maqsad summa
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Chegirma</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Yaratilgan sana
                  </th>
                  {CheckRole(role, ['ceo', 'manager', 'rent_cashier']) && (
                    <th className="px-6 py-3 text-center font-medium">
                      Amallar
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {bonusTypesData.map((bonusType) => (
                  <tr key={bonusType._id} className="hover:bg-[#F9F9F9]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#18181B]">
                        {bonusType.bonus_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {bonusType.target_amount.toLocaleString('uz-UZ')} so'm
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-emerald-600 font-medium">
                        {bonusType.discount_amount.toLocaleString('uz-UZ')} so'm
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {new Date(bonusType.created_at).toLocaleDateString(
                          'en-GB'
                        )}
                      </div>
                    </td>
                    {CheckRole(role, ['ceo', 'manager', 'rent_cashier']) && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleEdit(bonusType, e)}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteClick(bonusType._id, e)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={pagination.current_page}
            totalPages={pagination.page_count}
            totalItems={pagination.after_filtering_count}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            className="mt-6"
          />
        </>
      )}

      <AddBonusDialog open={addDialogOpen} setOpen={setAddDialogOpen} />

      {selectedBonusType && (
        <EditBonusDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          bonusType={selectedBonusType}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Bonus turini o'chirish"
        description="Ushbu bonus turini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi."
      />
    </div>
  )
}
