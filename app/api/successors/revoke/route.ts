
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// TESTING MODE - Bypass hardware signature requirement
// Set to false when YubiKeys are in production
const TESTING_MODE = true

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    console.error('❌ No session found')
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
      console.error('❌ Missing successorId')
      return NextResponse.json({ 
        error: 'successorId is required'
      }, { status: 400 })
    }

    // Production mode requires hardware signature
    if (!TESTING_MODE && !hardwareSignature) {
      console.error('❌ Hardware signature required but not provided')
      return NextResponse.json({ 
        error: 'Hardware signature required',
        message: 'Physical hardware key verification is required in production mode'
      }, { status: 403 })
    }

    if (TESTING_MODE && !hardwareSignature) {
      console.log('⚠️ TESTING MODE: Bypassing hardware signature requirement')
    }

  } catch (error) {
    console.error('❌ Invalid request body:', error)
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
      console.error('❌ Successor lookup error:', fetchError)
      return NextResponse.json({ 
        error: 'Successor not found',
        message: 'This successor does not exist or does not belong to you',
        details: fetchError?.message
      }, { status: 404 })
    }

    console.log(`🔍 Found successor: ${existingSuccessor.email} (Slot ${existingSuccessor.sequence_order})`)

    // Delete the successor record completely
    const { error: deleteError } = await supabase
      .from('successors')
      .delete()
      .eq('id', successorId)
      .eq('founder_id', session.user.id)

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError)
      return NextResponse.json({ 
        error: 'Database error',
        message: 'Failed to delete successor record',
        details: deleteError.message,
        code: deleteError.code
      }, { status: 500 })
    }

    console.log(`✅ Successfully deleted successor: ${existingSuccessor.email} from Slot ${existingSuccessor.sequence_order}`)
    
    if (TESTING_MODE) {
      console.log('⚠️ TESTING MODE: Deletion completed without hardware verification')
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully removed ${existingSuccessor.full_name || existingSuccessor.email} from Slot ${existingSuccessor.sequence_order}`,
      testingMode: TESTING_MODE,
      deletedSuccessor: {
        id: successorId,
        email: existingSuccessor.email,
        slot: existingSuccessor.sequence_order
      }
    })
  } catch (error: any) {
    console.error('❌ Unexpected error during deletion:', error)
    return NextResponse.json({ 
      error: 'Deletion failed',
      message: 'An unexpected error occurred',
      details: error.message
    }, { status: 500 })
  }
}
