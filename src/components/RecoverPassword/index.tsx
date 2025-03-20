'use client'

import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EMAIL_REGEX = /\S+@\S+\.\S+/

type FormData = {
  email: string
}
export const RecoverPassword: React.FC<{
  modal?: boolean
  slug?: string
}> = ({ modal = false, slug = 'recover-password' }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'There was a problem while attempting to send you a password reset email. Please try again.',
      )
    }
  }, [])

  React.useEffect(() => {
    if (slug === 'recover-password') {
      setFocus('email')
    }
  }, [setFocus, slug])

  return (
    <React.Fragment>
      {!success && (
        <form onSubmit={handleSubmit(onSubmit)} className="m-1">
          <div className="flex flex-col space-y-1.5 pb-6">
            <div className="font-semibold text-2xl tracking-tight">
              {'Recover password'}
            </div>
            <p className="text-muted-foreground text-sm">
              {'Enter email to reset your password.'}
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
                  // validate,
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

            <Button type="submit" className="w-full">
              {'Recover password'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {'Back to'}{' '}
            <Link
              href={'/auth/login'}
              className="underline underline-offset-4"
              replace={modal}
            >
              {'Login'}
            </Link>
          </div>

          {error && <div className="py-2 text-red-700 text-sm">{error}</div>}
        </form>
      )}
      {success && (
        <React.Fragment>
          <h1>{'Request submitted'}</h1>
          <p>{'Check your email for a link to reset your password.'}</p>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
