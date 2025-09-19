import { useGetBranchQuery } from '@/store/branch/branch.api'
import { useGetBranch } from '@/hooks/use-get-branch'
import { formatCurrency } from '@/utils/numberFormat'
import { Wallet } from 'lucide-react'

export function ServiceBalance() {
  const currentBranch = useGetBranch()

  const { data: branchData } = useGetBranchQuery(
    { id: currentBranch?._id || '' },
    {
      skip: !currentBranch?._id, // Only make request when branch ID is available
      pollingInterval: 30000, // Poll every 30 seconds to keep balance updated
    }
  )

  if (!branchData?.data) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
      <Wallet className="h-4 w-4 text-green-600" />
      <div className="flex flex-col">
        <span className="text-xs text-green-600 font-medium">
          Mening balansim
        </span>
        <span className="text-sm font-semibold text-green-700">
          {formatCurrency(branchData.data.service_balance)}
        </span>
      </div>
    </div>
  )
}
