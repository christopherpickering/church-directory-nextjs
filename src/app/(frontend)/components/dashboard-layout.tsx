'use client'

import type * as React from 'react'
import Navigation from '@/app/(frontend)/components/navigation'
import SearchHeader from '@/app/(frontend)/components/search-header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SearchHeader />
      <Navigation />
      <main className="container mx-auto flex-1 p-4">{children}</main>
    </div>
  )
}
