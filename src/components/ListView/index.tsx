'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
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
import { useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, useState } from 'react'

interface Address {
  id: string
  street?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  phoneNumber?: string | null
}

interface ListViewProps {
  addresses: Address[]
  totalPages: number
  currentPage: number
  searchQuery: string
}

export default function ListView({
  addresses,
  totalPages,
  currentPage,
  searchQuery,
}: ListViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchQuery)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    params.set('search', searchInput)
    params.set('page', '1')
    router.push(`/addresses?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/addresses?${params.toString()}`)
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
              <TableHead className="w-[100px]">Postal code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
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
                <TableRow key={address.id}>
                  <TableCell className="font-medium">
                    {address.zipCode}
                  </TableCell>
                  <TableCell>
                    {address.street}
                    {address.city && (
                      <span className="block text-gray-500">
                        {address.city}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {address.phoneNumber}
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
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page} className="hidden sm:inline-block">
                <Button
                  variant={page === currentPage ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
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
