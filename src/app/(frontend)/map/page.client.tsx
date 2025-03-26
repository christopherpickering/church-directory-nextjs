'use client'

import { useState } from 'react'

import type { AddressData } from '@/components/Maps/type'
import { Skeleton } from '@/components/ui/skeleton'
import { Filter } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import React from 'react'

export default function MapPageClient({
  addresses,
}: { addresses: AddressData[] }) {
  const filterLocation = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const [mapVisible, setMapVisible] = useState(false)
  const MultiMap = React.useMemo(
    () =>
      dynamic(() => import('@/components/Maps/MultiMap'), {
        ssr: false,
      }),
    [pathname],
  )

  const get_points = (addresses: AddressData[]) => {
    return addresses
      .filter((address: AddressData) => {
        if (address.latitude && address.longitude) {
          return true
        }
      })
      .map((address) => {
        return {
          type: 'addresses',
          id: address.id,
          slug: address.type,
          name: address.city || '',
          lat: address.latitude || 0,
          long: address.longitude || 0,
        }
      })
  }

  const points = get_points(addresses)

  const locationFilter = async () => {
    const el = filterLocation.current

    if (el?.classList.contains('is-success')) {
      el.classList.remove('is-success')
      for (const el of document.querySelectorAll(
        'div.assemblies > [data-location].is-hidden',
      ) || []) {
        el.classList.remove('is-hidden')
      }
    } else if (el) {
      el.classList.add('is-success')
      for (const el of document.querySelectorAll(
        'div.assemblies > [data-location="true"]',
      ) || []) {
        el.classList.add('is-hidden')
      }
    }
  }

  return (
    <div className="rounded-md border">
      <div className="mb-5 h-[400px] rounded">
        {!mapVisible && <Skeleton className="h-full max-h-[400px] w-full" />}
        <MultiMap
          className="z-0"
          points={points}
          whenReady={() => setMapVisible(true)}
        />
      </div>
      <div>
        <button
          type={'button'}
          ref={filterLocation}
          className="mt-1 mr-3"
          onClick={locationFilter}
        >
          <Filter />
        </button>
      </div>
      <div className="bg-muted/50 p-2 text-center text-muted-foreground text-sm">
        The map is loaded from www.openstreetmap.org
      </div>
    </div>
  )
}
