'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

interface AddressSearchProps {
  className?: string
}

export default function AddressSearch({ className }: AddressSearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/addresses?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by location, zip code, ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/20 focus:outline-hidden focus:ring-2 focus:ring-primary"
        >
          Search
        </button>
      </form>
    </div>
  )
}
