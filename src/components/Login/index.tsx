'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/providers/Auth'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  password: string
}

function LoginForm({ slug = 'login' }) {
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect'))
  const { login, user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    router.push(`/?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setIsSubmitting(true)
      setError(null)

      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/')
      } catch (_) {
        setError('invalidCredentials')
        setIsSubmitting(false)
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-1 w-full space-y-2 md:w-1/2 lg:w-1/3"
    >
      <div className="flex flex-col space-y-1.5 pb-6">
        <div className="font-semibold text-2xl tracking-tight">{'Login'}</div>
        <p className="text-muted-foreground text-sm">
          {'Enter password to login to your account.'}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            disabled={isSubmitting}
            {...register('password', {
              required: 'true',
            })}
          />
          <div className="text-red-700 text-sm">
            {/*{!errors.password?.message && errors.password?.type === 'required'
              ? 'required'
              : errors.password?.message}*/}
            {error && (
              <div className="py-2 text-red-700 text-sm">
                {error === 'invalidCredentials'
                  ? 'Invalid password. Please try again.'
                  : error}
              </div>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner className="mr-2" size="sm" />
              <span>Logging in...</span>
            </div>
          ) : (
            'Login'
          )}
        </Button>
      </div>
    </form>
  )
}

export const Login: React.FC<{
  slug?: string
}> = ({ slug = 'login' }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm slug={slug} />
    </Suspense>
  )
}
