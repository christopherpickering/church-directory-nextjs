'use client'

import Navigation from '@/components/Nav/navigation'
import SearchHeader from '@/components/SearchHeader/search-header'
import type * as React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SearchHeader isLoggedIn={true} />
      <Navigation />
      <main className="container mx-auto flex-1 p-4">{children}</main>
    </div>
  )
}
