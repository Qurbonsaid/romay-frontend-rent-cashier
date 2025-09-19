import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import type { Mechanic } from '@/store/mechanic/types.d'
import { User, Phone, Wrench, Calendar, ClipboardList } from 'lucide-react'

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
  // If we already have mechanic data (from list) we can show it immediately
  const { data: mechanicsResponse } = useGetAllMechanicsQuery(
    { page: 1, limit: 100 },
    { skip: !!mechanicFromList }
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Usta ma'lumotlari
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Info Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {mechanic.fullName}
                  </h3>
                  <Badge
                    variant={getWorkTypeBadgeVariant(mechanic.work_type)}
                    className="text-xs"
                  >
                    <Wrench className="h-3 w-3 mr-1" />
                    {getWorkTypeLabel(mechanic.work_type)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Xizmatlar soni</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {mechanic.service_count}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Telefon raqam</div>
                    <div className="font-medium">{mechanic.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      Ishga qabul qilingan
                    </div>
                    <div className="font-medium">
                      {formatDate(mechanic.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-gray-600" />
                Qo'shimcha ma'lumotlar
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Oxirgi yangilanish:</span>
                  <span>{formatDate(mechanic.updated_at)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Holat:</span>
                  <Badge variant="default" className="text-xs">
                    Faol
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
