import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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

// Service schema
const addServiceSchema = z.object({
  client_name: z.string().min(2, 'Mijoz ismi kamida 2 ta belgi'),
  cash_amount: z.number().min(0, "Naqd miqdor manfiy bo'lmasligi kerak"),
  terminal_amount: z
    .number()
    .min(0, "Terminal miqdor manfiy bo'lmasligi kerak"),
  mechanic: z.string().min(1, 'Usta shart'),
  service_date: z.string().min(1, 'Sana shart'),
  service_end_date: z.string().min(1, 'Sana shart'),
  time_spent: z.string().min(1, 'Ketgan vaqt shart'),
  service_price: z.number().min(0, "Xizmat narxi manfiy bo'lmasligi kerak"),
})

type AddServiceValues = z.infer<typeof addServiceSchema>

interface Mechanic {
  _id: string
  fullName: string
  phone: string
  work_type: string
}

interface ServiceFormProps {
  mechanics: Mechanic[]
  onSubmit: (values: AddServiceValues) => void
  loading?: boolean
}

export function ServiceForm({
  mechanics,
  onSubmit,
  loading = false,
}: ServiceFormProps) {
  const form = useForm<AddServiceValues>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      client_name: '',
      cash_amount: 9000000,
      terminal_amount: 0,
      mechanic: '',
      service_date: '',
      service_end_date: '',
      time_spent: '',
      service_price: 0,
    },
  })

  const handleSubmit = (values: AddServiceValues) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mijoz ismi *</FormLabel>
                <FormControl>
                  <Input placeholder="Mijoz ismini kiriting" {...field} />
                </FormControl>
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
                <FormLabel>Usta *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ustani tanlang" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mechanics.map((mechanic) => (
                      <SelectItem key={mechanic._id} value={mechanic._id}>
                        {mechanic.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Date */}
          <FormField
            control={form.control}
            name="service_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Xizmat sanasi *</FormLabel>
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
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Sanani tanlang</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString())
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service End Date */}
          <FormField
            control={form.control}
            name="service_end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tugash sanasi *</FormLabel>
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
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Sanani tanlang</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString())
                        }
                      }}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Spent */}
          <FormField
            control={form.control}
            name="time_spent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ketgan vaqt *</FormLabel>
                <FormControl>
                  <Input placeholder="Misol: 2 soat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Price */}
          <FormField
            control={form.control}
            name="service_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xizmat narxi *</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cash Amount */}
          <FormField
            control={form.control}
            name="cash_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naqd to'lov</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terminal Amount */}
          <FormField
            control={form.control}
            name="terminal_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal to'lov</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Bekor qilish
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
