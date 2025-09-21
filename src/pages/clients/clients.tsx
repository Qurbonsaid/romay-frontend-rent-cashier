import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { TablePagination } from '@/components/ui/table-pagination'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import { TableSkeleton } from '../../components/ui/table-skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import { useState } from 'react'
import AddClientDialog from './AddClientDialog'

function BalanceCell({ value }: { value: number }) {
  const isZero = value === 0
  const isNegative = value < 0
  const formatted =
    (isNegative ? '-' : '') + Math.abs(value).toLocaleString('uz-UZ') + " so'm"
  return (
    <span
      className={
        isZero
          ? 'text-emerald-600'
          : isNegative
            ? 'text-rose-600'
            : 'text-emerald-600'
      }
    >
      {isZero ? "0 so'm" : formatted}
    </span>
  )
}

function Clients() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialSearch = (location.state as any)?.search || ''
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState(initialSearch)
  const branch = useGetBranch()
  const role = useGetRole()

  const {
    data: clientsResponse,
    isLoading,
    isError,
  } = useGetClientsQuery({
    search,
    page: currentPage,
    limit,
    branch_id: typeof branch === 'object' ? branch._id : branch,
  })

  const clientsData = clientsResponse?.data || []
  // If navigation passed a search and it returned exactly one client, navigate to its details
  if (initialSearch && clientsData.length === 1) {
    navigate(`/clients/${clientsData[0]._id}`)
  }
  const pagination = {
    current_page: clientsResponse?.current_page || 1,
    page_count: clientsResponse?.page_count || 1,
    after_filtering_count: clientsResponse?.after_filtering_count || 0,
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

  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Mijozlar</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-[300px]"
              placeholder="Mijoz qidirish..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {CheckRole(role, ['manager']) && (
            <Button onClick={() => setOpen(true)} variant="default">
              Mijoz qo'shish
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : isError ? (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">Xatolik yuz berdi</p>
          <p className="text-gray-600">
            Mijozlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib
            ko'ring.
          </p>
        </div>
      ) : clientsData.length === 0 ? (
        <div className="border border-[#E4E4E7] rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">Mijozlar topilmadi</p>
          <p className="text-gray-500">
            Hozircha hech qanday mijoz mavjud emas
          </p>
        </div>
      ) : (
        <>
          <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Ismi</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Telefon raqami
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Kasbi</th>
                  <th className="px-6 py-3 text-left font-medium">Toifa</th>
                  <th className="px-6 py-3 text-left font-medium">Qarz</th>
                  <th className="px-6 py-3 text-center font-medium">
                    Sotuvlar soni
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Qo'shilgan sana
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {clientsData?.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-[#F9F9F9] cursor-pointer"
                    onClick={() => navigate(`/clients/${c._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#18181B]">
                        <Link
                          to={`/clients/${c._id}`}
                          className="hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.username}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {c.phone || 'Mavjud emas'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {c.profession || 'Mavjud emas'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {c.customer_tier || 'Mavjud emas'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <BalanceCell value={c.debt?.amount || 0} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-[#18181B]">
                        {c.sales_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#18181B]">
                        {new Date(c.created_at).toLocaleDateString('en-GB')}
                      </div>
                    </td>
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
      <AddClientDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Clients
