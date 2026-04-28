import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { founderId, successorId, encryptedData, iv, wrappedKey } = await req.json()

    // Store ONLY encrypted data (zero-knowledge compliance)
    const { data, error } = await supabase
      .from('cairns')
      .insert({
        founder_id: founderId,
        successor_id: successorId,
        encrypted_data: encryptedData,
        iv,
        wrapped_key: wrappedKey,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, cairnId: data.id })
  } catch (error) {
    console.error('Cairn creation error:', error)
    return NextResponse.json({ error: 'Failed to create Cairn' }, { status: 500 })
  }
}
