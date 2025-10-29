import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumberInput } from '@/utils/numberFormat'

// UI Components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'

// Types
import type { Client } from '@/types/clients.d'

interface Mechanic {
  _id: string
  fullName: string
  phone: string
  work_type: string
}

interface ServiceFormFieldsProps {
  // Form instance
  form: UseFormReturn<any>

  // Clients data
  clientsData?: { data: Client[] }
  clientsLoading: boolean
  clientSearch: string
  setClientSearch: (value: string) => void
  setSelectedClient: (client: Client | null) => void
  selectedClient: Client | null

  // Mechanics data
  mechanicsData?: { data: Mechanic[] }
  mechanicsLoading: boolean

  // Salary display state
  salaryDisplay: string
  setSalaryDisplay: (value: string) => void

  // Price changes flag
  hasPriceChanges: boolean

  // Discount state (optional - only shown when maxDiscount > 0)
  maxDiscount?: number
  discountDisplay?: string
  onDiscountChange?: (value: string) => void
  onDiscountBlur?: (currentValue: number) => void

  // Total products sum for validation
  totalProductsSum?: number
}

export default function ServiceFormFields({
  form,
  clientsData,
  clientsLoading,
  clientSearch,
  setClientSearch,
  setSelectedClient,
  selectedClient,
  mechanicsData,
  mechanicsLoading,
  salaryDisplay,
  setSalaryDisplay,
  hasPriceChanges,
  maxDiscount = 0,
  discountDisplay = '',
  onDiscountChange,
  onDiscountBlur,
  totalProductsSum = 0,
}: ServiceFormFieldsProps) {
  return (
    <>
      {/* Client Selection */}
      <FormField
        control={form.control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mijoz *</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                const client = clientsData?.data.find((c) => c._id === value)
                setSelectedClient(client || null)
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mijozni tanlang" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Mijoz qidirish..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="mb-2"
                  />
                </div>
                {clientsLoading ? (
                  <SelectItem value="loading" disabled>
                    Yuklanmoqda...
                  </SelectItem>
                ) : clientsData?.data.length === 0 ? (
                  <SelectItem value="no-clients" disabled>
                    Mijozlar topilmadi
                  </SelectItem>
                ) : (
                  clientsData?.data.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.username} - {client.phone}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mechanic Selection */}
      <FormField
        control={form.control}
        name="mechanic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usta (ixtiyoriy)</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || 'none'}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ustani tanlang (ixtiyoriy)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Usta tanlanmagan</SelectItem>
                {mechanicsLoading ? (
                  <SelectItem value="loading" disabled>
                    Yuklanmoqda...
                  </SelectItem>
                ) : (
                  mechanicsData?.data.map((mechanic) => (
                    <SelectItem key={mechanic._id} value={mechanic._id}>
                      {mechanic.fullName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mechanic Salary */}
      <FormField
        control={form.control}
        name="mechanic_salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usta maoshi (ixtiyoriy)</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="0"
                value={
                  salaryDisplay ||
                  (field.value > 0
                    ? formatNumberInput(field.value.toString()).display
                    : '')
                }
                onChange={(e) => {
                  const inputValue = e.target.value
                  if (inputValue === '' || inputValue === '0') {
                    setSalaryDisplay('')
                    field.onChange(0)
                  } else {
                    const formatted = formatNumberInput(inputValue)
                    setSalaryDisplay(formatted.display)
                    field.onChange(formatted.numeric)
                  }
                }}
                onBlur={() => {
                  // Update display to match the numeric value
                  if (field.value > 0) {
                    setSalaryDisplay(
                      formatNumberInput(field.value.toString()).display
                    )
                  } else {
                    setSalaryDisplay('')
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Received Date */}
      <FormField
        control={form.control}
        name="received_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Qabul qilish sanasi *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'dd/MM/yyyy HH:mm')
                    ) : (
                      <span>Sana va vaqtni tanlang</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      const existingTime = field.value || new Date()
                      const newDate = new Date(date)
                      newDate.setHours(existingTime.getHours())
                      newDate.setMinutes(existingTime.getMinutes())
                      field.onChange(newDate)
                    }
                  }}
                  disabled={(date) => date < new Date('1900-01-01')}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Vaqt:</label>
                    <div className="flex space-x-1">
                      <Select
                        value={field.value ? format(field.value, 'HH') : ''}
                        onValueChange={(hour) => {
                          if (field.value) {
                            const newDate = new Date(field.value)
                            newDate.setHours(parseInt(hour))
                            field.onChange(newDate)
                          }
                        }}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, '0')}
                            >
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm self-center">:</span>
                      <Select
                        value={field.value ? format(field.value, 'mm') : ''}
                        onValueChange={(minute) => {
                          if (field.value) {
                            const newDate = new Date(field.value)
                            newDate.setMinutes(parseInt(minute))
                            field.onChange(newDate)
                          }
                        }}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, '0')}
                            >
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Delivery Date */}
      <FormField
        control={form.control}
        name="delivery_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Topshirish sanasi *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'dd/MM/yyyy HH:mm')
                    ) : (
                      <span>Sana va vaqtni tanlang</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      const existingTime = field.value || new Date()
                      const newDate = new Date(date)
                      newDate.setHours(existingTime.getHours())
                      newDate.setMinutes(existingTime.getMinutes())
                      field.onChange(newDate)
                    }
                  }}
                  disabled={(date) => date < new Date('1900-01-01')}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Vaqt:</label>
                    <div className="flex space-x-1">
                      <Select
                        value={field.value ? format(field.value, 'HH') : ''}
                        onValueChange={(hour) => {
                          if (field.value) {
                            const newDate = new Date(field.value)
                            newDate.setHours(parseInt(hour))
                            field.onChange(newDate)
                          }
                        }}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, '0')}
                            >
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm self-center">:</span>
                      <Select
                        value={field.value ? format(field.value, 'mm') : ''}
                        onValueChange={(minute) => {
                          if (field.value) {
                            const newDate = new Date(field.value)
                            newDate.setMinutes(parseInt(minute))
                            field.onChange(newDate)
                          }
                        }}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, '0')}
                            >
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Comment Field - Only shown when prices are changed */}
      {hasPriceChanges && (
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Izoh <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mahsulot narxi o'zgartirildi. Sababini yozing..."
                  className="resize-none border-red-200 focus:border-red-300"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-red-600">
                Mahsulot narxi o'zgartirilgan! Izoh majburiy.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Discount Field - Only shown when client has bonus and eligible */}
      {maxDiscount > 0 && (
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => {
            const currentDiscount = field.value || 0
            // Real maksimal chegirma - jami summa va bonus orasidagi eng kichigi
            const maxAllowedDiscount = Math.min(maxDiscount, totalProductsSum)
            // Chegirma maksimal ruxsat etilgan qiymatdan oshganligi
            const isExceedingLimit = currentDiscount > maxAllowedDiscount
            // Aniq qaysi limitni oshganligi
            const isExceedingTotal = currentDiscount > totalProductsSum
            const isExceedingBonus = currentDiscount > maxDiscount

            return (
              <FormItem>
                <FormLabel>
                  Bonus chegirma (maksimal:{' '}
                  {maxAllowedDiscount.toLocaleString('uz-UZ')} so'm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0"
                    disabled={totalProductsSum === 0}
                    className={cn(
                      isExceedingLimit &&
                        'border-red-500 focus-visible:ring-red-500'
                    )}
                    value={
                      discountDisplay ||
                      (currentDiscount > 0
                        ? formatNumberInput(currentDiscount.toString()).display
                        : '')
                    }
                    onChange={(e) => {
                      onDiscountChange?.(e.target.value)
                    }}
                    onBlur={() => {
                      onDiscountBlur?.(currentDiscount)
                    }}
                  />
                </FormControl>
                {isExceedingTotal && (
                  <p className="text-sm text-red-600">
                    Chegirma jami summadan (
                    {totalProductsSum.toLocaleString('uz-UZ')} so'm) katta
                    bo'lmasligi kerak!
                  </p>
                )}
                {!isExceedingTotal && isExceedingBonus && (
                  <p className="text-sm text-red-600">
                    Chegirma bonusdagi qoldiq miqdordan (
                    {maxDiscount.toLocaleString('uz-UZ')} so'm) oshmasligi
                    kerak!
                  </p>
                )}
                {!isExceedingLimit &&
                  maxDiscount > 0 &&
                  totalProductsSum > 0 && (
                    <p className="text-sm text-gray-600">
                      Chegirma: {formatCurrency(maxDiscount)} qoldi
                    </p>
                  )}
                {selectedClient &&
                  maxDiscount > 0 &&
                  totalProductsSum === 0 && (
                    <p className="text-sm text-gray-600">
                      Bonusdan foydalanish uchun mahsulot tanlang
                    </p>
                  )}
                <FormMessage />
              </FormItem>
            )
          }}
        />
      )}
    </>
  )
}
