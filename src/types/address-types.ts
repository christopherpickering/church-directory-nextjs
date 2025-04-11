export interface Address {
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

export interface Location {
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

export interface Contact {
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
