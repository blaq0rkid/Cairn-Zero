
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/claim',
    '/successor/access',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback'
  ]

  if (publicPaths.some(p => path === p)) {
    return res
  }

  const { data: { session } } = await supabase.auth.getSession()

  // Allow /successor route without auth if sessionStorage has token
  // (since we can't access sessionStorage in middleware, we'll be permissive)
  if (path === '/successor') {
    return res
  }

  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For authenticated users on successor routes (except /successor itself)
  if (path.startsWith('/successor') && path !== '/successor') {
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at')
      .eq('email', session.user.email)
      .maybeSingle()

    if (!successor) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }

    if (path === '/successor/legal-gateway' && successor.legal_accepted_at) {
      return NextResponse.redirect(new URL('/successor', request.url))
    }
  }

  // FOUNDER ROUTES - Only check if on dashboard
  if (path.startsWith('/dashboard')) {
    // Allow access by default (they're logged in)
    return res
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
