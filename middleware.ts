
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  // Public routes - no authentication required
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/claim',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy'
  ]

  const isPublicPath = publicPaths.some(publicPath => path === publicPath)

  if (isPublicPath) {
    return res
  }

  // Check for simulation or resumption bypass
  const isSimulation = request.nextUrl.searchParams.get('simulation') === 'true'
  const isResumption = request.nextUrl.searchParams.get('resumption') === 'true'
  
  if (path.startsWith('/successor') && (isSimulation || isResumption)) {
    console.log('✅ Middleware: Bypassing auth for simulation/resumption')
    return res
  }

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/claim', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // CRITICAL: Role-aware routing for dual-role users
  // Successor routes take priority when accessed from successor context
  
  if (path.startsWith('/successor')) {
    console.log('🔍 Middleware: Processing successor route')
    
    // Check if user has a successor record
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at, successor_id')
      .eq('email', session.user.email)
      .single()

    if (!successor) {
      console.log('⚠️ Middleware: No successor record, redirect to claim')
      return NextResponse.redirect(new URL('/claim', request.url))
    }

    // Allow access to thank-you if legal_accepted_at exists (Safe Harbor override)
    if (path.includes('/thank-you') && successor.legal_accepted_at) {
      console.log('✅ Middleware: Legal accepted, allowing thank-you access')
      return res
    }

    // Enforce legal gating for main dashboard
    if (path === '/successor' || path.startsWith('/successor/dashboard')) {
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
        console.log('⚠️ Middleware: Legal acceptance required')
        return NextResponse.redirect(new URL('/claim', request.url))
      }
    }

    console.log('✅ Middleware: Successor access granted')
    return res
  }

  // Founder routes - check if user is actually a successor
  if (path.startsWith('/dashboard') || path.startsWith('/founder')) {
    // Check if this user has a successor record
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status')
      .eq('email', session.user.email)
      .single()

    // If they have an active successor record and no explicit founder intent,
    // this might be a misroute (but allow explicit navigation)
    if (successor && successor.status === 'active') {
      const referer = request.headers.get('referer')
      const isFromClaim = referer?.includes('/claim') || referer?.includes('/successor')
      
      if (isFromClaim) {
        console.log('⚠️ Middleware: Successor context detected, redirecting to successor portal')
        return NextResponse.redirect(new URL('/successor', request.url))
      }
    }

    return res
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
