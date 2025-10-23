import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { useUpdateBonusTypeMutation } from '@/store/bonus/bonus.api'
import { toast } from 'sonner'
import type { BonusType } from '@/types/bonus'
import { useEffect } from 'react'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  bonusType: BonusType
}

export default function EditBonusDialog({ open, setOpen, bonusType }: Props) {
  const [updateBonusType, { isLoading }] = useUpdateBonusTypeMutation()

  const form = useForm<AddBonusTypeValues>({
    resolver: zodResolver(addBonusTypeSchema),
    defaultValues: {
      bonus_name: bonusType.bonus_name,
      target_amount: bonusType.target_amount.toString(),
      discount_amount: bonusType.discount_amount.toString(),
    },
  })

  useEffect(() => {
    if (bonusType) {
      form.reset({
        bonus_name: bonusType.bonus_name,
        target_amount: bonusType.target_amount.toString(),
        discount_amount: bonusType.discount_amount.toString(),
      })
    }
  }, [bonusType, form])

  const onSubmit = async (data: AddBonusTypeValues) => {
    try {
      await updateBonusType({
        id: bonusType._id,
        body: {
          bonus_name: data.bonus_name,
          target_amount: Number(data.target_amount),
          discount_amount: Number(data.discount_amount),
        },
      }).unwrap()

      toast.success('Bonus turi muvaffaqiyatli yangilandi')
      setOpen(false)
    } catch {
      toast.error('Bonus turini yangilashda xatolik yuz berdi')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bonus turini tahrirlash</DialogTitle>
          <p className="text-sm text-[#71717A]">
            Bonus turi ma'lumotlarini o'zgartiring
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
                    <Input
                      type="number"
                      placeholder="1000000"
                      min="0"
                      {...field}
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
                    <Input
                      type="number"
                      placeholder="150000"
                      min="0"
                      {...field}
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
