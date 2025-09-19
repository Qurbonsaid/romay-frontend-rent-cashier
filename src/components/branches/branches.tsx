import { useState } from 'react'
import { Button } from '../ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { TableSkeleton } from '../ui/table-skeleton'
import { EditBranchModal } from './editBranch'

import {
  useDeleteBranchMutation,
  useGetAllBranchesQuery,
} from '@/store/branch/branch.api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { AddBranchModal } from './addBranch'
import { NotFoundBranches } from './notFoundBranches'
import { useHandleRequest } from '@/hooks/use-handle-request'
import { AlertModal } from '../alertModal/alertModal'
import { toast } from 'sonner'
import type { Branch } from '@/types/branch'

export default function Branches() {
  const {
    data: { data: branches = [] } = {},
    isLoading,
    refetch,
  } = useGetAllBranchesQuery({})
  const [isOpen, setIsOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState<string | null>(null)
  const handleRequets = useHandleRequest()
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation()

  const handleDeleteBranch = async () => {
    handleRequets({
      request: async () => {
        const result = await deleteBranch(isDeleteOpen || '')
        return result
      },
      onSuccess: async () => {
        toast.success('Filial o`chirildi')
        setIsDeleteOpen(null)
        setEditingBranch(null)
      },
    })
  }

  if (!branches || branches.length === 0) {
    return <NotFoundBranches isLoading={isLoading} />
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Filiallar</h2>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Filial qo'shish
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} hasActions={true} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nomi</TableHead>
                <TableHead>Manzili</TableHead>
                <TableHead>Menejer</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches?.map((branch, index) => (
                <TableRow key={branch._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>{branch.address || '-'}</TableCell>
                  <TableCell>
                    {branch?.manager_ids
                      ?.map((manager) => manager.username)
                      .join(', ') || 'Mavjud emas'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingBranch(branch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setIsDeleteOpen(branch._id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <AddBranchModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={refetch}
      />
      <EditBranchModal
        isOpen={!!editingBranch}
        onOpenChange={(open) => !open && setEditingBranch(null)}
        branch={editingBranch}
        onSuccess={() => {
          refetch()
          setEditingBranch(null)
        }}
      />
      <AlertModal
        isOpen={!!isDeleteOpen}
        onClose={() => setIsDeleteOpen(null)}
        title="Filialni o'chirish"
        description="Bu filialni o'chirishni ta'minlaysizmi?"
        actionText="O'chirish"
        action={handleDeleteBranch}
        isLoading={isDeleting}
      />
    </div>
  )
}
