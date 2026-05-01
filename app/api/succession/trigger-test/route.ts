
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
    if (rehearsal.status === 'triggered') {
      return NextResponse.json({
        success: true,
        message: 'Succession already triggered',
        rehearsal: {
          id: rehearsal.id,
          test_marker_id: rehearsal.test_marker_id,
          status: rehearsal.status,
          triggered_at: rehearsal.triggered_at,
          trigger_source: rehearsal.trigger_source
        }
      })
    }

    // Trigger succession
    const { data: updated, error: updateError } = await supabase
      .from('succession_rehearsals')
      .update({
        status: 'triggered',
        triggered_at: new Date().toISOString(),
        trigger_source: 'blockchain_sarcophagus_simulation'
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
      message: 'Succession triggered successfully',
      rehearsal: {
        id: updated.id,
        test_marker_id: updated.test_marker_id,
        status: updated.status,
        triggered_at: updated.triggered_at,
        trigger_source: updated.trigger_source
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
        triggered_at: rehearsal.triggered_at,
        trigger_source: rehearsal.trigger_source,
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
