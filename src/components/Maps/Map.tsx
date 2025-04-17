'use client'

import { cn } from '@/utilities/utils'
import Fullscreen from './FullScreen'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'
import type L from 'leaflet'
import { LocationIQProvider } from 'leaflet-geosearch'
import { usePathname } from 'next/navigation'
import { type HTMLAttributes, useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

type MapProps = HTMLAttributes<HTMLElement> & {
  className?: string | null
  address: string | null
  lat?: number
  long?: number
  whenReady: () => void
}

const ExportMap = ({
  address = null,
  lat = 50,
  long = -0.9,
  className,
  whenReady,
}: MapProps) => {
  const map = useRef<L.Map>(null)
  const marker = useRef<L.Marker>(null)
  const _pathname = usePathname()

  // Store initial coordinates to prevent unnecessary rerenders
  const initialCoords = useRef({ lat, long })

  useEffect(() => {
    if (
      address &&
      !initialCoords.current.lat &&
      !initialCoords.current.long &&
      process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
    ) {
      const provider = new LocationIQProvider({
        params: {
          key: process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN,
        },
      })
      provider.search({ query: address }).then((res: any) => {
        if (res[0] && map.current) {
          map.current.setView([res[0].y, res[0].x]) //res[0].bounds[0])
          if (marker.current) {
            marker.current.setLatLng([res[0].y, res[0].x])
          }
        }
      })
    }
  }, [address]) // Remove pathname and use only address as dependency

  return (
    <MapContainer
      key={`map-${initialCoords.current.lat}-${initialCoords.current.long}`}
      className={cn('z-0', className)}
      center={[initialCoords.current.lat, initialCoords.current.long]}
      ref={map}
      zoom={9}
      scrollWheelZoom={true}
      whenReady={whenReady}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/christopherpickering/cl8ywzj0i00dc15mvjr9pfvcu/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
      />
      <Fullscreen />
      <Marker
        position={[initialCoords.current.lat, initialCoords.current.long]}
        ref={marker}
      >
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  )
}

export default ExportMap
