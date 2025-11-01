import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Trash2, AlertCircle, Plus } from 'lucide-react'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  useGetClientBonusesQuery,
  useDeleteClientBonusMutation,
} from '@/store/bonus/bonus.api'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import AddClientBonusDialog from './AddClientBonusDialog'
import ClientBonusDetailsModal from './ClientBonusDetailsModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { toast } from 'sonner'
import type { ClientBonus } from '@/types/bonus'

export default function ClientBonusesTab() {
  const role = useGetRole()
  const branch = useGetBranch()

  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  // const [typeFilter, setTypeFilter] = useState<'SERVICE' | 'SALE' | 'RENT' | 'ALL' | ''>('ALL')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bonusToDelete, setBonusToDelete] = useState<string | null>(null)
  const [selectedBonus, setSelectedBonus] = useState<ClientBonus | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const branchId = typeof branch === 'object' ? branch._id : branch

  const {
    data: clientBonusesResponse,
    isLoading,
    isError,
  } = useGetClientBonusesQuery({
    search,
    page: currentPage,
    limit,
    branch: branchId,
    type: 'SERVICE',
    // type: typeFilter && typeFilter !== 'ALL' ? (typeFilter as 'SERVICE' | 'SALE' | 'RENT') : undefined,
  })

  const [deleteClientBonus, { isLoading: isDeleting }] =
    useDeleteClientBonusMutation()

  const clientBonusesData = clientBonusesResponse?.data || []
  const pagination = {
    current_page: clientBonusesResponse?.current_page || 1,
    page_count: clientBonusesResponse?.page_count || 1,
    after_filtering_count: clientBonusesResponse?.after_filtering_count || 0,
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

  // const handleTypeFilterChange = (value: string) => {
  //   setTypeFilter(value as 'SERVICE' | 'SALE' | 'RENT' | 'ALL' | '')
  //   setCurrentPage(1)
  // }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBonusToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleBonusClick = (bonus: ClientBonus) => {
    setSelectedBonus(bonus)
    setDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false)
    setSelectedBonus(null)
  }

  const handleDeleteConfirm = async () => {
    if (!bonusToDelete) return

    try {
      await deleteClientBonus(bonusToDelete).unwrap()
      toast.success("Bonus muvaffaqiyatli o'chirildi")
      setDeleteModalOpen(false)
      setBonusToDelete(null)
    } catch (error: any) {
      // Backend'dan kelgan error xabarni to'g'ridan-to'g'ri ko'rsatish
      let errorMessage = "Bonusni o'chirishda xatolik yuz berdi"

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SERVICE':
        return 'Servis'
      case 'SALE':
        return 'Sotuv'
      case 'RENT':
        return 'Ijara'
      default:
        return type
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'SERVICE':
        return 'bg-purple-100 text-purple-800'
      case 'SALE':
        return 'bg-green-100 text-green-800'
      case 'RENT':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Mijoz qidirish..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {/* <Select value={typeFilter || undefined} onValueChange={handleTypeFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Barcha turlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barcha turlar</SelectItem>
              <SelectItem value="SERVICE">Servis</SelectItem>
              <SelectItem value="SALE">Sotuv</SelectItem>
              <SelectItem value="RENT">Ijara</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
        {CheckRole(role, ['ceo', 'manager', 'rent_cashier']) && (
          <Button
            onClick={() => setAddDialogOpen(true)}
            variant="default"
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Mijozga bonus berish
          </Button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={8} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg font-semibold">
            Xatolik yuz berdi
          </p>
          <p className="text-gray-600 text-center max-w-md">
            Bonuslarni yuklashda xatolik yuz berdi.
          </p>
        </div>
      ) : clientBonusesData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Bonuslar topilmadi</p>
          <p className="text-gray-500">Hozircha hech kimga bonus berilmagan</p>
        </div>
      ) : (
        <>
          <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Mijoz</th>
                  <th className="px-6 py-3 text-left font-medium">Telefon</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Bonus turi
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Tur</th>
                  <th className="px-6 py-3 text-left font-medium">Chegirma</th>
                  <th className="px-6 py-3 text-left font-medium">Qolgan</th>
                  <th className="px-6 py-3 text-left font-medium">Holat</th>
                  {CheckRole(role, ['ceo', 'manager', 'rent_cashier']) && (
                    <th className="px-6 py-3 text-center font-medium">
                      Amallar
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {clientBonusesData.map((bonus) => {
                  const expired = isExpired(bonus.end_date)
                  return (
                    <tr
                      key={bonus._id}
                      className={`hover:bg-[#F9F9F9] transition-colors cursor-pointer ${expired ? 'opacity-60' : ''}`}
                      onClick={() => handleBonusClick(bonus)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#18181B]">
                          {bonus.client.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#18181B]">
                          {bonus.client.phone || 'Mavjud emas'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#18181B]">
                          {bonus.bonus_type?.bonus_name ||
                            "Noma'lum bonus turi"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(bonus.type)}`}
                        >
                          {getTypeLabel(bonus.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-emerald-600 font-medium">
                          {bonus.bonus_type?.discount_amount?.toLocaleString(
                            'uz-UZ'
                          ) || 0}{' '}
                          so'm
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${bonus.client_discount_amount > 0 ? 'text-emerald-600' : 'text-yellow-600'}`}
                        >
                          {bonus?.client_discount_amount > 0
                            ? (bonus?.client_discount_amount?.toLocaleString(
                                'uz-UZ'
                              ) || 0) + " so'm"
                            : 'Tugagan'}{' '}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {expired ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Muddati o'tgan
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Faol
                          </span>
                        )}
                      </td>
                      {CheckRole(role, ['ceo', 'manager', 'rent_cashier']) && (
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteClick(bonus._id, e)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  )
                })}
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

      <AddClientBonusDialog open={addDialogOpen} setOpen={setAddDialogOpen} />

      <ClientBonusDetailsModal
        isOpen={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        bonus={selectedBonus}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Bonusni o'chirish"
        description="Ushbu bonusni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi."
      />
    </div>
  )
}
