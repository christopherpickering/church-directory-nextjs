'use client'

import { AddressMap } from '@/components/AddressMap'

export default function AddressPageClient({ addresses }: { addresses: any }) {
  return (
    <div className="rounded-md border">
      <AddressMap objects={addresses} />
    </div>
  )
}
