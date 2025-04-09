'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import type React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
}> = (props) => {
  const router = useRouter()

  const { className, page, totalPages, onPageChange } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const handlePageChange = (targetPage: number) => {
    if (onPageChange) {
      onPageChange(targetPage)
    } else {
      router.push(`/posts/page/${targetPage}`)
    }
  }

  const getPageNumbers = () => {
    const pages = []

    if (page > 1) {
      pages.push(1)
    }

    if (page > 3) {
      pages.push(-1)
    }

    if (page > 2) {
      pages.push(page - 1)
    }

    pages.push(page)

    if (page < totalPages - 1) {
      pages.push(page + 1)
    }

    if (page < totalPages - 2) {
      pages.push(-2)
    }

    if (page < totalPages) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                if (hasPrevPage) {
                  handlePageChange(page - 1)
                }
              }}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, _index) => {
            if (pageNumber < 0) {
              return (
                <PaginationItem key={`ellipsis-${pageNumber}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={`page-${pageNumber}`}>
                <PaginationLink
                  isActive={pageNumber === page}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              onClick={() => {
                if (hasNextPage) {
                  handlePageChange(page + 1)
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
