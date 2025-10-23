import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useGetBonusTypesQuery,
  useAddClientBonusMutation,
} from '@/store/bonus/bonus.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { toast } from 'sonner'
import { useState } from 'react'

const addClientBonusSchema = z.object({
  client: z.string().min(1, 'Mijozni tanlang'),
  bonus_type: z.string().min(1, 'Bonus turini tanlang'),
  type: z.string().min(1, 'Turni tanlang'),
})

type AddClientBonusValues = z.infer<typeof addClientBonusSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AddClientBonusDialog({ open, setOpen }: Props) {
  const branch = useGetBranch()
  const [addClientBonus, { isLoading: isAdding }] = useAddClientBonusMutation()
  const [clientSearch, setClientSearch] = useState('')

  const branchId = typeof branch === 'object' ? branch._id : branch

  const { data: bonusTypesResponse, isLoading: loadingBonusTypes } =
    useGetBonusTypesQuery({
      branch_id: branchId,
      limit: 100,
    })

  const { data: clientsResponse, isLoading: loadingClients } =
    useGetClientsQuery({
      branch_id: branchId,
      limit: 100,
    })

  const bonusTypes = bonusTypesResponse?.data || []
  const clients = clientsResponse?.data || []

  // Mijozlarni qidirish
  const filteredClients = clients.filter(
    (client) =>
      client.username.toLowerCase().includes(clientSearch.toLowerCase()) ||
      (client.phone && client.phone.includes(clientSearch))
  )

  const form = useForm<AddClientBonusValues>({
    resolver: zodResolver(addClientBonusSchema),
    defaultValues: {
      client: '',
      bonus_type: '',
      type: '',
    },
  })

  const onSubmit = async (data: AddClientBonusValues) => {
    try {
      await addClientBonus({
        client: data.client,
        bonus_type: data.bonus_type,
        type: data.type as any,
      }).unwrap()

      toast.success('Bonus muvaffaqiyatli berildi')
      setOpen(false)
      form.reset()
    } catch {
      toast.error('Bonus berishda xatolik yuz berdi')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mijozga bonus berish</DialogTitle>
          <p className="text-sm text-[#71717A]">
            Mijozni tanlang va bonus bering
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Mijoz</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingClients}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            loadingClients
                              ? 'Yuklanmoqda...'
                              : 'Mijozni tanlang'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 pb-2 sticky top-0 bg-white z-10">
                          <Input
                            placeholder="Mijoz qidirish..."
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        {filteredClients.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            {clientSearch ? 'Mijoz topilmadi' : "Mijozlar yo'q"}
                          </div>
                        ) : (
                          filteredClients.map((client) => (
                            <SelectItem key={client._id} value={client._id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {client.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {client.phone || "Telefon yo'q"}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bonus_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Bonus turi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingBonusTypes}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            loadingBonusTypes
                              ? 'Yuklanmoqda...'
                              : 'Bonus turini tanlang'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {bonusTypes.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            Bonus turlari yo'q
                          </div>
                        ) : (
                          bonusTypes.map((bonusType) => (
                            <SelectItem
                              key={bonusType._id}
                              value={bonusType._id}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">
                                  {bonusType.bonus_name}
                                </span>
                                <span className="text-xs text-emerald-600">
                                  {bonusType.target_amount.toLocaleString(
                                    'uz-UZ'
                                  )}{' '}
                                  so'mga{' '}
                                  {bonusType.discount_amount.toLocaleString(
                                    'uz-UZ'
                                  )}{' '}
                                  so'm chegirma
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Xizmat turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Turni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SERVICE">Servis</SelectItem>
                        {/* <SelectItem value="SALE">Sotuv</SelectItem>
                        <SelectItem value="RENT">Ijara</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                isAdding || bonusTypes.length === 0 || clients.length === 0
              }
            >
              {isAdding ? 'Berilmoqda...' : 'Berish'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
