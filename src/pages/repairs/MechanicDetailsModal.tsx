import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import type { Mechanic } from '@/store/mechanic/types.d'
import { User, Wrench } from 'lucide-react'
import { useGetBranch } from '@/hooks/use-get-branch'

type MechanicDetailsModalProps = {
  mechanicId: string | null
  isOpen: boolean
  onClose: () => void
  mechanicFromList?: Mechanic | null
}

export default function MechanicDetailsModal({
  mechanicId,
  isOpen,
  onClose,
  mechanicFromList = null,
}: MechanicDetailsModalProps) {
  const branch = useGetBranch()

  // If we already have mechanic data (from list) we can show it immediately
  const { data: mechanicsResponse } = useGetAllMechanicsQuery(
    {
      page: 1,
      limit: 100,
      branch_id: branch?._id,
    },
    { skip: !!mechanicFromList || !branch }
  )

  let mechanic: Mechanic | null = mechanicFromList

  if (!mechanic && mechanicId && mechanicsResponse) {
    mechanic = mechanicsResponse.data.find((m) => m._id === mechanicId) || null
  }

  if (!mechanic) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getWorkTypeLabel = (workType: string) => {
    switch (workType) {
      case 'SERVICE':
        return 'Xizmat'
      case 'FIELD_SERVICE':
        return 'Tashqi xizmati'
      default:
        return workType
    }
  }

  const getWorkTypeBadgeVariant = (workType: string) => {
    return workType === 'SERVICE' ? 'default' : 'secondary'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Usta ma'lumotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="flex gap-4">
            {/* Avatar placeholder */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border border-gray-200">
                <User className="h-20 w-20 text-blue-500" />
              </div>
            </div>

            {/* Name and Work Type */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {mechanic.fullName}
              </h3>
              <Badge
                variant={getWorkTypeBadgeVariant(mechanic.work_type)}
                className="text-sm"
              >
                <Wrench className="h-3 w-3 mr-1" />
                {getWorkTypeLabel(mechanic.work_type)}
              </Badge>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">TELEFON</div>
              <div className="text-lg font-bold text-green-600">
                {mechanic.phone}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">
                XIZMATLAR SONI
              </div>
              <div className="text-lg font-bold text-blue-600">
                {mechanic.service_count}
              </div>
            </div>

            <div className="text-center col-span-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium">
                ISHGA QABUL QILINGAN
              </div>
              <div className="text-lg font-bold text-purple-600">
                {formatDate(mechanic.created_at)}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-yellow-900">
              Oxirgi yangilanish
            </div>
            <div className="text-yellow-700">
              {formatDate(mechanic.updated_at)}
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-center">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              Faol usta
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
