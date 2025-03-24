export interface AddressData {
  type: 'locations' | 'contacts'
  id: number
  country?: string | null
  addressLine1: string
  addressLine2?: string | null
  postalCode?: string | null
  city?: string | null
  state?: string | null
  phone: string
  latitude?: number | null
  longitude?: number | null
  geocodingStatus?:
    | ('not_geocoded' | 'geocoding' | 'geocoded' | 'failed')
    | null
  lastGeocodedAt?: string | null
}
