import type { AddressData } from '@/components/Maps/type'
import type { Contact, Location } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { geocodeAddress } from './geocodeAddress'

const buildAddress = (object: Location | Contact) => {
  return {
    id: object.id,
    city: object.address.city,
    addressLine1: object.address.addressLine1,
    addressLine2: object.address.addressLine2,
    state: object.address.state,
    postalCode: object.address.postalCode,
    country: object.address.country,
    phone: object.phoneNumber || '',
    latitude: object.address.latitude || 0,
    longitude: object.address.longitude || 0,
    type:
      object instanceof Location
        ? 'locations'
        : ('contacts' as 'locations' | 'contacts'),
  }
}
export async function getAddresses() {
  const payload = await getPayload({ config: configPromise })
  const addresses: AddressData[] = []

  const locations = await payload.find({
    collection: 'locations',
    limit: 1000,
  })

  for (const location of locations.docs) {
    if (location.address.geocodingStatus !== 'geocoded') {
      const geocodedResult = await geocodeAddress(location.address)
      const updatedLocation = await payload.update({
        collection: 'locations',
        id: location.id,
        data: {
          address: {
            ...location.address,
            ...geocodedResult,
          },
        },
      })
      addresses.push(buildAddress(updatedLocation))
    } else {
      addresses.push(buildAddress(location))
    }
  }

  const contacts = await payload.find({
    collection: 'contacts',
    limit: 1000,
  })

  for (const contact of contacts.docs) {
    if (contact.address.geocodingStatus !== 'geocoded') {
      const geocodedResult = await geocodeAddress(contact.address)

      const updatedContact = await payload.update({
        collection: 'contacts',
        id: contact.id,
        data: {
          address: {
            ...contact.address,
            ...geocodedResult,
          },
        },
      })
      addresses.push(buildAddress(updatedContact))
    } else {
      addresses.push(buildAddress(contact))
    }
  }
  return addresses
}

// export async function getAddressById(id: string) {
//   const payload = await getPayload({ config: configPromise })
//   const locations = await payload.find({
//     collection: 'locations',
//     limit: 1000,
//   })

//   const contacts = await payload.find({
//     collection: 'contacts',
//     limit: 1000,
//   })

//   const addresses = [
//     ...locations.docs.map((location) => location.address),
//     ...contacts.docs.map((contact) => contact.address),
//   ]

//   return addresses.find((address: AddressData) => address.id === id)
// }
