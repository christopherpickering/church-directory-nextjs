'use client'

import { cn } from '@/utilities/utils'
import Fullscreen from './FullScreen'
import MarkerClusterGroup from './cluster'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { type HTMLAttributes, useEffect, useRef, useState } from 'react'
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

type MapProps = HTMLAttributes<HTMLElement> & {
  code?: string | null
  points: {
    type: string
    slug: string
    id: number
    name: string | null
    lat: number | null
    long: number | null
  }[]
  lat?: number
  long?: number
  whenReady: () => void
}

const MultiMap = ({
  code = null,
  points,
  lat = 20,
  long = -20,
  className,
  whenReady,
}: MapProps) => {
  const clusterFunc = (zoom: number) => {
    return zoom <= 1 ? 80 : 1 // radius in pixels
  }
  const map = useRef(null)
  const [geoJSON, setGeoJSON] = useState(null)

  const fetchGeoJSON = () => {
    if (code) {
      try {
        fetch(
          `https://raw.githubusercontent.com/inmagik/world-countries/master/countries/${code}.geojson`,
        )
          .then((resp) => resp.json())
          .then((data) => {
            setGeoJSON(data)
          })
          .catch((err) => {
            console.error(err)
          })
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    fetchGeoJSON()
  }, [code])

  const style = () => {
    return {
      fillColor: 'transparent',
      weight: 2,
      opacity: 1,
      color: '#003399', //Outline color
      fillOpacity: 1,
    }
  }

  return (
    <MapContainer
      key={points?.length + lat.toString() + long.toString()}
      className={cn('z-0 h-full max-h-[400px] w-full', className)}
      center={[lat, long]}
      ref={map}
      zoom={1.5}
      scrollWheelZoom={true}
      whenReady={whenReady}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/christopherpickering/cl8ywzj0i00dc15mvjr9pfvcu/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
      />
      <Fullscreen />
      <MarkerClusterGroup maxClusterRadius={clusterFunc}>
        {points?.map((point) => {
          const title = `${point.type}: ${point.name}`
          if (!(point.lat && point.long)) return null
          return (
            <Marker
              key={point.id + point.lat + point.long + point.type + point.name}
              position={[point.lat, point.long]}
              title={point.type}
            >
              <Popup>
                <Link href={`/${point.type}/${point.slug}/${point.id}`}>
                  {title}
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </MarkerClusterGroup>
      {geoJSON && <GeoJSON data={geoJSON} style={style} />}
    </MapContainer>
  )
}

export default MultiMap
