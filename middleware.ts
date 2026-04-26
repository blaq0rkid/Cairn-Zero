
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  // Public routes - no auth required
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/claim',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback'
  ]

  if (publicPaths.some(p => path === p)) {
    return res
  }

  // Bypass for simulation/resumption
  const isSimulation = request.nextUrl.searchParams.get('simulation') === 'true'
  const isResumption = request.nextUrl.searchParams.get('resumption') === 'true'
  
  if (path.startsWith('/successor') && (isSimulation || isResumption)) {
    console.log('✅ Middleware: Bypass for simulation/resumption')
    return res
  }

  // Check auth
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/claim', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ROLE-AWARE ROUTING: Successor routes take priority
  if (path.startsWith('/successor')) {
    console.log('🔍 Middleware: Successor route')
    
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at')
      .eq('email', session.user.email)
      .single()

    if (!successor) {
      console.log('⚠️ No successor record → /claim')
      return NextResponse.redirect(new URL('/claim', request.url))
    }

    // Allow thank-you if legal_accepted_at exists (Safe Harbor override)
    if (path.includes('/thank-you') && successor.legal_accepted_at) {
      console.log('✅ Legal accepted → allow thank-you')
      return res
    }

    // Enforce legal gating for dashboard
    if (path === '/successor' || path.startsWith('/successor/dashboard')) {
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
        console.log('⚠️ Legal acceptance required')
        return NextResponse.redirect(new URL('/claim', request.url))
      }
    }

    console.log('✅ Successor access granted')
    return res
  }

  // Founder routes - check for dual-role misroute
  if (path.startsWith('/dashboard')) {
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status')
      .eq('email', session.user.email)
      .single()

    // If active successor coming from claim flow, redirect to successor
    if (successor?.status === 'active') {
      const referer = request.headers.get('referer')
      if (referer?.includes('/claim') || referer?.includes('/successor')) {
        console.log('⚠️ Successor context detected → /successor')
        return NextResponse.redirect(new URL('/successor', request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
