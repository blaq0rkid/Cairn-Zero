
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  console.log('🔍 Middleware checking path:', path)

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
    '/successor/debug',  // ADD THIS LINE
    '/auth/callback'
  ]

  if (publicPaths.some(p => path === p)) {
    console.log('✅ Public path, allowing')
    return res
  }

  // Bypass for simulation/resumption query params
  const isSimulation = request.nextUrl.searchParams.get('simulation') === 'true'
  const isResumption = request.nextUrl.searchParams.get('resumption') === 'true'
  
  if (path.startsWith('/successor') && (isSimulation || isResumption)) {
    console.log('✅ Bypass for simulation/resumption')
    return res
  }

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('⚠️ No session')
    if (path.startsWith('/successor')) {
      return NextResponse.redirect(new URL('/claim', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('✅ Session found:', session.user.email)

  // SUCCESSOR ROUTES - Check if user has successor access
  if (path.startsWith('/successor')) {
    console.log('🔍 Checking successor access...')
    
    // Look up successor record
    const { data: successor, error } = await supabase
      .from('successors')
      .select('id, status, legal_accepted_at')
      .eq('email', session.user.email)
      .single()

    if (error || !successor) {
      console.log('❌ No successor record, redirect to claim')
      return NextResponse.redirect(new URL('/claim', request.url))
    }

    console.log('✅ Successor record found')
    console.log('   Status:', successor.status)
    console.log('   Legal accepted:', successor.legal_accepted_at ? 'Yes' : 'No')

    // CRITICAL FIX: Allow access if legal_accepted_at exists OR if on thank-you page
    const onThankYouPage = path.includes('/thank-you')
    
    if (onThankYouPage) {
      console.log('✅ On thank-you page, allowing access')
      return res
    }

    // For dashboard access, check legal gating
    if (path === '/successor' || path.startsWith('/successor/dashboard')) {
      if (!successor.legal_accepted_at) {
        console.log('⚠️ No legal acceptance, redirect to claim')
        return NextResponse.redirect(new URL('/claim', request.url))
      }
      
      console.log('✅ Legal acceptance verified, allowing dashboard access')
      return res
    }

    console.log('✅ Allowing successor route')
    return res
  }

  // FOUNDER ROUTES
  if (path.startsWith('/dashboard')) {
    const { data: successor } = await supabase
      .from('successors')
      .select('id, status')
      .eq('email', session.user.email)
      .single()

    if (successor?.status === 'active') {
      const referer = request.headers.get('referer')
      if (referer?.includes('/claim') || referer?.includes('/successor')) {
        console.log('⚠️ Successor context detected, redirect to /successor')
        return NextResponse.redirect(new URL('/successor', request.url))
      }
    }
  }

  console.log('✅ Allowing request')
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
