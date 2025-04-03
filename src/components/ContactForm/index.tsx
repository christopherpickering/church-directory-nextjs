'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const EMAIL_REGEX = /\S+@\S+\.\S+/

type ContactFormData = {
  name: string
  email: string
  regarding: string
  message: string
}

interface ContactFormProps {
  onSuccess?: () => void
  title?: string
  description?: string
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSuccess,
  title = 'Contact Us',
  description = 'Questions, suggestions, comments, etc.',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact-submissions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit the form')
      }

      setSubmitSuccess(true)
      reset()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError('Failed to submit the form. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h2 className="mb-2 font-bold text-3xl">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {submitSuccess ? (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
          <p>Thank you for your message! We'll get back to you soon.</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => setSubmitSuccess(false)}
          >
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Please enter a valid email',
                },
              })}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="regarding">Regarding</Label>
            <Input id="regarding" {...register('regarding')} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              rows={6}
              {...register('message', { required: 'Message is required' })}
              className="mt-1"
            />
            {errors.message && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.message.message}
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              {submitError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit'}
          </Button>
        </form>
      )}
    </Card>
  )
}

export default ContactForm
