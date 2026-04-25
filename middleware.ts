
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicPaths = ['/login', '/signup', '/auth/callback', '/successor/accept']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If accessing a public path, allow through
  if (isPublicPath) {
    return res
  }

  // If no session and trying to access protected route, redirect to login
  if (!session && request.nextUrl.pathname !== '/login') {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If has session and trying to access login, redirect to dashboard
  if (session && request.nextUrl.pathname === '/login') {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
