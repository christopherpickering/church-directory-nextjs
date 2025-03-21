'use client'
import { useAuth } from '@/providers/Auth'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const { user } = useAuth()

  // Move useEffect to the top level before any conditionals
  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  // Then handle the conditional for authentication
  if (!user) {
    return redirect('/auth/login')
  }

  return <React.Fragment />
}

export default PageClient
