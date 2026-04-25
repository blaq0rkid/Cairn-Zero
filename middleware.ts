
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
    '/successor/login',
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
    path === publicPath || path.startsWith('/guidepost/') || path.startsWith('/successor/accept/')
  )

  if (isPublicPath) {
    return res
  }

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // Protect authenticated routes
  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/login', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based routing for authenticated users
  if (session) {
    // Check if user is a successor
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at')
      .eq('email', session.user.email)
      .single()

    if (successor) {
      // User is a SUCCESSOR
      console.log('🔵 Successor detected:', session.user.email)
      
      // Prevent successors from accessing founder routes
      if (path.startsWith('/dashboard') || path.startsWith('/founder')) {
        console.log('⚠️ Successor attempted to access founder route, redirecting')
        return NextResponse.redirect(new URL('/successor', request.url))
      }

      // Legal gating: Check if they've accepted legal terms
      if (path.startsWith('/successor') && !path.startsWith('/successor/accept')) {
        if (successor.status !== 'active' || !successor.legal_accepted_at) {
          console.log('⚠️ Successor has not accepted legal terms')
          // Allow access to login but nothing else
          if (path !== '/successor/login') {
            return NextResponse.redirect(new URL('/successor/login', request.url))
          }
        }
      }
    } else {
      // User is a FOUNDER (not in successors table)
      console.log('🔴 Founder detected:', session.user.email)
      
      // Prevent founders from accessing successor routes
      if (path.startsWith('/successor') && !path.startsWith('/successor/accept')) {
        console.log('⚠️ Founder attempted to access successor route, redirecting')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
