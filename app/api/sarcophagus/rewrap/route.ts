
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Verify user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ethereum_address')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // In production, this would interact with Sarcophagus v2 smart contracts
    // to extend the "resurrection time" (rewrap the sarcophagus)
    
    // For now, we'll update the check-in timestamp
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        last_checkin_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Check-in recorded successfully',
      nextCheckIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    })
  } catch (error) {
    console.error('Rewrap error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
