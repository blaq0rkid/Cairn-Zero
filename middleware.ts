
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicPaths = [
    '/login', 
    '/signup', 
    '/successor/login',
    '/auth/callback', 
    '/successor/accept',
    '/', 
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
    path === publicPath || path.startsWith('/guidepost/')
  )

  // Allow public paths
  if (isPublicPath) {
    return res
  }

  // If not authenticated and trying to access protected route
  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/login', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // User is authenticated - check their role
  if (session) {
    // Check if user is a successor
    const { data: successor } = await supabase
      .from('successors')
      .select('id')
      .eq('email', session.user.email)
      .single()

    // Role-based routing
    if (successor) {
      // User is a successor
      if (path.startsWith('/dashboard') || path.startsWith('/founder')) {
        // Successor trying to access founder routes - redirect to successor portal
        return NextResponse.redirect(new URL('/successor', request.url))
      }
    } else {
      // User is a founder (not in successors table)
      if (path.startsWith('/successor') && !path.startsWith('/successor/accept')) {
        // Founder trying to access successor routes - redirect to founder dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
