import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { LogoutPage } from './page.client'

export default async function Logout() {
  return <LogoutPage />
}

export const metadata: Metadata = {
  title: 'Logout',
  description: 'You have been logged out.',
  openGraph: mergeOpenGraph({
    title: 'Logout',
    url: '/logout',
  }),
}
