
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
    '/successor/accept',
    '/successor/declined',
    '/auth/callback',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy',
    '/guidepost',
    '/msa',
    '/succession-playbook',
    '/thank-you',
    '/success'
  ]

  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith('/guidepost/') || 
    path.startsWith('/successor/accept/')
  )

  if (isPublicPath) {
    return res
  }

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Not authenticated - redirect based on path
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/claim', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated - enforce role-based routing
  const { data: successor } = await supabase
    .from('successors')
    .select('id, status, legal_accepted_at')
    .eq('email', session.user.email)
    .single()

  if (successor) {
    // User is a SUCCESSOR - prevent access to founder routes
    if (path.startsWith('/dashboard') || path.startsWith('/founder')) {
      console.log('⚠️ Successor blocked from founder route')
      return NextResponse.redirect(new URL('/successor', request.url))
    }

    // Enforce legal gating
    if (path.startsWith('/successor') && !path.includes('/legal-gateway')) {
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
        console.log('⚠️ Legal acceptance required')
        return NextResponse.redirect(new URL('/claim', request.url))
      }
    }
  } else {
    // User is a FOUNDER - prevent access to successor routes
    if (path.startsWith('/successor')) {
      console.log('⚠️ Founder blocked from successor route')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
