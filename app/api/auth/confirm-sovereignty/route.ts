
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Update sovereignty confirmation
    const { error } = await supabase
      .from('profiles')
      .update({ 
        sovereignty_confirmed: true,
        sovereignty_confirmed_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update onboarding gate
    await supabase
      .from('onboarding_gates')
      .update({ sovereignty_confirmed: true })
      .eq('founder_id', userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sovereignty confirmation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
