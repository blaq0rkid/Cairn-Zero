
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Set to true for sandbox testing without hardware keys
const TESTING_MODE = true

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ 
      error: 'Unauthorized'
    }, { status: 401 })
  }

  let successorId: string
  let hardwareSignature: string | null = null
  
  try {
    const body = await request.json()
    successorId = body.successorId
    hardwareSignature = body.hardwareSignature || null
    
    if (!successorId) {
      return NextResponse.json({ 
        error: 'successorId is required'
      }, { status: 400 })
    }

    // Production mode requires hardware signature
    if (!TESTING_MODE && !hardwareSignature) {
      return NextResponse.json({ 
        error: 'Hardware signature required in production mode'
      }, { status: 403 })
    }

    if (TESTING_MODE && !hardwareSignature) {
      console.log('⚠️ TESTING MODE: Bypassing hardware signature requirement')
    }

  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request body'
    }, { status: 400 })
  }

  try {
    // Verify successor exists and belongs to user
    const { data: existingSuccessor, error: fetchError } = await supabase
      .from('successors')
      .select('id, email, full_name, status, sequence_order')
      .eq('id', successorId)
      .eq('founder_id', session.user.id)
      .single()

    if (fetchError || !existingSuccessor) {
      console.error('Successor lookup error:', fetchError)
      return NextResponse.json({ 
        error: 'Successor not found',
        details: fetchError?.message
      }, { status: 404 })
    }

    // Update successor to revoked status
    const { error: updateError } = await supabase
      .from('successors')
      .update({ 
        status: 'revoked',
        invitation_token: null,
        accessed_at: null,
        notified_at: null,
        cairn_device_id: null
      })
      .eq('id', successorId)
      .eq('founder_id', session.user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json({ 
        error: 'Database update failed',
        details: updateError.message,
        code: updateError.code
      }, { status: 500 })
    }

    console.log(`✅ Revoked successor: ${existingSuccessor.email} (Slot ${existingSuccessor.sequence_order})`)
    
    if (TESTING_MODE) {
      console.log('⚠️ TESTING MODE: Completed without hardware verification')
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Revoked ${existingSuccessor.full_name || existingSuccessor.email}`,
      testingMode: TESTING_MODE,
      revokedSuccessor: {
        id: successorId,
        email: existingSuccessor.email,
        slot: existingSuccessor.sequence_order
      }
    })
  } catch (error: any) {
    console.error('Unexpected revocation error:', error)
    return NextResponse.json({ 
      error: 'Revocation failed',
      details: error.message
    }, { status: 500 })
  }
}
