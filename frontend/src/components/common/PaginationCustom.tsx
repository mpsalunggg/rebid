import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'

interface PaginationCustomProps {
  totalPages?: number
  currentPage?: number
  onPageChange: (page: number) => void
}

export default function PaginationCustom({
  totalPages = 10,
  currentPage = 1,
  onPageChange,
}: PaginationCustomProps) {
  return (
    <section className="bg-card p-2 max-w-fit rounded-lg border shadow-none">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                'bg-secondary text-secondary-foreground',
                currentPage === 1 && 'opacity-50 cursor-not-allowed',
              )}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1 <= 0 ? 1 : currentPage - 1)
              }}
            />
          </PaginationItem>
          {(() => {
            const pageNumbers = []
            const showPages = 1

            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - showPages && i <= currentPage + showPages)
              ) {
                pageNumbers.push(i)
              }
            }

            let lastDisplayed = 0
            return pageNumbers
              .map((page) => {
                const showEllipsis = page - lastDisplayed > 1
                const content = []
                if (showEllipsis && lastDisplayed !== 0) {
                  content.push(
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>,
                  )
                }

                const isActive = page === currentPage
                content.push(
                  <PaginationItem key={page}>
                    <PaginationLink
                      className={cn({
                        [buttonVariants({
                          variant: 'default',
                          className:
                            'shadow-none! hover:text-primary-foreground! dark:bg-primary dark:hover:bg-primary/90',
                        })]: isActive,
                        'bg-secondary text-secondary-foreground': !isActive,
                      })}
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>,
                )
                lastDisplayed = page
                return content
              })
              .flat()
          })()}
          <PaginationItem>
            <PaginationNext
              className={cn(
                'bg-secondary text-secondary-foreground',
                currentPage === totalPages && 'opacity-50 cursor-not-allowed',
              )}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(
                  currentPage + 1 >= totalPages ? totalPages : currentPage + 1,
                )
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  )
}
