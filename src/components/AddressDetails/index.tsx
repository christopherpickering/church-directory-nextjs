import { RichText } from '@/components/RichText'
import type { Location } from '@/types/address-types'
import { Globe, Mail, MapPin, Phone, User } from 'lucide-react'
import Link from 'next/link'
import AddressPageClient from './index.client'

interface AddressDetailsProps {
  addressDetails: any
  isLocation: boolean
  address: any
}

export const AddressDetails = ({
  addressDetails,
  isLocation,
  address,
}: AddressDetailsProps) => {
  return (
    <>
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="font-bold text-2xl sm:text-3xl">
              {addressDetails.name}
            </h1>

            <div className="space-y-4 rounded-lg border p-4 sm:p-6">
              <div className="flex items-start">
                <MapPin className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="whitespace-pre-line text-muted-foreground text-sm sm:text-base">
                    {addressDetails.fullAddress}
                  </p>
                </div>
              </div>

              {addressDetails.phone && (
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
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
                      className="text-primary text-sm hover:underline sm:text-base"
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
                      className="break-words text-primary text-sm hover:underline sm:text-base"
                    >
                      {addressDetails.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Additional info based on type */}
            {isLocation && (address as Location).notes && (
              <div className="rounded-lg border p-4 sm:p-6">
                <h3 className="mb-3 font-semibold">Notes</h3>
                {address.notes && <RichText data={address.notes} />}
              </div>
            )}

            {isLocation && (address as Location).schedule && (
              <div className="rounded-lg border p-4 sm:p-6">
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
                    <div className="rounded-lg border p-4 sm:p-6">
                      <h3 className="mb-3 font-semibold">Contact Persons</h3>
                      <div className="space-y-4">
                        {relatedContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="rounded-md border p-3 sm:p-4"
                          >
                            <div className="flex items-start">
                              <User className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-primary" />
                              <div className="w-full space-y-2">
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
                                        className="break-words text-primary hover:underline"
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

          <div className="mt-6 h-[300px] overflow-hidden rounded-lg border sm:h-[350px] md:mt-0 md:max-h-[400px]">
            <AddressPageClient addresses={address} />
          </div>
        </div>
      </div>
    </>
  )
}
