import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { TablePagination } from '@/components/ui/table-pagination'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
} from '@/store/service/service.api'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import type { ServiceStatus } from '@/store/service/types'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import AddMechanicDialog from './AddMechanicDialog'
import MechanicDetailsModal from './MechanicDetailsModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB')
}

// Mechanics Table Component
function MechanicsTable({
  onMechanicSelect,
}: {
  onMechanicSelect: (m: any) => void
}) {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all')

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

  const handleWorkTypeChange = (value: string) => {
    setWorkTypeFilter(value)
    setCurrentPage(1)
  }

  // Check permissions for mechanic/get-all - ceo, manager, rent_cashier
  const canViewMechanics = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
  ])

  const {
    data: mechanicsData,
    isLoading: mechanicsLoading,
    error: mechanicsError,
  } = useGetAllMechanicsQuery(
    {
      search: searchTerm || undefined,
      work_type:
        workTypeFilter !== 'all'
          ? (workTypeFilter as 'SERVICE' | 'FIELD_SERVICE')
          : undefined,
      page: currentPage,
      limit: limit,
    },
    {
      skip: !canViewMechanics,
    }
  )

  // Navigate to dashboard if no permission
  if (!canViewMechanics) {
    navigate('/dashboard')
    return null
  }

  const mechanics = mechanicsData?.data || []
  const pagination = {
    current_page: mechanicsData?.current_page || 1,
    page_count: mechanicsData?.page_count || 1,
    after_filtering_count: mechanicsData?.after_filtering_count || 0,
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Usta nomi bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Select value={workTypeFilter} onValueChange={handleWorkTypeChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ish turini tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha ish turlari</SelectItem>
              <SelectItem value="SERVICE">Xizmat</SelectItem>
              <SelectItem value="FIELD_SERVICE">Tashqi xizmati</SelectItem>
            </SelectContent>
          </Select>
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
                  onClick={() => onMechanicSelect(mechanic)}
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
                        : 'Tashqi xizmati'}
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

      <TablePagination
        currentPage={pagination.current_page}
        totalPages={pagination.page_count}
        totalItems={pagination.after_filtering_count}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        className="mt-6"
      />
    </div>
  )
}

// Mechanic details modal local import will be added at bottom via new file

// Services Table Component
function ServicesTable({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: (serviceId: string) => void
  onDeleteClick: (serviceId: string) => void
}) {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

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

  // Check permissions for service/get-all - ceo, manager, rent_cashier
  const canViewServices = CheckRole(userRole, [
    'ceo',
    'manager',
    'rent_cashier',
  ])

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetAllServicesQuery(
    {
      search: searchTerm || undefined,
      status: (selectedStatus.trim() as ServiceStatus) || undefined,
      page: currentPage,
      limit: limit,
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
  const servicesPagination = {
    current_page: servicesData?.current_page || 1,
    page_count: servicesData?.page_count || 1,
    after_filtering_count: servicesData?.after_filtering_count || 0,
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Mijoz nomi bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
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
              <th className="px-6 py-3 text-center font-medium">Usta haqqi</th>
              <th className="px-6 py-3 text-center font-medium">Holat</th>
              <th className="px-6 py-3 text-center font-medium">
                Qabul sanasi
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Yetkazish sanasi
              </th>
              <th className="px-6 py-3 text-center font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
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
                  onClick={() => navigate(`/repair-details/${service._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-medium text-[#18181B] hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/clients')
                      }}
                    >
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
                      {formatPrice(service.totalAmount)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {formatPrice(service.mechanic_salary)} so'm
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditClick(service._id)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteClick(service._id)
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
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
        currentPage={servicesPagination.current_page}
        totalPages={servicesPagination.page_count}
        totalItems={servicesPagination.after_filtering_count}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        className="mt-6"
      />
    </div>
  )
}

// Main Repairs Component
export default function Repairs() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const [selectedMechanic, setSelectedMechanic] = useState<any | null>(null)
  const [isMechanicModalOpen, setIsMechanicModalOpen] = useState(false)
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  const handleDeleteClick = (serviceId: string) => {
    setDeleteServiceId(serviceId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteServiceId) return

    try {
      await deleteService(deleteServiceId).unwrap()
      setIsDeleteModalOpen(false)
      setDeleteServiceId(null)
      // Toast success message could be added here
    } catch (error) {
      // Toast error message could be added here
      console.error('Failed to delete service:', error)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setDeleteServiceId(null)
  }

  const handleEditClick = (serviceId: string) => {
    navigate(`/edit-service/${serviceId}`)
  }

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
            <ServicesTable
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </TabsContent>
        )}
        {canViewMechanics && (
          <TabsContent value="mechanics" className="space-y-4">
            <MechanicsTable
              onMechanicSelect={(m) => {
                setSelectedMechanic(m)
                setIsMechanicModalOpen(true)
              }}
            />
            <MechanicDetailsModal
              mechanicId={selectedMechanic?._id || null}
              mechanicFromList={selectedMechanic}
              isOpen={isMechanicModalOpen}
              onClose={() => {
                setIsMechanicModalOpen(false)
                setSelectedMechanic(null)
              }}
            />
          </TabsContent>
        )}
      </Tabs>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xizmatni o'chirish"
        description="Bu xizmatni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi."
        isLoading={isDeleting}
      />
    </div>
  )
}
