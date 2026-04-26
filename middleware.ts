
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
    '/successor/login',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/accept',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy'
  ]

  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/guidepost/')
  )

  if (isPublicPath) {
    return res
  }

  // Check for simulation mode bypass
  const isSimulation = request.nextUrl.searchParams.get('simulation') === 'true'
  const isResumption = request.nextUrl.searchParams.get('resumption') === 'true'
  
  if (path.startsWith('/successor') && (isSimulation || isResumption)) {
    console.log('✅ Simulation/Resumption mode: Bypassing authentication gate')
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

  // CRITICAL: Check portal context to prevent founder/successor identity crisis
  // This ensures successors stay in the successor portal even if they have a founder account
  
  if (path.startsWith('/successor')) {
    // User is accessing successor routes - verify they should be here
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at, successor_id')
      .eq('email', session.user.email)
      .single()

    if (!successor) {
      console.log('⚠️ No successor record found, redirecting to claim')
      return NextResponse.redirect(new URL('/claim', request.url))
    }

    // Allow access to thank-you if legal acceptance exists (even if not fully active)
    if (path.includes('/thank-you') && successor.legal_accepted_at) {
      return res
    }

    // Enforce legal gating for dashboard
    if (path === '/successor' || path.startsWith('/successor/dashboard')) {
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
        console.log('⚠️ Legal acceptance required')
        return NextResponse.redirect(new URL('/claim', request.url))
      }
    }

    return res
  }

  // User is accessing founder routes
  if (path.startsWith('/dashboard') || path.startsWith('/founder')) {
    // Check if they're actually a successor trying to access founder routes
    const { data: successor } = await supabase
      .from('successors')
      .select('id')
      .eq('email', session.user.email)
      .single()

    // If they have a successor record, redirect them to successor portal
    if (successor) {
      console.log('⚠️ Successor attempting to access founder route, redirecting')
      return NextResponse.redirect(new URL('/successor', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
