import AuthenticatedLayout from '@/components/AuthLayout'
import ListView from '@/components/ListView'
import { getAddresses } from '@/utilities/getAddresses'

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.search?.toLowerCase()
  const addresses = await getAddresses()

  const currentPage = Number(resolvedSearchParams.page) || 1
  const itemsPerPage = 10

  const filteredAddresses = searchQuery
    ? addresses.filter(
        (address) =>
          address.addressLine1?.toLowerCase().includes(searchQuery) ||
          address.city?.toLowerCase().includes(searchQuery) ||
          address.state?.toLowerCase().includes(searchQuery) ||
          address.postalCode?.toLowerCase().includes(searchQuery),
      )
    : addresses

  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAddresses = filteredAddresses.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout>
        <div className="mx-auto space-y-6">
          <ListView
            addresses={paginatedAddresses}
            totalPages={totalPages}
            currentPage={currentPage}
            searchQuery={searchQuery || ''}
          />
        </div>
      </AuthenticatedLayout>
    </div>
  )
}
