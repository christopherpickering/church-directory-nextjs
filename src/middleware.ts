import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply protection to (frontend) routes
  if (
    !pathname.includes('(frontend)') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // Get the token from cookies
  const token = request.cookies.get('payload-token')?.value

  if (!token) {
    // If no token, redirect to admin login
    // Use the Payload CMS admin login which is typically at /admin
    const loginUrl = new URL('/admin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token by making a request to the /api/users/me endpoint
  try {
    const response = await fetch(`${new URL(request.url).origin}/api/users/me`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })

    if (!response.ok) {
      // If token is invalid, redirect to admin login
      const loginUrl = new URL('/admin', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error verifying token:', error)
    // If there's an error, redirect to admin login
    const loginUrl = new URL('/admin', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (they handle their own auth)
     * - admin routes (to prevent infinite redirect)
     */
    '/((?!_next/static|_next/image|favicon|public|api|admin).*)',
  ],
}
