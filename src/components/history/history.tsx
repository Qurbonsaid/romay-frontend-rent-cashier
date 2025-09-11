// import { useState } from 'react'
// import { HistoryDetails } from '../../pages/birthday/history-details'
import { useGetHistoryQuery } from '@/store/history/history.api'
import dayjs from 'dayjs'
import { TableSkeleton } from '../ui/table-skeleton'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { History } from '@/types/history'

export default function History() {
  // TODO: Uncomment when HistoryDetails component is ready
  // const [selectedHistory, setSelectedHistory] = useState<History | null>(null)
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    data: { data: history = [] } = {},
    isLoading,
    isError,
  } = useGetHistoryQuery({})

  // TODO: Uncomment when HistoryDetails component is ready
  // const closeModal = () => {
  //   setIsModalOpen(false)
  //   setSelectedHistory(null)
  // }

  if (isLoading) {
    return <TableSkeleton rows={5} columns={4} />
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-red-600">Xatolik yuz berdi</p>
      </div>
    )
  }

  if (!history?.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[30px] font-semibold text-[#09090B]">
            Xodimlarning harakati tarixi
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 border border-[#E4E4E7] rounded-lg">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">Ma'lumot topilmadi</p>
          <p className="text-sm text-gray-500 mt-2">
            Hozircha hech qanday harakatlar mavjud emas
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Xodimlarning harakati tarixi
        </h1>
        {/* <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filialni tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha Filiallar</SelectItem>
            <SelectItem value="filial1">Termiz Filiali</SelectItem>
            <SelectItem value="filial2">Filial 2</SelectItem>
            <SelectItem value="filial3">Filial 3</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Vaqti</th>
              <th className="px-6 py-3 text-left font-medium">O'zgargan</th>
              <th className="px-6 py-3 text-left font-medium">Harakat turi</th>
              <th className="px-6 py-3 text-left font-medium">Izoh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {history?.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-[#F9F9F9] cursor-pointer transition-colors"
                onClick={() => {
                  // TODO: Uncomment when HistoryDetails component is ready
                  // setSelectedHistory(item as History)
                  // setIsModalOpen(true)
                  console.log('History item clicked:', item)
                }}
              >
                <td className="px-6 py-4 text-sm text-[#18181B]">
                  {dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}
                </td>
                <td className="px-6 py-4 text-sm text-[#18181B]">
                  {item.user_id?.username || "Noma'lum"}
                </td>
                <td className="px-6 py-4 text-sm text-[#18181B]">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs',
                      item.action === 'create'
                        ? 'bg-green-100 text-green-800'
                        : item.action === 'update'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {item.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#18181B] max-w-xs truncate">
                  {item.description || 'Izoh mavjud emas'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <HistoryDetails
        isOpen={isModalOpen}
        onClose={closeModal}
        historyItem={selectedHistory}
      /> */}
    </div>
  )
}
