
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

  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // SUCCESSOR ROUTES - Check if accessing successor pages
  if (path.startsWith('/successor')) {
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at')
      .eq('email', session.user.email)
      .maybeSingle()

    if (!successor) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }

    if (path === '/successor' && !successor.legal_accepted_at) {
      return NextResponse.redirect(new URL('/successor/legal-gateway', request.url))
    }

    return res
  }

  // FOUNDER ROUTES - Only check successor status when accessing dashboard
  if (path.startsWith('/dashboard')) {
    // Allow access by default (they're logged in)
    return res
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
