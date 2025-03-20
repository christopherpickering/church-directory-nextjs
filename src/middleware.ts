import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    !pathname.includes('(frontend)') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('payload-token')?.value

  if (!token) {
    const loginUrl = new URL('/admin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const response = await fetch(
      `${new URL(request.url).origin}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    )

    if (!response.ok) {
      const loginUrl = new URL('/admin', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error verifying token:', error)
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
