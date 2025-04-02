import SearchHeader from '@/components/SearchHeader'
import type React from 'react'

interface LoginDashboardProps {
  children: React.ReactNode
  title: string
}

export default function LoginDashboard({
  children,
  title,
}: LoginDashboardProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SearchHeader title={title || 'Address Directory'} />{' '}
      <nav className="border-primary-dark/50 border-t bg-primary-dark pb-10 text-primary-dark">
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full justify-between lg:hidden" />
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  )
}
