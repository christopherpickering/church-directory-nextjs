import DashboardLayout from '@/components/DashboardLayout'
import ListView from '@/components/ListView'
import { getAddresses } from '@/utilities/getAddresses'

interface AddressesPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AddressesPage({
  searchParams,
}: AddressesPageProps) {
  const addresses = await getAddresses()

  // Safely access search params
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : undefined
  const page =
    typeof searchParams.page === 'string' ? searchParams.page : undefined

  const searchQuery = search?.toLowerCase()
  const currentPage = Number(page) || 1
  const itemsPerPage = 10

  // Filter addresses based on search query
  const filteredAddresses = searchQuery
    ? addresses.filter(
        (address) =>
          address.country?.toLowerCase().includes(searchQuery) ||
          address.city?.toLowerCase().includes(searchQuery) ||
          address.state?.toLowerCase().includes(searchQuery) ||
          address.addressLine1?.toLowerCase().includes(searchQuery) ||
          address.addressLine2?.toLowerCase().includes(searchQuery),
      )
    : addresses

  // Calculate pagination
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAddresses = filteredAddresses.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6 px-4">
          <ListView
            addresses={paginatedAddresses}
            totalPages={totalPages}
            currentPage={currentPage}
            searchQuery={searchQuery || ''}
          />
        </div>
      </DashboardLayout>
    </div>
  )
}
