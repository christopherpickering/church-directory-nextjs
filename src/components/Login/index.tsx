'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
// import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

// Create a separate component that uses useSearchParams
function LoginForm({ slug = 'login' }) {
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect'))
  const { login, user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  if (user) {
    router.push(`/?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    setFocus,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/account')
      } catch (_) {
        setError('invalidCredentials')
      }
    },
    [login, router],
  )

  React.useEffect(() => {
    if (slug === 'login') {
      setFocus('password')
    }
  }, [setFocus, slug])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-1">
      <div className="flex flex-col space-y-1.5 pb-6">
        <div className="font-semibold text-2xl tracking-tight">{'Login'}</div>
        <p className="text-muted-foreground text-sm">
          {'Enter email to login to your account.'}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <Link
              tabIndex={-1}
              href={`/auth/recover-password${allParams}`}
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              replace={modal}
            >
              {'Forgot your password?'}
            </Link> */}
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register('password', {
              required: 'true',
              // validate,
            })}
          />
          <div className="text-red-700 text-sm">
            {!errors.password?.message && errors.password?.type === 'required'
              ? 'required'
              : errors.password?.message}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Login'}
        </Button>
      </div>
      {/* <div className="mt-4 text-center text-sm">
        {"Don't have an account?"}{' '}
        <Link
          href={`/auth/create-account${allParams}`}
          className="underline underline-offset-4"
          replace={modal}
        >
          {'Sign up'}
        </Link>
      </div> */}

      {error && <div className="py-2 text-red-700 text-sm">{error}</div>}
    </form>
  )
}

// Main component with Suspense
export const Login: React.FC<{
  slug?: string
}> = ({ slug = 'login' }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm slug={slug} />
    </Suspense>
  )
}
