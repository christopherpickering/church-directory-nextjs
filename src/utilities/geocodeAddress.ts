interface AddressData {
  country?: string | null
  addressLine1: string
  addressLine2?: string | null
  postalCode?: string | null
  city?: string | null
  state?: string | null
}

interface GeocodedResult {
  latitude: number
  longitude: number
  geocodingStatus: 'not_geocoded' | 'geocoding' | 'geocoded' | 'failed'
  lastGeocodedAt: string
}

export async function geocodeAddress(
  address: AddressData,
): Promise<GeocodedResult> {
  // Only run geocoding on the server side
  if (typeof window !== 'undefined') {
    return {
      latitude: 0,
      longitude: 0,
      geocodingStatus: 'not_geocoded',
      lastGeocodedAt: new Date().toISOString(),
    }
  }

  try {
    // Build the address string
    const addressString = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(', ')

    // Encode the address for URL
    const encodedAddress = encodeURIComponent(addressString)

    // Make request to LocationIQ API
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?q=${encodedAddress}&format=json&key=${process.env.LOCATIONIQ_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data?.[0]) {
      return {
        latitude: data[0].lat || 0,
        longitude: data[0].lon || 0,
        geocodingStatus: 'geocoded',
        lastGeocodedAt: new Date().toISOString(),
      }
    }

    return {
      latitude: 0,
      longitude: 0,
      geocodingStatus: 'failed',
      lastGeocodedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return {
      latitude: 0,
      longitude: 0,
      geocodingStatus: 'failed',
      lastGeocodedAt: new Date().toISOString(),
    }
  }
}
