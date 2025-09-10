import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useGetAllServicesQuery } from '@/store/service/service.api'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import type { ServiceStatus } from '@/store/service/types'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import AddMechanicDialog from './AddMechanicDialog'

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Mechanics Table Component
function MechanicsTable() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedBranch, setSelectedBranch] = useState<string>('')

  // Check permissions for mechanic/get-all - ceo, manager, rent_cashier
  const canViewMechanics = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
  ])

  const { data: branchesData, refetch: refetchBranches } =
    useGetAllBranchesQuery(
      {
        page: 1,
        limit: 100,
      },
      {
        skip: true,
      }
    )

  const {
    data: mechanicsData,
    isLoading: mechanicsLoading,
    error: mechanicsError,
  } = useGetAllMechanicsQuery(
    {
      page: currentPage,
      limit: pageSize,
    },
    {
      skip: !canViewMechanics,
    }
  )

  useEffect(() => {
    if (userRole === 'ceo') {
      refetchBranches()
    }
  }, [userRole, refetchBranches])

  // Navigate to dashboard if no permission
  if (!canViewMechanics) {
    navigate('/dashboard')
    return null
  }

  const mechanics = mechanicsData?.data || []
  const pagination = mechanicsData?.pagination

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value)
    setCurrentPage(1)
  }

  if (mechanicsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (mechanicsError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-500">Xatolik yuz berdi</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {CheckRole(userRole, ['manager']) && <AddMechanicDialog />}
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
              <th className="px-6 py-3 text-left font-medium">To'liq ism</th>
              <th className="px-6 py-3 text-left font-medium">Telefon raqam</th>
              <th className="px-6 py-3 text-center font-medium">Ish turi</th>
              <th className="px-6 py-3 text-center font-medium">Servislari</th>
              <th className="px-6 py-3 text-center font-medium">
                Yaratilgan sana
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {mechanics.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Ustalar topilmadi
                </td>
              </tr>
            ) : (
              mechanics.map((mechanic) => (
                <tr
                  key={mechanic._id}
                  className={`hover:bg-[#F8F9FA] transition-colors cursor-pointer ${
                    mechanic._id ? 'border-l-4 border-l-transparent' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {mechanic.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {mechanic.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mechanic.work_type === 'SERVICE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {mechanic.work_type === 'SERVICE'
                        ? 'Xizmat'
                        : 'Maydon xizmati'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {mechanic.service_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(mechanic.created_at)}
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

// Services Table Component
function ServicesTable() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Check permissions for service/get-all - ceo, manager, rent_cashier
  const canViewServices = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
  ])

  // CEO can see all branches, others only their own branch
  const canViewAllBranches = CheckRole(userRole, ['ceo'])

  const { data: branchesData } = useGetAllBranchesQuery(
    {
      page: 1,
      limit: 100,
    },
    {
      skip: !canViewAllBranches,
    }
  )

  // Use branches data only for CEO, others use their own branch
  const allBranches = branchesData?.data || []
  const availableBranches = canViewAllBranches ? allBranches : []

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetAllServicesQuery(
    {
      status: (selectedStatus.trim() as ServiceStatus) || undefined,
      page: currentPage,
      limit: pageSize,
    },
    {
      skip: !canViewServices,
    }
  )

  // Navigate to dashboard if no permission
  if (!canViewServices) {
    navigate('/dashboard')
    return null
  }

  const services = servicesData?.data || []
  const pagination = servicesData?.pagination

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: ServiceStatus | '') => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  // Show permission error if user doesn't have access
  if (!canViewServices) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-lg text-red-500 mb-4">
            Sizda ushbu ma'lumotlarni ko'rish huquqi yo'q
          </div>
          <div className="text-sm text-gray-500">
            Xizmatlarni ko'rish faqat CEO, manager va rent_cashier rollari uchun
            ruxsat etilgan
          </div>
        </div>
      </div>
    )
  }

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (servicesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-500">Xatolik yuz berdi</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {CheckRole(userRole, ['manager', 'rent_cashier']) && (
            <Button
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              onClick={() => navigate('/new-repair')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Xizmat qo'shish
            </Button>
          )}
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Holatni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Barcha holatlar</SelectItem>
              <SelectItem value="IN_PROGRESS">Jarayonda</SelectItem>
              <SelectItem value="COMPLETED">Tugallangan</SelectItem>
              <SelectItem value="CANCELLED">Bekor qilingan</SelectItem>
            </SelectContent>
          </Select>
          {canViewAllBranches && (
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filialni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Barcha filiallar</SelectItem>
                {availableBranches.map((branch) => (
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
              <th className="px-6 py-3 text-left font-medium">Mijoz ismi</th>
              <th className="px-6 py-3 text-left font-medium">Telefon raqam</th>
              <th className="px-6 py-3 text-center font-medium">
                Xizmat narxi
              </th>
              <th className="px-6 py-3 text-center font-medium">Holat</th>
              <th className="px-6 py-3 text-center font-medium">
                Qabul sanasi
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Yetkazish sanasi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Xizmatlar topilmadi
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service._id}
                  className={`hover:bg-[#F8F9FA] transition-colors cursor-pointer ${
                    service._id ? 'border-l-4 border-l-transparent' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#18181B]">
                      {service.client_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {service.client_phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(service.servicePrice)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.status === 'COMPLETED'
                        ? 'Tugallangan'
                        : service.status === 'IN_PROGRESS'
                          ? 'Jarayonda'
                          : 'Bekor qilingan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(service.received_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatDate(service.delivery_date)}
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

// Main Repairs Component
export default function Repairs() {
  const navigate = useNavigate()
  const userRole = useGetRole()

  // Check permissions
  const canViewServices = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
  ])
  const canViewMechanics = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
  ])

  // If user has no permissions at all, navigate to dashboard
  if (!canViewServices && !canViewMechanics) {
    navigate('/dashboard')
    return null
  }

  // Determine default tab based on permissions
  const defaultTab = canViewServices ? 'services' : 'mechanics'
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Ta'mirlash Xizmatlari
        </h1>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList
          className={`grid w-full ${canViewServices && canViewMechanics ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {canViewServices && (
            <TabsTrigger value="services">Xizmatlar</TabsTrigger>
          )}
          {canViewMechanics && (
            <TabsTrigger value="mechanics">Ustalar</TabsTrigger>
          )}
        </TabsList>
        {canViewServices && (
          <TabsContent value="services" className="space-y-4">
            <ServicesTable />
          </TabsContent>
        )}
        {canViewMechanics && (
          <TabsContent value="mechanics" className="space-y-4">
            <MechanicsTable />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
