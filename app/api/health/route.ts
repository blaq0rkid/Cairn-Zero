
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Check database connectivity
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('profiles').select('count').limit(1)

    if (error) {
      return NextResponse.json(
        { status: 'error', message: 'Database connectivity failed' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT_MODE,
      services: {
        database: 'operational',
        api: 'operational'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'System check failed' },
      { status: 500 }
    )
  }
}
