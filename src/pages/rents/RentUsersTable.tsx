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
import { useGetAllRentsQuery } from '@/store/rent/rent.api'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { RentStatus } from '@/store/rent/types'
import type { Client } from '@/types/clients'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import { useNavigate } from 'react-router-dom'

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

interface RentUsersTableProps {
  onRentClick: (rentId: string) => void
}

export default function RentUsersTable({ onRentClick }: RentUsersTableProps) {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<RentStatus | '' | 'all'>(
    ''
  )
  const [searchTerm, setSearchTerm] = useState('')

  // Check permissions for rent operations
  const canViewRents = CheckRole(userRole, ['ceo', 'manager', 'rent_cashier'])
  const canManageRents = CheckRole(userRole, ['rent_cashier'])

  const { data: branchesData } = useGetAllBranchesQuery(
    { page: 1, limit: 100 },
    { skip: userRole !== 'ceo' }
  )

  const { data: clientsData } = useGetClientsQuery(
    { page: 1, limit: 100 },
    { skip: !canViewRents }
  )

  const {
    data: rentsData,
    isLoading: rentsLoading,
    error: rentsError,
  } = useGetAllRentsQuery(
    {
      branch: selectedBranch || undefined,
      client:
        selectedClient === 'all' ? undefined : selectedClient || undefined,
      status:
        selectedStatus === 'all' ? undefined : selectedStatus || undefined,

      search: searchTerm || undefined,
      page: currentPage,
      limit: pageSize,
    },
    { skip: !canViewRents }
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

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value)
    setCurrentPage(1)
  }

  const handleClientChange = (value: string) => {
    setSelectedClient(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: RentStatus | '') => {
    setSelectedStatus(value)
    setCurrentPage(1)
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
            onChange={(e) => setSearchTerm(e.target.value)}
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

          {userRole === 'ceo' && (
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filialni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha filiallar</SelectItem>
                {branchesData?.data.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={selectedClient} onValueChange={handleClientChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mijozni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha mijozlar</SelectItem>
              {clientsData?.data.map((client: Client) => (
                <SelectItem key={client._id} value={client._id}>
                  {client.username}
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
              <th className="px-6 py-3 text-left font-medium">Mijoz ismi</th>
              <th className="px-6 py-3 text-center font-medium">Jami summa</th>
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
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Ijaralar topilmadi
                </td>
              </tr>
            ) : (
              rents.map((rent) => (
                <tr
                  key={rent._id}
                  className="hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                  onClick={() => onRentClick(rent._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {rent.client_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rent.client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(rent.total_rent_price)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(rent.received_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(rent.delivery_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRentClick(rent._id)
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
