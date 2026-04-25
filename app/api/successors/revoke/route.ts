
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { successorId } = await request.json()

  try {
    // Update successor status to revoked and clear sensitive data
    const { error: updateError } = await supabase
      .from('successors')
      .update({ 
        status: 'revoked',
        invitation_token: null,
        accessed_at: null,
        digital_attestation_signed_at: null,
        cairn_device_id: null
      })
      .eq('id', successorId)
      .eq('founder_id', session.user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Revocation error:', error)
    return NextResponse.json({ error: 'Failed to revoke successor' }, { status: 500 })
  }
}
