
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  // =============================================================================
  // STAGING ENVIRONMENT PROTECTION
  // =============================================================================
  // Protect staging/sandbox routes in production
  const isStagingRoute = path.startsWith('/internal/sandbox') || path.startsWith('/staging')
  
  if (isStagingRoute) {
    // Check if this is production environment
    const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production'
    
    if (isProduction) {
      // Block staging routes in production
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // In staging/dev, check for access password
    const stagingPassword = request.cookies.get('staging_access')?.value
    
    if (stagingPassword !== process.env.STAGING_ACCESS_PASSWORD) {
      return NextResponse.redirect(new URL('/staging-login', request.url))
    }
  }

  // =============================================================================
  // SIMULATION MODE GATING
  // =============================================================================
  // Block simulation routes in production
  const isSimulationEnabled = process.env.NEXT_PUBLIC_ENABLE_SIMULATION === 'true'
  const isSimulationRequest = request.nextUrl.searchParams.get('simulation') === 'true'
  
  if (isSimulationRequest && !isSimulationEnabled) {
    // Remove simulation parameter and redirect
    const url = request.nextUrl.clone()
    url.searchParams.delete('simulation')
    return NextResponse.redirect(url)
  }

  // =============================================================================
  // PUBLIC PATHS - No auth required
  // =============================================================================
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/claim',
    '/successor',
    '/successor/access',
    '/successor/legal-gateway',
    '/successor/thank-you',
    '/successor/declined',
    '/successor/access-error',
    '/auth/callback',
    '/staging-login'
  ]

  if (publicPaths.some(p => path === p)) {
    return res
  }

  // =============================================================================
  // AUTHENTICATION CHECK
  // =============================================================================
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/successor/access', request.url))
    }
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
