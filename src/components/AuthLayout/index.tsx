'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Login } from '@/components/Login'
import LoginDashboard from '@/components/Login/LoginDashboard'
import { useAuth } from '@/providers/Auth'
import type React from 'react'
export default function AuthenticatedLayout({
  children,
}: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  return (
    <LoginDashboard>
      <Login />
    </LoginDashboard>
  )
}
