
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Simplified Succession Trigger Test
 * Triggers succession for existing test marker without requiring cairn setup
 */
export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find the test rehearsal
    const { data: rehearsal, error: fetchError } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .eq('test_marker_id', 'TEST-1777405366-cz-2026')
      .single()

    if (fetchError || !rehearsal) {
      return NextResponse.json(
        { error: 'Test rehearsal not found', details: fetchError },
        { status: 404 }
      )
    }

    // Check current status
    if (rehearsal.status === 'viewed') {
      return NextResponse.json({
        success: true,
        message: 'Succession already triggered and viewed',
        rehearsal: {
          id: rehearsal.id,
          test_marker_id: rehearsal.test_marker_id,
          status: rehearsal.status,
          viewed_at: rehearsal.viewed_at
        }
      })
    }

    // Trigger succession by updating to 'viewed' status
    const { data: updated, error: updateError } = await supabase
      .from('succession_rehearsals')
      .update({
        status: 'viewed',
        viewed_at: new Date().toISOString()
      } as any)
      .eq('id', rehearsal.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to trigger succession', details: updateError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Succession triggered successfully - status changed to viewed',
      rehearsal: {
        id: updated.id,
        test_marker_id: updated.test_marker_id,
        status: updated.status,
        viewed_at: updated.viewed_at
      },
      next_step: 'Visit https://cairn-zero.netlify.app/successor?testKey=cz-2026 to verify'
    })

  } catch (error) {
    console.error('Succession trigger error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Get current test status
 */
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: rehearsal, error } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .eq('test_marker_id', 'TEST-1777405366-cz-2026')
      .single()

    if (error || !rehearsal) {
      return NextResponse.json(
        { error: 'Test rehearsal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      rehearsal: {
        id: rehearsal.id,
        test_marker_id: rehearsal.test_marker_id,
        status: rehearsal.status,
        viewed_at: rehearsal.viewed_at,
        sent_at: rehearsal.sent_at
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}
