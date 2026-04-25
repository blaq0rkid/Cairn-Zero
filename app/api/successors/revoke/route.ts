
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ 
      error: 'Unauthorized',
      message: 'You must be logged in to revoke a successor'
    }, { status: 401 })
  }

  let successorId: string
  
  try {
    const body = await request.json()
    successorId = body.successorId
    
    if (!successorId) {
      return NextResponse.json({ 
        error: 'Bad Request',
        message: 'successorId is required'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Bad Request',
      message: 'Invalid JSON in request body'
    }, { status: 400 })
  }

  try {
    // Verify the successor exists and belongs to this user
    const { data: existingSuccessor, error: fetchError } = await supabase
      .from('successors')
      .select('id, email, full_name, status')
      .eq('id', successorId)
      .eq('founder_id', session.user.id)
      .single()

    if (fetchError || !existingSuccessor) {
      console.error('Successor lookup error:', fetchError)
      return NextResponse.json({ 
        error: 'Not Found',
        message: 'Successor not found or does not belong to you',
        details: fetchError?.message
      }, { status: 404 })
    }

    // Update successor status to revoked and clear all data
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
        error: 'Database Error',
        message: 'Failed to update successor record',
        details: updateError.message,
        code: updateError.code
      }, { status: 500 })
    }

    console.log(`Successfully revoked successor: ${existingSuccessor.email} (${successorId})`)
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully revoked ${existingSuccessor.full_name || existingSuccessor.email}`,
      revokedSuccessor: {
        id: successorId,
        email: existingSuccessor.email
      }
    })
  } catch (error: any) {
    console.error('Unexpected revocation error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during revocation',
      details: error.message
    }, { status: 500 })
  }
}
