import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { geocodeAddress } from './geocodeAddress'

// Define our own address data type
interface AddressData {
  id: string
  street: string
  city?: string | null
  state?: string | null
  zipCode?: string | null
  country?: string | null
  phoneNumber?: string | null
  latitude: number
  longitude: number
}

// Simple function to build address string
function buildAddress(item: any): string {
  if (!item?.address) return ''

  const { addressLine1, addressLine2, city, state, postalCode } = item.address
  const parts = []

  if (addressLine1) parts.push(addressLine1)
  if (addressLine2) parts.push(addressLine2)
  if (city) parts.push(city)
  if (state) parts.push(state)
  if (postalCode) parts.push(postalCode)

  return parts.join(', ')
}

export async function getAddresses() {
  const payload = await getPayload({ config: configPromise })
  const addresses: AddressData[] = []

  const locations = await payload.find({
    collection: 'locations',
    limit: 1000,
  })

  for (const location of locations.docs) {
    const street = buildAddress(location)

    // Geocode the address if it hasn't been geocoded or if it failed
    if (location.address.geocodingStatus !== 'geocoded') {
      const geocodedResult = await geocodeAddress(location.address)

      // Update the location with the geocoded coordinates
      await payload.update({
        collection: 'locations',
        id: location.id,
        data: {
          address: {
            ...location.address,
            ...geocodedResult,
          },
        },
      })
    }

    addresses.push({
      id: location.id.toString(),
      street,
      city: location.address.city,
      state: location.address.state,
      zipCode: location.address.postalCode,
      country: location.address.country,
      phoneNumber: location.phoneNumber,
      latitude: location.address.latitude || 0,
      longitude: location.address.longitude || 0,
    })
  }

  const contacts = await payload.find({
    collection: 'contacts',
    limit: 1000,
  })

  for (const contact of contacts.docs) {
    const street = buildAddress(contact)

    // Geocode the address if it hasn't been geocoded or if it failed
    if (contact.address.geocodingStatus !== 'geocoded') {
      const geocodedResult = await geocodeAddress(contact.address)

      // Update the contact with the geocoded coordinates
      await payload.update({
        collection: 'contacts',
        id: contact.id,
        data: {
          address: {
            ...contact.address,
            ...geocodedResult,
          },
        },
      })
    }

    addresses.push({
      id: contact.id.toString(),
      street,
      city: contact.address.city,
      state: contact.address.state,
      zipCode: contact.address.postalCode,
      country: contact.address.country,
      phoneNumber: contact.phoneNumber,
      latitude: contact.address.latitude || 0,
      longitude: contact.address.longitude || 0,
    })
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
