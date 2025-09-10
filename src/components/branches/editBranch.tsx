import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { useHandleRequest } from '@/hooks/use-handle-request'
import { useUpdateBranchMutation } from '@/store/branch/branch.api'
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
import type { Branch } from './branches'
import { useGetEmployeesQuery } from '@/store/employee/employee'

interface EditBranchProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  branch: Branch | null
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

export const EditBranchModal = ({
  isOpen,
  onOpenChange,
  branch,
  onSuccess,
}: EditBranchProps) => {
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation()

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: branch?.name || '',
      address: branch?.address || '',
      manager_ids: branch?.manager_ids?.map((manager) => manager._id) || [],
    },
  })

  const handleRequest = useHandleRequest()

  const { data: { data: employees = [] } = {} } = useGetEmployeesQuery({})

  const onSubmit = async (data: BranchFormValues) => {
    if (!branch) return

    handleRequest({
      request: () => {
        const result = updateBranch({
          id: branch._id,
          body: {
            name: data.name,
            address: data.address,
            manager_ids: data.manager_ids || [],
          },
        })
        return result
      },
      onSuccess: () => {
        toast.success('Filial muvaffaqiyatli yangilandi')
        onOpenChange(false)
        onSuccess?.()
      },
    })
  }

  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name,
        address: branch.address || '',
        manager_ids: branch.manager_ids?.map((manager) => manager._id) || [],
      })
    }
  }, [branch, form])

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen, form])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Filialni tahrirlash"
      description="Filial ma'lumotlarini tahrirlang"
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
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
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
