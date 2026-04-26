
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  // =============================================================================
  // PRODUCTION SAFETY: Block all testing routes in production
  // =============================================================================
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production'
  
  // Block staging routes in production
  if (isProduction && (path.startsWith('/internal/') || path.startsWith('/staging'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Block simulation parameters in production
  if (isProduction && request.nextUrl.searchParams.get('simulation') === 'true') {
    const url = request.nextUrl.clone()
    url.searchParams.delete('simulation')
    return NextResponse.redirect(url)
  }

  // Block test keys in production
  if (isProduction && path.includes('CZ-TEST')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // =============================================================================
  // STAGING ENVIRONMENT PROTECTION
  // =============================================================================
  const isStagingRoute = path.startsWith('/internal/sandbox')
  
  if (isStagingRoute && !isProduction) {
    const stagingPassword = request.cookies.get('staging_access')?.value
    
    if (stagingPassword !== process.env.STAGING_ACCESS_PASSWORD) {
      return NextResponse.redirect(new URL('/staging-login', request.url))
    }
  }

  // =============================================================================
  // PUBLIC PATHS - No authentication required
  // =============================================================================
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/claim',
    '/contact',
    '/privacy',
    '/terms',
    '/successor',
    '/successor/access',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback',
    '/staging-login'
  ]

  // Allow public paths through
  if (publicPaths.some(p => path === p || path.startsWith(p))) {
    return res
  }

  // =============================================================================
  // AUTHENTICATION CHECK
  // =============================================================================
  const { data: { session } } = await supabase.auth.getSession()

  // Protect authenticated routes
  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Default redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // =============================================================================
  // ENGRAVER TOOL PROTECTION (Service Role Only)
  // =============================================================================
  if (path.startsWith('/engraver')) {
    const engraverPassword = request.cookies.get('engraver_access')?.value
    
    if (engraverPassword !== process.env.ENGRAVER_TOOL_PASSWORD) {
      return NextResponse.redirect(new URL('/engraver/login', request.url))
    }
  }

  // Allow authenticated users through
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
