import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  columns: number
  rows?: number
  hasActions?: boolean
}

export function TableSkeleton({
  columns,
  rows = 5,
  hasActions = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center space-x-4 p-4 border rounded-md"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
            {hasActions && (
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
