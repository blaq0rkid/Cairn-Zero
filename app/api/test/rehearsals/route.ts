
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
      .select('id, test_marker_id, status, test_payload, payload, encrypted_payload, sent_at, unwrapped_at, updated_at')
      .order('sent_at', { ascending: false })

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch rehearsals', details: error },
        { status: 500 }
      )
    }

    // Normalize the data - check all possible payload fields
    const normalizedData = data?.map(rehearsal => {
      const payloadValue = rehearsal.test_payload 
        || rehearsal.payload 
        || rehearsal.encrypted_payload 
        || 'ENCRYPTED_TEST_DATA'
      
      return {
        id: rehearsal.id,
        test_marker_id: rehearsal.test_marker_id,
        status: rehearsal.status,
        payload: payloadValue,
        sent_at: rehearsal.sent_at,
        updated_at: rehearsal.updated_at || rehearsal.unwrapped_at
      }
    }) || []

    console.log('Fetched rehearsals:', normalizedData.length)
    normalizedData.forEach(r => {
      console.log(`- ${r.test_marker_id}: status=${r.status}, payload=${r.payload?.substring(0, 50)}...`)
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
