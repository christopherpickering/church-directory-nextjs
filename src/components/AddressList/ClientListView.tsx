'use client'

import type { AddressData } from '@/components/Maps/type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

interface ClientListViewProps {
  addresses: AddressData[]
  totalPages: number
  currentPage: number
  searchQuery: string
  onSearch: (query: string) => void
  onPageChange: (page: number) => void
}

export default function ClientListView({
  addresses,
  totalPages,
  currentPage,
  searchQuery,
  onSearch,
  onPageChange,
}: ClientListViewProps) {
  const [searchInput, setSearchInput] = useState(searchQuery)
  const router = useRouter()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    onSearch(searchInput)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <Input
          className="w-full"
          placeholder="Search by location, zip code, ..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
      </form>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] font-bold font-medium text-primary-dark">
                POSTAL CODE
              </TableHead>
              <TableHead className="font-bold font-medium text-primary-dark">
                CITY
              </TableHead>
              <TableHead className="font-bold font-medium text-primary-dark">
                STATE
              </TableHead>
              <TableHead className="hidden font-bold font-medium text-primary-dark md:table-cell">
                COUNTRY
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No addresses found
                </TableCell>
              </TableRow>
            ) : (
              addresses.map((address) => (
                <TableRow
                  key={address.id}
                  className="hover:cursor-pointer hover:bg-gray-300 hover:shadow-md"
                  onClick={() =>
                    router.push(`/addresses/${address.type}/${address.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {address.postalCode}
                  </TableCell>
                  <TableCell className="font-medium">
                    {address.city && (
                      <span className="block">{address.city}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{address.state}</TableCell>
                  <TableCell className="hidden font-medium md:table-cell">
                    {address.country}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="hover:cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>

            {/* First page */}
            {currentPage > 3 && (
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(1)}
                  className="hover:cursor-pointer"
                >
                  1
                </Button>
              </PaginationItem>
            )}

            {/* Ellipsis if needed */}
            {currentPage > 4 && (
              <PaginationItem>
                <PaginationEllipsis className="hover:cursor-pointer" />
              </PaginationItem>
            )}

            {/* Page numbers near current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1),
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className="hover:cursor-pointer"
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}

            {/* Ellipsis if needed */}
            {currentPage < totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis className="hover:cursor-pointer" />
              </PaginationItem>
            )}

            {/* Last page if not showing in the loop above */}
            {currentPage < totalPages - 2 && totalPages > 4 && (
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(totalPages)}
                  className="hover:cursor-pointer"
                >
                  {totalPages}
                </Button>
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="hover:cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
