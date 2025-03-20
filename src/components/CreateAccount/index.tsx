'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'

const EMAIL_REGEX = /\S+@\S+\.\S+/

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccount: React.FC<{
  modal?: boolean
  slug?: string
}> = ({ modal = false, slug = 'create-account' }) => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
  } = useForm<FormData>()

  if (user) {
    router.push(
      `/account?warning=${encodeURIComponent('login.alreadyLoggedIn')}`,
    )
  }

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        const message =
          response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (redirect) router.push(redirect as string)
        else
          router.push(
            `/account?success=${encodeURIComponent('Account created successfully')}`,
          )
      } catch (_) {
        clearTimeout(timer)
        setError('Invalid credentials')
      }
    },
    [login, router, searchParams],
  )

  React.useEffect(() => {
    if (slug === 'create-account') {
      setFocus('email')
    }
  }, [setFocus, slug])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-1">
      <div className="flex flex-col space-y-1.5 pb-6">
        <div className="font-semibold text-2xl tracking-tight">
          {'Create account'}
        </div>
        <p className="text-muted-foreground text-sm">
          {'Enter email to create an account.'}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">{'Email'}</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'true',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Please enter a valid email',
              },
            })}
            placeholder="m@example.com"
            required
          />
          {errors.email && (
            <div className="text-red-700 text-sm">
              {!errors.email?.message && errors.email?.type === 'required'
                ? 'required'
                : errors.email?.message}
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{'Password'}</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register('password', {
              required: 'true',
            })}
          />
          <div className="text-red-700 text-sm">
            {!errors.password?.message && errors.password?.type === 'required'
              ? 'required'
              : errors.password?.message}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{'Confirm password'}</Label>
          </div>
          <Input
            id="passwordConfirm"
            type="password"
            required
            {...register('passwordConfirm', {
              required: 'true',
              validate: (value) =>
                value === password.current || 'Passwords do not match',
            })}
          />
          <div className="text-red-700 text-sm">
            {!errors.passwordConfirm?.message &&
            errors.passwordConfirm?.type === 'required'
              ? 'required'
              : errors.passwordConfirm?.message}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Create account'}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        {'Already have an account?'}{' '}
        <Link
          href={`/auth/login${allParams}`}
          className="underline underline-offset-4"
          replace={modal}
        >
          {'Login'}
        </Link>
      </div>

      {error && <div className="py-2 text-red-700 text-sm">{error}</div>}
    </form>
  )
}
