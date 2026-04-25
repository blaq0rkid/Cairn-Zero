
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
  const publicPaths = ['/login', '/signup', '/auth/callback', '/successor/accept', '/', '/pricing', '/faq', '/terms', '/privacy', '/guidepost', '/msa', '/succession-playbook', '/thank-you', '/success']
  const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith('/guidepost/'))

  // Allow public paths
  if (isPublicPath) {
    // If logged in and trying to access /login, redirect to dashboard
    if (session && path === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return res
  }

  // Protect dashboard and founder routes
  if (!session && (path.startsWith('/dashboard') || path.startsWith('/founder'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
