import { AddressDetails } from '@/components/AddressDetails'
import DashboardLayout from '@/components/DashboardLayout'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { ArrowLeft } from 'lucide-react'

interface Address {
  addressLine1: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phone?: string
  latitude?: number
  longitude?: number
  geocodingStatus?: string
  lastGeocodedAt?: string
}

interface Location {
  id: number
  name: string
  address: Address
  email?: string
  phoneNumber?: string
  website?: string
  notes?: any
  schedule?: any
  relatedContacts?: Contact[]
}

interface Contact {
  id: number
  firstName: string
  lastName: string
  fullName: string
  address: Address
  email?: string
  phoneNumber?: string
  notes?: any
  location?: any
}

export async function generateMetadata({
  params,
}: { params: Promise<any> }): Promise<Metadata> {
  const param = await params

  const { slug, id } = param

  let address: any

  if (param) {
    address = await getAddressById(slug, id)
  }

  if (!address) {
    return {
      title: 'Address Not Found',
      description: 'The requested address could not be found.',
    }
  }

  const displayName =
    slug === 'locations'
      ? (address as Location).name
      : `${(address as Contact).fullName}`

  const addressDetails = address.address
  const addressString = [
    addressDetails?.addressLine1,
    addressDetails?.city,
    addressDetails?.state,
  ]
    .filter(Boolean)
    .join(', ')

  return {
    title: `${slug === 'locations' ? 'location' : 'contact'}: ${displayName}`,
    description: `${displayName} located at ${addressString}.`,
  }
}

export async function getAddressById(slug: string, id: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    if (slug !== 'locations' && slug !== 'contacts') {
      return null
    }

    const result = await payload.findByID({
      collection: slug,
      overrideAccess: true,
      id,
    })

    const location = result as Location
    if (slug === 'locations') {
      const relatedContacts = await payload.find({
        collection: 'contacts',
        where: {
          location: {
            equals: result.id,
          },
        },
        limit: 100,
      })
      location.relatedContacts = relatedContacts.docs as Contact[]
      return location
    }

    return result
  } catch (error) {
    console.error(`Error fetching ${slug} with ID ${id}:`, error)
    return null
  }
}

export default async function AddressDetailPage({
  params,
}: { params: Promise<any> }) {
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
    <div className="pt-16 pb-24">
      <DashboardLayout title={addressDetails.name}>
        <div className="mx-auto max-w-7xl space-y-8 px-4">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to addresses
            </Link>
          </div>
          <AddressDetails
            isLocation={isLocation}
            address={address}
            addressDetails={addressDetails}
          />
        </div>
      </DashboardLayout>
    </div>
  )
}
