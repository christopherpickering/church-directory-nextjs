import { Login } from '@/components/Login'
import { Card, CardContent } from '@/components/ui/card'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="bg-card/20 shadow">
          <CardContent className="pt-6">
            <Login />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
  openGraph: mergeOpenGraph({
    title: 'Login',
    url: '/login',
  }),
}
