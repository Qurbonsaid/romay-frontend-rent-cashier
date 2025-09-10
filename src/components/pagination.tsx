import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export function PaginationComponent() {
  return (
    <Pagination className="w-full">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" size="default" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="default">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="default" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="default">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" size="default" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
