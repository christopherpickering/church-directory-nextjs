'use client'

import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect } from 'react'
import DashboardLayout from './dashboard-layout'

export default function AuthenticatedLayout({
  children,
}: { children: React.ReactNode }) {
  const { user, status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we've explicitly determined the user is not authenticated
    if (status === 'loggedOut') {
      router.push('/auth/login')
    }
  }, [status, router])

  // While checking authentication status, show a loading state
  if (status === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  // If authenticated, show the dashboard layout with children
  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  // Render nothing while redirect happens
  return null
}
