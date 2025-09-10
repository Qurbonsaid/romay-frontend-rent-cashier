import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { AddBranchModal } from './addBranch'
import { Skeleton } from '../ui/skeleton'

interface NotFoundBranchesProps {
  isLoading?: boolean
}

export const NotFoundBranches = ({ isLoading }: NotFoundBranchesProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-300px)] flex-col items-center justify-center gap-4">
      <img src="/branches.svg" alt="" className="w-32 h-32" />
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-[20px] font-semibold text-slate-800">
          Filiallar yo'q
        </h2>
        <p className="text-sm text-slate-500">
          Hozircha hech qanday filial qo'shilmagan
        </p>
      </div>
      <div className="mt-4">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Filial qo'shish
        </Button>
      </div>
      <AddBranchModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}
