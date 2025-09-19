import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TablePagination } from '@/components/ui/table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus } from 'lucide-react'
import { useGetAllServicesQuery } from '@/store/service/service.api'
import type { ServiceStatus } from '@/store/service/types'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB')
}

const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: ServiceStatus): string => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'Jarayonda'
    case 'COMPLETED':
      return 'Tugallangan'
    case 'CANCELLED':
      return 'Bekor qilingan'
    default:
      return status
  }
}

export function ServicesTable() {
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

  const handleStatusChange = (status: ServiceStatus | '') => {
    setSelectedStatus(status)
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
      status: selectedStatus || undefined,
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
  const pagination = {
    current_page: servicesData?.current_page || 1,
    page_count: servicesData?.page_count || 1,
    after_filtering_count: servicesData?.after_filtering_count || 0,
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Xizmatlar</h2>
        {CheckRole(userRole, ['manager', 'rent_cashier', 'ceo']) && (
          <Button onClick={() => navigate('/repairs/add-service')}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi xizmat
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Xizmatlar bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Holat bo'yicha filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Barchasi</SelectItem>
            <SelectItem value="IN_PROGRESS">Jarayonda</SelectItem>
            <SelectItem value="COMPLETED">Tugallangan</SelectItem>
            <SelectItem value="CANCELLED">Bekor qilingan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Narx
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.client_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {typeof service.mechanic === 'string'
                          ? service.mechanic
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusText(service.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(service.totalAmount)} so'm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(service.received_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/repairs/service/${service._id}`)
                        }
                      >
                        Ko'rish
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg">Xizmatlar topilmadi</p>
                      <p className="text-sm">
                        Qidiruv shartlarini o'zgartiring yoki yangi xizmat
                        qo'shing
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {services.length > 0 && (
          <div className="px-6 py-4 border-t">
            <TablePagination
              currentPage={pagination.current_page}
              totalPages={pagination.page_count}
              totalItems={pagination.after_filtering_count}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
