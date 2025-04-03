import DashboardLayout from '@/components/DashboardLayout'
import { RichText } from '@/components/RichText'
import configPromise from '@payload-config'
import { ArrowLeft, Globe, Mail, MapPin, Phone, User } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import AddressPageClient from './page.client'

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

async function getAddressById(slug: string, id: string) {
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="font-bold text-3xl">{addressDetails.name}</h1>

              <div className="space-y-4 rounded-lg border p-6">
                <div className="flex items-start">
                  <MapPin className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {addressDetails.fullAddress}
                    </p>
                  </div>
                </div>

                {addressDetails.phone && (
                  <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">
                        {addressDetails.phone}
                      </p>
                    </div>
                  </div>
                )}

                {addressDetails.email && (
                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a
                        href={`mailto:${addressDetails.email}`}
                        className="text-primary hover:underline"
                      >
                        {addressDetails.email}
                      </a>
                    </div>
                  </div>
                )}

                {addressDetails.website && (
                  <div className="flex items-center">
                    <Globe className="mr-3 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Website</h3>
                      <a
                        href={addressDetails.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {addressDetails.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional info based on type */}
              {isLocation && (address as Location).notes && (
                <div className="rounded-lg border p-6">
                  <h3 className="mb-3 font-semibold">Notes</h3>
                  {address.notes && <RichText data={address.notes} />}
                </div>
              )}

              {isLocation && (address as Location).schedule && (
                <div className="rounded-lg border p-6">
                  <h3 className="mb-3 font-semibold">Schedule</h3>
                  {(address as Location).schedule && (
                    <RichText data={(address as Location).schedule} />
                  )}
                </div>
              )}

              {/* Contact Persons section moved to the first column */}
              {isLocation &&
                (() => {
                  const relatedContacts = (address as Location).relatedContacts
                  if (relatedContacts && relatedContacts.length > 0) {
                    return (
                      <div className="rounded-lg border p-6">
                        <h3 className="mb-3 font-semibold">Contact Persons</h3>
                        <div className="space-y-4">
                          {relatedContacts.map((contact) => (
                            <div
                              key={contact.id}
                              className="rounded-md border p-4"
                            >
                              <div className="flex items-start">
                                <User className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-primary" />
                                <div className="space-y-2">
                                  <div>
                                    <h4 className="font-medium">
                                      <Link
                                        href={`/addresses/contacts/${contact.id}`}
                                        className="text-primary hover:underline"
                                      >
                                        {contact.fullName}
                                      </Link>
                                    </h4>
                                    {contact.phoneNumber && (
                                      <p className="text-muted-foreground text-sm">
                                        <span className="font-medium">
                                          Phone:
                                        </span>{' '}
                                        {contact.phoneNumber}
                                      </p>
                                    )}
                                    {contact.email && (
                                      <p className="text-muted-foreground text-sm">
                                        <span className="font-medium">
                                          Email:
                                        </span>{' '}
                                        <a
                                          href={`mailto:${contact.email}`}
                                          className="text-primary hover:underline"
                                        >
                                          {contact.email}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                  {contact.notes && (
                                    <div className="pt-2">
                                      <p className="font-medium text-sm">
                                        Notes:
                                      </p>
                                      <div className="prose-sm max-w-none text-muted-foreground">
                                        <RichText data={contact.notes} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}
            </div>

            <div className="max-h-[400px] overflow-hidden rounded-lg border">
              <AddressPageClient addresses={address} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
