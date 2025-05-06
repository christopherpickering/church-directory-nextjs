'use client'

import type { AddressData } from '@/components/Maps/type'
import { Pagination } from '@/components/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface ClientListViewProps {
  addresses: AddressData[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function ClientListView({
  addresses,
  totalPages,
  currentPage,
  onPageChange,
}: ClientListViewProps) {
  const router = useRouter()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className="space-y-4">
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
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          className="mt-4"
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
