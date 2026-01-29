import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { CalendarIcon, UserPlus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// API
import { useAddClientMutation } from '@/store/clients/clients.api'

// Validation schema for adding client
const addClientSchema = z.object({
  username: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak")
    .regex(
      /^(\+998|998)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Telefon raqami formati noto'g'ri (masalan: +998901234567)"
    ),
  profession: z
    .string()
    .min(2, "Kasb kamida 2 ta belgidan iborat bo'lishi kerak"),
  birth_date: z.date({ message: "Tug'ilgan sanani tanlang" }),
  address: z
    .string()
    .min(3, "Manzil kamida 3 ta belgidan iborat bo'lishi kerak"),
  description: z.string().optional(),
})

type AddClientFormData = z.infer<typeof addClientSchema>

interface AddClientModalProps {
  isOpen: boolean
  onClose: () => void
  branchId: string
  onClientAdded?: (clientPhone: string) => void
}

export default function AddClientModal({
  isOpen,
  onClose,
  branchId,
  onClientAdded,
}: AddClientModalProps) {
  const [addClient, { isLoading }] = useAddClientMutation()
  const [calendarOpen, setCalendarOpen] = useState(false)

  const form = useForm<AddClientFormData>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      username: '',
      phone: '+998',
      profession: '',
      address: '',
      description: '',
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (data: AddClientFormData) => {
    try {
      // Format phone number - remove spaces and ensure it starts with +998
      let formattedPhone = data.phone.replace(/[\s-]/g, '')
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('998')) {
          formattedPhone = '+' + formattedPhone
        } else {
          formattedPhone = '+998' + formattedPhone
        }
      }

      await addClient({
        username: data.username,
        phone: formattedPhone,
        profession: data.profession,
        birth_date: format(data.birth_date, 'yyyy-MM-dd'),
        address: data.address,
        description: data.description || '',
        branch_id: branchId,
      }).unwrap()

      toast.success("Mijoz muvaffaqiyatli qo'shildi!")

      // Callback'ga telefon raqamini uzatamiz - parent component bu orqali yangi mijozni topadi
      if (onClientAdded) {
        onClientAdded(formattedPhone)
      }

      handleClose()
    } catch (error: any) {
      let errorMessage = "Mijoz qo'shishda xatolik yuz berdi"

      if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.error?.msg) {
        errorMessage = error.data.error.msg
      } else if (error?.data?.error) {
        errorMessage =
          typeof error.data.error === 'string'
            ? error.data.error
            : JSON.stringify(error.data.error)
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Yangi mijoz qo'shish
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Mijoz ma'lumotlarini to'ldiring
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* Username field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ism *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mijoz ismini kiriting"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon raqami *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+998 90 123 45 67"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Two columns on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Profession field */}
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kasbi *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kasbi"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth date field */}
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tug'ilgan sana *</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={isLoading}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd.MM.yyyy')
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
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setCalendarOpen(false)
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1940}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Manzilni kiriting"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description field (optional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh (ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mijoz haqida qo'shimcha ma'lumot..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Saqlash
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
