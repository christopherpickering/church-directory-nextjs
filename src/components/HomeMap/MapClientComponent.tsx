'use client'

import type { AddressData } from '@/components/Maps/type'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utilities/utils'
import { Check, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'

export default function MapClientComponent({
  addresses,
}: { addresses: AddressData[] }) {
  const pathname = usePathname()
  const [mapVisible, setMapVisible] = useState(false)
  const [selectedState, setSelectedState] = useState<string>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  const MultiMap = React.useMemo(
    () =>
      dynamic(() => import('@/components/Maps/MultiMap'), {
        ssr: false,
      }),
    [pathname],
  )

  // Get unique states from addresses
  const states = useMemo(() => {
    const stateSet = new Set<string>()
    // Using for...of instead of forEach for better performance
    for (const address of addresses) {
      if (address.state) {
        stateSet.add(address.state)
      }
    }
    return Array.from(stateSet).sort()
  }, [addresses])

  const get_points = (addresses: AddressData[]) => {
    return addresses
      .filter((address: AddressData) => {
        // Filter by state if not "all"
        if (selectedState !== 'all' && address.state !== selectedState) {
          return false
        }

        // Make sure we have coordinates
        if (address.latitude && address.longitude) {
          return true
        }
        return false
      })
      .map((address) => {
        return {
          type: 'addresses',
          id: address.id,
          slug: address.type,
          name: address.city || '',
          state: address.state,
          lat: address.latitude || 0,
          long: address.longitude || 0,
        }
      })
  }

  const points = get_points(addresses)

  // Key based on selected state to force re-render when state changes
  const mapKey = `map-${selectedState}-${points.length}`

  const handleSelectState = (state: string) => {
    setSelectedState(state)
    setDropdownOpen(false)
  }

  return (
    <div className="relative w-full space-y-6">
      {/* Filter panel */}
      <div className="mb-4 w-full rounded-md border bg-card p-4 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* State filter */}
          <div className="w-full md:max-w-[300px]">
            <div className="flex flex-col space-y-2">
              <div className="mb-1 flex items-center justify-between">
                <Label htmlFor="state-filter" className="font-medium">
                  Filter by State
                </Label>
                <div className="text-muted-foreground text-sm">
                  Showing <span className="font-semibold">{points.length}</span>{' '}
                  locations
                </div>
              </div>

              {/* Custom Select Component */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="state-filter"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    dropdownOpen && 'ring-2 ring-ring ring-offset-2',
                  )}
                >
                  <span>
                    {selectedState === 'all' ? 'All States' : selectedState}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>

                {dropdownOpen && (
                  <div className="fade-in-80 absolute top-full left-0 z-50 mt-1 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      <select
                        className="sr-only"
                        value={selectedState}
                        onChange={(e) => handleSelectState(e.target.value)}
                      >
                        <option value="all">All States</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>

                      {/* Custom option for All States */}
                      <button
                        type="button"
                        className={cn(
                          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                          selectedState === 'all'
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground',
                        )}
                        onClick={() => handleSelectState('all')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSelectState('all')
                          }
                        }}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {selectedState === 'all' && (
                            <Check className="h-4 w-4" />
                          )}
                        </span>
                        <span>All States</span>
                      </button>

                      {/* Custom options for states */}
                      {states.map((state) => (
                        <button
                          type="button"
                          key={state}
                          className={cn(
                            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                            selectedState === state
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground',
                          )}
                          onClick={() => handleSelectState(state)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSelectState(state)
                            }
                          }}
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            {selectedState === state && (
                              <Check className="h-4 w-4" />
                            )}
                          </span>
                          <span>{state}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reset button - aligned center with the filter */}
          {selectedState !== 'all' && (
            <Button
              variant="outline"
              onClick={() => setSelectedState('all')}
              size="sm"
              className="h-10 self-end"
            >
              Show All States
            </Button>
          )}
        </div>
      </div>

      {/* Map container - always full width and same height */}
      <div className="h-[400px] w-full overflow-hidden rounded-md border">
        {!mapVisible && <Skeleton className="h-full w-full" />}
        <MultiMap
          key={mapKey}
          className="z-0 h-full w-full"
          points={points}
          whenReady={() => setMapVisible(true)}
        />
      </div>
    </div>
  )
}
