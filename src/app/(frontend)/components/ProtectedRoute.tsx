'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if there's a token in cookies
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('payload-token='))
      ?.split('=')[1]

    if (!token) {
      // If no token, redirect to admin
      router.push('/admin')
    }
  }, [router])

  return <>{children}</>
}
