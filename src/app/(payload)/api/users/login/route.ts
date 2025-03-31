import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const { docs: users } = await payload.find({
      collection: 'users',
      depth: 0,
    })

    for (const user of users) {
      try {
        const result = await payload.login({
          collection: 'users',
          data: {
            email: user.email,
            password,
          },
        })

        if (result.user) {
          const response = NextResponse.json({ user: result.user }, { status: 200 })

          if (result.token) {
            response.cookies.set('payload-token', result.token, {
              httpOnly: true,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7,
            })
          }

          return response
        }
      } catch (error) {
        continue
      }
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
  }
}
