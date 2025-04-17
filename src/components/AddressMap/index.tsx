'use client'

import { Skeleton } from '@/components/ui/skeleton'
import type { Contact, Location } from '@/payload-types'
import { cn } from '@/utilities/utils'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

export const AddressMap = ({
  objects,
  className,
}: {
  objects: Contact | Location
  className?: string | undefined
}) => {
  const _pathname = usePathname()
  const [mapVisible, setMapVisible] = useState(false)

  // Memoize map component to prevent unnecessary rerenders
  const ImportedMap = useMemo(
    () =>
      dynamic(() => import('@/components/Maps/Map'), {
        ssr: false,
      }),
    [], // Remove pathname dependency
  )

  // Memoize address data to prevent rerenders
  const addressData = useMemo(() => {
    return {
      address: objects.address?.addressLine1,
      lat: objects.address?.latitude || 0,
      long: objects.address?.longitude || 0,
    }
  }, [
    objects.address?.addressLine1,
    objects.address?.latitude,
    objects.address?.longitude,
  ])

  return (
    <div
      className={cn(
        'aspect-square max-h-[400px] w-full overflow-hidden rounded-lg border',
        className,
      )}
    >
      {!mapVisible && <Skeleton className="h-full max-h-[400px] w-full" />}
      <ImportedMap
        className={'h-full max-h-[400px] w-full'}
        address={addressData.address}
        lat={addressData.lat}
        long={addressData.long}
        whenReady={() => setMapVisible(true)}
      />
    </div>
  )
}
