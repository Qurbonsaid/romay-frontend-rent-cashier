import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  addBonusTypeSchema,
  type AddBonusTypeValues,
} from '@/components/forms/add-bonus.schema'
import { useAddBonusTypeMutation } from '@/store/bonus/bonus.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AddBonusDialog({ open, setOpen }: Props) {
  const branch = useGetBranch()
  const [addBonusType, { isLoading }] = useAddBonusTypeMutation()

  const form = useForm<AddBonusTypeValues>({
    resolver: zodResolver(addBonusTypeSchema),
    defaultValues: {
      bonus_name: '',
      target_amount: '',
      discount_amount: '',
    },
  })

  const onSubmit = async (data: AddBonusTypeValues) => {
    try {
      const branchId = typeof branch === 'object' ? branch._id : branch
      if (!branchId) {
        toast.error('Filial tanlanmagan')
        return
      }

      await addBonusType({
        bonus_name: data.bonus_name,
        target_amount: Number(data.target_amount),
        discount_amount: Number(data.discount_amount),
        branch: branchId,
      }).unwrap()

      toast.success("Bonus turi muvaffaqiyatli qo'shildi")
      setOpen(false)
      form.reset()
    } catch (error: any) {
      // Backend'dan kelgan error xabarni to'g'ridan-to'g'ri ko'rsatish
      let errorMessage = "Bonus turini qo'shishda xatolik yuz berdi"

      if (error?.data?.error?.msg) {
        errorMessage = error.data.error.msg
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.msg) {
        errorMessage = error.data.msg
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bonus turi qo'shish</DialogTitle>
          <p className="text-sm text-[#71717A]">
            Yangi bonus turi yaratish uchun quyidagi ma'lumotlarni kiriting
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bonus_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bonus nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: VIP Bonus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maqsad summa (so'm)</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="1 000 000"
                      value={field.value}
                      onChange={(value) => field.onChange(value.toString())}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Mijoz qancha pul sarflasa bonus oladi
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chegirma summa (so'm)</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="150 000"
                      value={field.value}
                      onChange={(value) => field.onChange(value.toString())}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Mijozga qancha chegirma beriladi
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
