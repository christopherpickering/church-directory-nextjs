import type { AddressData } from '@/components/Maps/type'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { geocodeAddress } from './geocodeAddress'

import type { Contact, Location } from '@/payload-types'

const buildAddress = (
  object: Location | Contact,
  slug: string,
  fullName: string | null = null,
  countries: Record<string, string> = {},
): AddressData => {
  const countryId = object.address.country?.toString() || ''
  const countryName = countries[countryId] || countryId

  return {
    id: object.id,
    city: object.address.city,
    addressLine1: object.address.addressLine1,
    addressLine2: object.address.addressLine2,
    state: object.address.state,
    postalCode: object.address.postalCode,
    country: countryName,
    phone: object.phoneNumber || '',
    latitude: object.address.latitude || 0,
    longitude: object.address.longitude || 0,
    hideFromMap: object.address.hideFromMap === true,
    type: slug as 'locations' | 'contacts',
    contact: fullName ? { fullName } : null,
  }
}

export async function getAddresses() {
  const payload = await getPayload({ config: configPromise })
  const addresses: AddressData[] = []

  const countriesResult = await payload.find({
    collection: 'countries',
    limit: 300,
  })

  const countriesMap: Record<string, string> = {}
  for (const country of countriesResult.docs) {
    countriesMap[country.countryId] = country.name
  }

  const locations = await payload.find({
    collection: 'locations',
    overrideAccess: true,
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
      addresses.push(
        buildAddress(updatedLocation, 'locations', null, countriesMap),
      )
    } else {
      addresses.push(buildAddress(location, 'locations', null, countriesMap))
    }
  }

  const contacts = await payload.find({
    collection: 'contacts',
    limit: 1000,
    where: {
      location: {
        exists: false,
      },
    },
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
      addresses.push(
        buildAddress(
          updatedContact,
          'contacts',
          contact.fullName,
          countriesMap,
        ),
      )
    } else {
      addresses.push(
        buildAddress(contact, 'contacts', contact.fullName, countriesMap),
      )
    }
  }
  return addresses
}

// Get only addresses that should be shown on the map
export async function getMapAddresses() {
  const allAddresses = await getAddresses()
  return allAddresses.filter((address) => !address.hideFromMap)
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

export default function build_address(object: any) {
  const comma = (stuff: any) => {
    if (stuff) {
      return ', '
    }
    return ''
  }

  // <house>, <street>, <neighborhood>, <city>, <state>, <zip>, <country>

  const country = object.address?.country || ''

  // some states remove country.
  // if (object.state && object.state.toLowerCase() == 'puerto rico') {
  //   country = '';
  // }

  let address = object.address?.addressLine1
    ? `${object.address?.addressLine1}`
    : ''

  if (object.address?.addressLine2) {
    address += address
      ? `${comma(address)}${object.address?.addressLine2}`
      : object.address?.addressLine2
  }

  if (object.address?.city) {
    address += address
      ? `${comma(address)}${object.address?.city}`
      : object.address?.city
  }

  if (object.address?.state) {
    address += address
      ? `${comma(address)}${object.address?.state}`
      : object.address?.state
  }

  if (object.address?.postalCode) {
    address += address
      ? `${comma(address)}${object.address?.postalCode.split('-')[0]}`
      : object.address?.postalCode
  }

  if (country) {
    address += address
      ? `${comma(address)}${country.replace('United States of America (USA)', 'USA')}`
      : country
  }

  return address
}
