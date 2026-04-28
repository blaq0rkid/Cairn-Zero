
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { testMarkerId, successorSignature } = await req.json()

    // Verify test marker exists
    const { data: rehearsal, error: rehearsalError } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .eq('test_marker_id', testMarkerId)
      .single()

    if (rehearsalError || !rehearsal) {
      return NextResponse.json({ error: 'Test marker not found' }, { status: 404 })
    }

    // Update rehearsal status
    const { error: updateError } = await supabase
      .from('succession_rehearsals')
      .update({
        status: 'unwrapped',
        unwrapped_at: new Date().toISOString(),
        successor_signature: successorSignature
      })
      .eq('id', rehearsal.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update onboarding gate
    await supabase
      .from('onboarding_gates')
      .update({ rehearsal_completed: true })
      .eq('founder_id', rehearsal.founder_id)

    // Notify founder of successful rehearsal
    // (Email sending would happen here via Resend)

    return NextResponse.json({ 
      success: true,
      message: 'Test marker unwrapped successfully',
      payload: rehearsal.test_payload
    })
  } catch (error) {
    console.error('Unwrap test marker error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
