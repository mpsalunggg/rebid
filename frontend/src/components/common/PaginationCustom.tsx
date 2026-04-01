import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationCustomProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function PaginationCustom({
  totalPages = 10,
  currentPage = 1,
  onPageChange = () => {},
}: PaginationCustomProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {(() => {
          const pageNumbers = [];
          const showPages = 2; // # of adjacent pages to show near current page

          // Always show the first and last
          // Show two pages before and after current page
          // Add ellipsis as necessary

          for (let i = 1; i <= totalPages; i++) {
            if (
              i === 1 || // Always show first
              i === totalPages || // Always show last
              (i >= currentPage - showPages && i <= currentPage + showPages)
            ) {
              pageNumbers.push(i);
            }
          }

          let lastDisplayed = 0;
          return pageNumbers.map((page, idx) => {
            const showEllipsis = page - lastDisplayed > 1;
            const content = [];
            if (showEllipsis && lastDisplayed !== 0) {
              content.push(
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            content.push(
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
            lastDisplayed = page;
            return content;
          }).flat();
        })()}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
