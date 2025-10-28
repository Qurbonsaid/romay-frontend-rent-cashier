import { format } from 'date-fns'
import type { UseFormWatch } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/numberFormat'
import type { Client } from '@/types/clients.d'

interface Mechanic {
  _id: string
  fullName: string
}

interface ServiceSummaryProps {
  // Form watch function
  formWatch: UseFormWatch<any>

  // Selected client
  selectedClient: Client | null

  // Mechanics data
  mechanicsData?: { data: Mechanic[] }

  // Products data
  totalProductsSum: number
  selectedProductsCount: number

  // Discount data
  maxDiscount: number
  currentDiscount: number

  // Submit button state
  isSubmitting: boolean
  canSubmit: boolean
}

export default function ServiceSummary({
  formWatch,
  selectedClient,
  mechanicsData,
  totalProductsSum,
  selectedProductsCount,
  maxDiscount,
  currentDiscount,
  isSubmitting,
  canSubmit,
}: ServiceSummaryProps) {
  const mechanicId = formWatch('mechanic')
  const mechanicSalary = formWatch('mechanic_salary')
  const receivedDate = formWatch('received_date')
  const deliveryDate = formWatch('delivery_date')

  const selectedMechanic =
    mechanicId && mechanicId !== 'none'
      ? mechanicsData?.data.find((m) => m._id === mechanicId)
      : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xizmat xulosasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Client Information */}
          <div className="p-2 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Tanlangan mijoz:</h4>
            {selectedClient ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ismi</span>
                  <span className="text-sm font-medium">
                    {selectedClient.username}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Telefon</span>
                  <span className="text-sm font-medium">
                    {selectedClient.phone}
                  </span>
                </div>
                {selectedClient.profession && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Kasbi</span>
                    <span className="text-sm font-medium">
                      {selectedClient.profession}
                    </span>
                  </div>
                )}
                {selectedClient.address && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Manzil</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">
                      {selectedClient.address}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-1">Mijoz tanlanmagan</p>
            )}
          </div>

          {/* Mechanic Information */}
          <div className="p-2 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Usta (ixtiyoriy):</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ismi</span>
                <span className="text-sm font-medium">
                  {selectedMechanic?.fullName || 'Tanlanmagan'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maosh</span>
                <span className="text-sm font-medium">
                  {mechanicSalary > 0
                    ? formatCurrency(mechanicSalary)
                    : 'Belgilanmagan'}
                </span>
              </div>
            </div>
          </div>

          {/* Products Total */}
          <div className="p-2 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Mahsulotlar jami:</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Jami narx</span>
              <span
                className={`text-sm font-medium ${
                  maxDiscount > 0 && selectedClient?.bonus
                    ? 'line-through text-red-500'
                    : ''
                }`}
              >
                {formatCurrency(totalProductsSum)}
              </span>
            </div>

            {maxDiscount > 0 && selectedClient?.bonus && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chegirma bilan</span>
                <span className="text-sm font-medium text-green-500">
                  {formatCurrency(totalProductsSum - currentDiscount)}
                </span>
              </div>
            )}
          </div>

          {/* Discount Information - Only shown when discount > 0 and bonus exists */}
          {maxDiscount > 0 && selectedClient?.bonus?.bonus_type && (
            <div className="p-2 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Bonus chegirma:</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bonus turi</span>
                  <span className="text-sm font-medium">
                    {selectedClient.bonus.bonus_type?.bonus_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maqsad summa</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      selectedClient.bonus.bonus_type?.target_amount || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Maksimal chegirma
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(maxDiscount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Dates Information */}
          <div className="p-2 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Sanalar:</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Qabul qilish</span>
                <span className="text-sm font-medium">
                  {receivedDate
                    ? format(receivedDate, 'dd/MM/yyyy HH:mm')
                    : 'Tanlanmagan'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Topshirish</span>
                <span className="text-sm font-medium">
                  {deliveryDate
                    ? format(deliveryDate, 'dd/MM/yyyy HH:mm')
                    : 'Tanlanmagan'}
                </span>
              </div>
            </div>
          </div>

          {/* Create Service Button */}
          <div className="pt-2">
            <Button
              type="submit"
              form="service-form"
              disabled={!canSubmit || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Saqlanmoqda...' : 'Xizmat yaratish'}
            </Button>
            {!canSubmit && (
              <p className="text-xs text-gray-500 mt-1 text-center">
                {!selectedClient && 'Mijoz tanlang va '}
                {selectedProductsCount === 0 && 'mahsulot tanlang'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
