import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ rehearsals: data })
  } catch (error) {
    console.error('Error fetching test rehearsals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rehearsals' },
      { status: 500 }
    )
  }
}
