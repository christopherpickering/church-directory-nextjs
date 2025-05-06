'use client'

import type { AddressData } from '@/components/Maps/type'
import { useState } from 'react'
import ClientListView from './ClientListView'

interface AddressListProps {
  addresses: AddressData[]
  initialPage?: number
}

export default function AddressList({
  addresses,
  initialPage = 1,
}: AddressListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const itemsPerPage = 10

  const totalPages = Math.ceil(addresses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAddresses = addresses.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  return (
    <div className="mx-auto space-y-6">
      <ClientListView
        addresses={paginatedAddresses}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
