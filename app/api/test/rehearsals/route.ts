
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Get all test succession rehearsals
 * Uses service role key to bypass RLS for testing
 */
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .order('sent_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch rehearsals', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      rehearsals: data || []
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
