import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAddMechanicMutation } from '@/store/mechanic/mechanic.api'
import { toast } from 'sonner'
import { useGetUser } from '@/hooks/useGetUser'

// Mechanic schema
const addMechanicSchema = z.object({
  fullName: z
    .string({ required_error: "To'liq ismni kiriting" })
    .min(2, "To'liq ism kamida 2 ta belgi"),
  phone: z
    .string({ required_error: 'Telefon raqamini kiriting' })
    .regex(/^\+?\d[\d\s-]{7,}$/g, "Raqam formati noto'g'ri"),
  work_type: z.enum(['SERVICE', 'FIELD_SERVICE'], {
    required_error: 'Ish turini tanlang',
  }),
  branch_id: z.string().optional(),
})

type AddMechanicValues = z.infer<typeof addMechanicSchema>

export default function AddMechanicDialog() {
  const [open, setOpen] = useState(false)
  const [addMechanic, { isLoading }] = useAddMechanicMutation()

  const user = useGetUser()

  const form = useForm<AddMechanicValues>({
    resolver: zodResolver(addMechanicSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      work_type: undefined,
      branch_id: '',
    },
  })

  const onSubmit = async (values: AddMechanicValues) => {
    try {
      const result = await addMechanic({
        ...values,
        branch_id: user?.branch_id._id || '',
      }).unwrap()
      if (result.success) {
        toast.success("Ustala muvaffaqiyatli qo'shildi!")
        form.reset()
        setOpen(false)
      } else {
        toast.error(result.message || 'Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Add mechanic error:', error)
      toast.error('Xatolik yuz berdi')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Ustala qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yangi ustala qo'shish</DialogTitle>
          <DialogDescription>
            Yangi ustala ma'lumotlarini kiriting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To'liq ism</FormLabel>
                  <FormControl>
                    <Input placeholder="To'liq ismni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon raqam</FormLabel>
                  <FormControl>
                    <Input placeholder="+998 90 123 45 67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ish turi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ish turini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SERVICE">Xizmat</SelectItem>
                      <SelectItem value="FIELD_SERVICE">
                        Maydon xizmati
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Qo'shilmoqda..." : "Qo'shish"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
