'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Address as AddressType } from '@/payload-types'

export default function ListView({ addresses }: { addresses: AddressType[] }) {
  if (!addresses) {
    return <div>No addresses found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Input
          className="w-full"
          placeholder="Search by location, zip code, ..."
        />
        <Button className="w-full sm:w-auto">Search</Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Postal code</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No addresses found
                </TableCell>
              </TableRow>
            ) : (
              addresses.map((address) => (
                <TableRow key={`${address.postalCode}-${address.city}`}>
                  <TableCell className="font-medium">
                    {address.postalCode}
                  </TableCell>
                  <TableCell>{address.city}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem className="hidden sm:inline-block">
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem className="hidden sm:inline-block">
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem className="hidden sm:inline-block">
            <PaginationLink>3</PaginationLink>
          </PaginationItem>
          <PaginationItem className="hidden sm:inline-block">
            <PaginationLink>4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
