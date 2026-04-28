
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { testMarkerId, decryptedMessage } = await req.json()

    // Verify test marker exists and was unwrapped
    const { data: rehearsal, error: rehearsalError } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .eq('test_marker_id', testMarkerId)
      .eq('status', 'unwrapped')
      .single()

    if (rehearsalError || !rehearsal) {
      return NextResponse.json({ error: 'Test marker not found or not unwrapped' }, { status: 404 })
    }

    // Update to verified status
    const { error: updateError } = await supabase
      .from('succession_rehearsals')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        founder_notified: true
      })
      .eq('id', rehearsal.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Mark onboarding complete
    await supabase
      .from('onboarding_gates')
      .update({ 
        rehearsal_completed: true,
        onboarding_complete: true,
        completed_at: new Date().toISOString()
      })
      .eq('founder_id', rehearsal.founder_id)

    return NextResponse.json({ 
      success: true,
      message: 'Rehearsal verified successfully'
    })
  } catch (error) {
    console.error('Verify completion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
