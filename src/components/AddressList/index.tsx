'use client'

import type { AddressData } from '@/components/Maps/type'
import { useEffect, useState } from 'react'
import ClientListView from './ClientListView'

interface AddressListProps {
  addresses: AddressData[]
  initialSearchQuery?: string
  initialPage?: number
}

export default function AddressList({
  addresses,
  initialSearchQuery = '',
  initialPage = 1,
}: AddressListProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const itemsPerPage = 10

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredAddresses = searchQuery
    ? addresses.filter(
        (address) =>
          address.addressLine1
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          address.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          address.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          address.postalCode?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : addresses

  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAddresses = filteredAddresses.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  return (
    <div className="mx-auto space-y-6">
      <ClientListView
        addresses={paginatedAddresses}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
