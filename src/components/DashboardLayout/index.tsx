'use client'
import Navigation from '@/components/Nav/navigation'
import SearchHeader from '@/components/SearchHeader'
import type * as React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SearchHeader title={title} />
      <Navigation />
      <main className="w-full flex-1 py-4">{children}</main>
    </div>
  )
}
