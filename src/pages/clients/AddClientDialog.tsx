import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  addClientSchema,
  type AddClientValues,
} from '@/components/forms/add-client.schema'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AddClientDialog({ open, setOpen }: Props) {
  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    defaultValues: { branch: '', name: '', phone: '', password: '' },
  })

  const onSubmit = () => {
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Mijoz qo'shish</DialogTitle>
          <p className="text-sm text-[#71717A]">Bu yerda mijoz qo'shasiz</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filiali</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filialni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="termiz">
                          Termiz shox ko'cha
                        </SelectItem>
                        <SelectItem value="shahrisabz">Shahrisabz</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.branch?.message as string}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ismi</FormLabel>
                  <FormControl>
                    <Input placeholder="Ism" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message as string}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raqam</FormLabel>
                  <FormControl>
                    <Input placeholder="+998 __ ___ __ __" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.phone?.message as string}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paroli</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Parol kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message as string}
                  </FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Saqlash
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
