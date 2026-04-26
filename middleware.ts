
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  // Public paths - no auth required
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/claim',
    '/successor',
    '/successor/access',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback'
  ]

  // Allow public paths through immediately
  if (publicPaths.some(p => path === p)) {
    return res
  }

  const { data: { session } } = await supabase.auth.getSession()

  // Protect authenticated routes
  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Allow all authenticated users through to their respective dashboards
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
