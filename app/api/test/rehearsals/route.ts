
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
      .select('id, test_marker_id, status, payload, encrypted_payload, sent_at, updated_at')
      .order('sent_at', { ascending: false })

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch rehearsals', details: error },
        { status: 500 }
      )
    }

    // Normalize the data to ensure payload field exists
    const normalizedData = data?.map(rehearsal => ({
      ...rehearsal,
      payload: rehearsal.payload || rehearsal.encrypted_payload || 'ENCRYPTED_TEST_DATA'
    })) || []

    console.log('Fetched rehearsals:', normalizedData.length)
    normalizedData.forEach(r => {
      console.log(`- ${r.test_marker_id}: status=${r.status}, hasPayload=${!!r.payload}`)
    })

    return NextResponse.json({
      success: true,
      rehearsals: normalizedData
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
