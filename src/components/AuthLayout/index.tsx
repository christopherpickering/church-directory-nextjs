'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Login } from '@/components/Login'
import LoginDashboard from '@/components/Login/LoginDashboard'
import { useAuth } from '@/providers/Auth'
import type React from 'react'
export default function AuthenticatedLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const { user } = useAuth()

  if (user) {
    return <DashboardLayout title={title}>{children}</DashboardLayout>
  }

  return (
    <LoginDashboard title={title}>
      <Login />
    </LoginDashboard>
  )
}
