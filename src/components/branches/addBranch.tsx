import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { useHandleRequest } from '@/hooks/use-handle-request'
import { useAddBranchMutation } from '@/store/branch/branch.api'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import Modal from '../modal/Modal'
import { useEffect } from 'react'
import { useGetEmployeesQuery } from '@/store/employee/employee'

interface AddBranchProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const branchSchema = z.object({
  name: z.string().min(1, 'Filial nomi kiritilishi shart'),
  address: z.string().min(1, 'Manzil kiritilishi shart'),
  manager_ids: z
    .array(z.string())
    .nonempty('Menejer tanlanishi shart')
    .optional(),
})

type BranchFormValues = z.infer<typeof branchSchema>

export const AddBranchModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: AddBranchProps) => {
  const [addBranch, { isLoading: isAdding }] = useAddBranchMutation()
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      address: '',
      manager_ids: undefined,
    },
  })

  const { data: { data: employees = [] } = {} } = useGetEmployeesQuery({})

  const handleRequest = useHandleRequest()

  const onSubmit = async (data: BranchFormValues) => {
    handleRequest({
      request: () => {
        const result = addBranch({
          name: data.name,
          address: data.address,
          manager_ids: data.manager_ids || [],
        })
        return result
      },
      onSuccess: () => {
        toast.success('Filial qo`shildi')
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      },
    })
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Filial qo'shish"
      description="Bu yerda Filial qo'sha olasiz"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Filial Nomi</Label>
            <div className="w-full">
              <Input
                id="name"
                placeholder="Filial nomi"
                {...form.register('name')}
                className={
                  form.formState.errors.name ? 'border-destructive' : ''
                }
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Manzili</Label>
            <div className="w-full">
              <Input
                id="address"
                placeholder="Filial manzili"
                {...form.register('address')}
                className={
                  form.formState.errors.address ? 'border-destructive' : ''
                }
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Menejer</Label>
            <Select
              onValueChange={(value) => form.setValue('manager_ids', [value])}
              value={form.watch('manager_ids')?.[0] || ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filial menejerini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((manager) => (
                  <SelectItem key={manager._id} value={manager._id}>
                    {manager.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.manager_ids && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.manager_ids.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Bekor qilish
          </Button>
          <Button type="submit">
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Saqlash'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
