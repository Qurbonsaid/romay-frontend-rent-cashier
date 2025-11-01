import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ClientBonus } from '@/types/bonus'

type ClientBonusDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  bonus: ClientBonus | null
}

export default function ClientBonusDetailsModal({
  isOpen,
  onClose,
  bonus,
}: ClientBonusDetailsModalProps) {
  if (!bonus) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
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

  const expired = isExpired(bonus.end_date)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold text-[#09090B]">
            Bonus to'liq ma'lumotlari
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mijoz ma'lumotlari */}
          <div className="border border-[#E4E4E7] rounded-lg p-5">
            <h3 className="text-base font-semibold text-[#18181B] mb-4">
              Mijoz ma'lumotlari
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                title="Mijoz ismi"
                value={bonus.client.username || "Ma'lumot yo'q"}
              />
              <InfoItem
                title="Telefon raqami"
                value={bonus.client.phone || 'Mavjud emas'}
              />
              <InfoItem
                title="Kasbi"
                value={bonus.client.profession || "Ko'rsatilmagan"}
              />
              <InfoItem
                title="Manzili"
                value={bonus.client.address || "Ko'rsatilmagan"}
              />
              <InfoItem
                title="Mijoz segmenti"
                value={bonus.client.customer_tier || "Ko'rsatilmagan"}
              />
              <InfoItem
                title="Tug'ilgan kuni"
                value={
                  bonus.client.birth_date
                    ? formatDate(bonus.client.birth_date)
                    : "Ko'rsatilmagan"
                }
              />
            </div>
          </div>

          {/* Bonus ma'lumotlari */}
          <div className="border border-[#E4E4E7] rounded-lg p-5">
            <h3 className="text-base font-semibold text-[#18181B] mb-4">
              Bonus ma'lumotlari
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                title="Bonus nomi"
                value={bonus.bonus_type?.bonus_name || "Noma'lum bonus turi"}
              />
              <InfoItem
                title="Xizmat turi"
                value={
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(bonus.type)}`}
                  >
                    {getTypeLabel(bonus.type)}
                  </span>
                }
              />
              <InfoItem
                title="Maqsad miqdori"
                value={
                  <span className="text-[#18181B] font-medium">
                    {bonus.bonus_type?.target_amount?.toLocaleString('uz-UZ') ||
                      0}{' '}
                    so'm
                  </span>
                }
              />
              <InfoItem
                title="Chegirma miqdori"
                value={
                  <span className="text-emerald-600 font-medium">
                    {bonus.bonus_type?.discount_amount?.toLocaleString(
                      'uz-UZ'
                    ) || 0}{' '}
                    so'm
                  </span>
                }
              />
              <InfoItem
                title="Mijozda qolgan chegirma"
                value={
                  <span
                    className={`font-semibold text-base ${bonus.client_discount_amount > 0 ? 'text-emerald-600' : 'text-yellow-600'}`}
                  >
                    {bonus.client_discount_amount > 0
                      ? (bonus.client_discount_amount?.toLocaleString(
                          'uz-UZ'
                        ) || 0) + " so'm"
                      : 'Tugagan'}
                  </span>
                }
              />
              <InfoItem
                title="Holati"
                value={
                  expired ? (
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Muddati o'tgan
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Faol
                    </span>
                  )
                }
              />
              <InfoItem
                title="Boshlanish sanasi"
                value={formatDate(bonus.start_date)}
              />
              <InfoItem
                title="Tugash sanasi"
                value={
                  <span className={expired ? 'text-red-600' : ''}>
                    {formatDate(bonus.end_date)}
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-[#71717A]">{title}</div>
      <div className="text-sm font-medium text-[#18181B]">
        {value || "Ma'lumot yo'q"}
      </div>
    </div>
  )
}
