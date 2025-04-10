import { getAddressById } from '@/app/(frontend)/addresses/[slug]/[id]/page'
import { AddressDetails } from '@/components/AddressDetails'
import { AddressSheet } from '@/components/AddressSheet'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<any> }) {
  const param = await params

  const { slug, id } = param
  const address = await getAddressById(slug, id)

  if (!address) {
    notFound()
  }

  const isLocation = slug === 'locations'

  const addressDetails = {
    name: isLocation
      ? (address as Location).name
      : `${(address as Contact).fullName}`,
    fullAddress: [
      address.address.addressLine1,
      address.address.addressLine2,
      `${address.address.city || ''}, ${address.address.state || ''} ${address.address.postalCode || ''}`.trim(),
      address.address.country,
    ]
      .filter(Boolean)
      .join(', '),
    latitude: address.address.latitude || 0,
    longitude: address.address.longitude || 0,
    email: address.email,
    phone: address.phoneNumber || address.address.phone,
    website: isLocation ? (address as Location).website : null,
  }

  return (
    <AddressSheet>
      <AddressDetails
        isLocation={isLocation}
        address={address}
        addressDetails={addressDetails}
      />
    </AddressSheet>
  )
}
