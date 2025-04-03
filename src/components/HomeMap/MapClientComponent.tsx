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
  const [selectedType, setSelectedType] = useState<string>('all')
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile on component mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setStateDropdownOpen(false)
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setTypeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [stateDropdownRef, typeDropdownRef])

  const MultiMap = React.useMemo(
    () =>
      dynamic(() => import('@/components/Maps/MultiMap'), {
        ssr: false,
      }),
    [pathname],
  )

  const states = useMemo(() => {
    const stateSet = new Set<string>()
    for (const address of addresses) {
      if (address.state) {
        stateSet.add(address.state)
      }
    }
    return Array.from(stateSet).sort()
  }, [addresses])

  const types = useMemo(() => {
    return ['locations', 'contacts']
  }, [])

  const get_points = (addresses: AddressData[]) => {
    return addresses
      .filter((address: AddressData) => {
        if (selectedState !== 'all' && address.state !== selectedState) {
          return false
        }

        if (selectedType !== 'all' && address.type !== selectedType) {
          return false
        }

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
          person: address.contact?.fullName || null,
        }
      })
  }

  const points = get_points(addresses)

  const centerLat = isMobile ? 39.8283 : 20
  const centerLong = isMobile ? -98.5795 : -20

  const mapKey = `map-${selectedState}-${selectedType}-${points.length}-${centerLat}-${centerLong}`

  const handleSelectState = (state: string) => {
    setSelectedState(state)
    setStateDropdownOpen(false)
  }

  const handleSelectType = (type: string) => {
    setSelectedType(type)
    setTypeDropdownOpen(false)
  }

  return (
    <div className="relative w-full space-y-6">
      <div className="mb-4 w-full rounded-md border bg-card p-4 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-4 md:max-w-[700px] md:flex-row">
            {/* State Filter */}
            <div className="w-full md:max-w-[300px]">
              <div className="flex flex-col space-y-2">
                <div className="mb-1 flex items-center justify-between">
                  <Label htmlFor="state-filter" className="font-medium">
                    Filter by State
                  </Label>
                </div>

                <div className="relative" ref={stateDropdownRef}>
                  <button
                    type="button"
                    id="state-filter"
                    onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                    className={cn(
                      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      stateDropdownOpen && 'ring-2 ring-ring ring-offset-2',
                    )}
                  >
                    <span>
                      {selectedState === 'all' ? 'All States' : selectedState}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>

                  {stateDropdownOpen && (
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

            {/* Type Filter */}
            <div className="w-full md:max-w-[300px]">
              <div className="flex flex-col space-y-2">
                <div className="mb-1 flex items-center justify-between">
                  <Label htmlFor="type-filter" className="font-medium">
                    Filter by Type
                  </Label>
                </div>

                <div className="relative" ref={typeDropdownRef}>
                  <button
                    type="button"
                    id="type-filter"
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                    className={cn(
                      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      typeDropdownOpen && 'ring-2 ring-ring ring-offset-2',
                    )}
                  >
                    <span>
                      {selectedType === 'all'
                        ? 'All Types'
                        : selectedType === 'locations'
                          ? 'Locations'
                          : 'Contacts'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>

                  {typeDropdownOpen && (
                    <div className="fade-in-80 absolute top-full left-0 z-50 mt-1 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                      <div className="max-h-[300px] overflow-y-auto p-1">
                        <select
                          className="sr-only"
                          value={selectedType}
                          onChange={(e) => handleSelectType(e.target.value)}
                        >
                          <option value="all">All Types</option>
                          {types.map((type) => (
                            <option key={type} value={type}>
                              {type === 'locations' ? 'Locations' : 'Contacts'}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className={cn(
                            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                            selectedType === 'all'
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground',
                          )}
                          onClick={() => handleSelectType('all')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSelectType('all')
                            }
                          }}
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            {selectedType === 'all' && (
                              <Check className="h-4 w-4" />
                            )}
                          </span>
                          <span>All Types</span>
                        </button>

                        {types.map((type) => (
                          <button
                            type="button"
                            key={type}
                            className={cn(
                              'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                              selectedType === type
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground',
                            )}
                            onClick={() => handleSelectType(type)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleSelectType(type)
                              }
                            }}
                          >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                              {selectedType === type && (
                                <Check className="h-4 w-4" />
                              )}
                            </span>
                            <span>
                              {type === 'locations' ? 'Locations' : 'Contacts'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground text-sm">
            Showing <span className="mx-1 font-semibold">{points.length}</span>{' '}
            locations
          </div>

          <div className="flex gap-2">
            {selectedState !== 'all' && (
              <Button
                variant="outline"
                onClick={() => setSelectedState('all')}
                size="sm"
                className="h-10 self-end"
              >
                Clear State Filter
              </Button>
            )}

            {selectedType !== 'all' && (
              <Button
                variant="outline"
                onClick={() => setSelectedType('all')}
                size="sm"
                className="h-10 self-end"
              >
                Clear Type Filter
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full overflow-hidden rounded-md border">
        {!mapVisible && <Skeleton className="h-full w-full" />}
        <MultiMap
          key={mapKey}
          className="z-0 h-full w-full"
          points={points}
          lat={centerLat}
          long={centerLong}
          whenReady={() => setMapVisible(true)}
        />
      </div>
    </div>
  )
}
