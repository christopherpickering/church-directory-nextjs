'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    // Only push to search route if we're actively searching and have a value
    if (isSearching && debouncedValue) {
      router.push(`/search?q=${debouncedValue}`)
    }
  }, [debouncedValue, router, isSearching])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setIsSearching(true)
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setIsSearching(true)
          }}
          onFocus={() => setIsSearching(true)}
          onBlur={() => {
            if (!value) setIsSearching(false)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
