'use client'

import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect } from 'react'

import { useAuth } from '@/providers/Auth'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        router.replace(
          `/?warning=${encodeURIComponent('Logged out successfully.')}`,
        )
      } catch (_) {
        router.replace(
          `/?warning=${encodeURIComponent('You are already logged out.')}`,
        )
      }
    }

    performLogout()
  }, [logout, router])

  return <article className="container pt-16 pb-16">Logging out...</article>
}
