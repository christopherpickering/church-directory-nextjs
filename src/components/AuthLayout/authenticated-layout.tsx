'use client'

import DashboardLayout from '@/components/DashboardLayout/dashboard-layout'
import { Login } from '@/components/Login'
import LoginDashboard from '@/components/Login/LoginDashboard'
import { useAuth } from '@/providers/Auth'
import type React from 'react'
export default function AuthenticatedLayout({
  children,
}: { children: React.ReactNode }) {
  const { user, status } = useAuth()

  if (status === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  return (
    <LoginDashboard>
      <Login />
    </LoginDashboard>
  )
}
