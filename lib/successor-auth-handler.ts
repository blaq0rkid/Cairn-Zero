
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface SuccessorLinkResult {
  success: boolean
  error?: string
  successorId?: string
  needsLinking?: boolean
}

/**
 * Links an authenticated user to their successor record
 * Handles race conditions and ensures successor_id is populated
 */
export async function linkSuccessorToAuth(email: string): Promise<SuccessorLinkResult> {
  const supabase = createClientComponentClient()
  
  try {
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'Not authenticated',
        needsLinking: true 
      }
    }

//     console.log('🔗 Attempting to link successor record for:', email)
//     console.log('🔑 Auth UID:', user.id)

    // Find successor record by email
    const { data: successor, error: lookupError } = await supabase
      .from('successors')
      .select('id, successor_id, email, status, legal_accepted_at')
      .eq('email', email)
      .single()

    if (lookupError || !successor) {
      console.error('❌ Successor record not found:', lookupError)
      return { 
        success: false, 
        error: 'Successor record not found for this email',
        needsLinking: false 
      }
    }

    // Check if already linked
    if (successor.successor_id === user.id) {
//       console.log('✅ Successor already linked to auth user')
      return { 
        success: true, 
        successorId: successor.id,
        needsLinking: false 
      }
    }

    // Link the successor_id to the authenticated user
//     console.log('🔄 Linking successor_id to auth.uid()...')
    const { data: updated, error: updateError } = await supabase
      .from('successors')
      .update({ successor_id: user.id })
      .eq('id', successor.id)
      .select()

    if (updateError) {
      console.error('❌ Failed to link successor_id:', updateError)
      return { 
        success: false, 
        error: `Failed to link account: ${updateError.message}`,
        needsLinking: true 
      }
    }

//     console.log('✅ Successfully linked successor to auth user:', updated)
    return { 
      success: true, 
      successorId: successor.id,
      needsLinking: false 
    }

  } catch (err: any) {
    console.error('❌ Unexpected error during linking:', err)
    return { 
      success: false, 
      error: `Unexpected error: ${err.message}`,
      needsLinking: true 
    }
  }
}

/**
 * Verifies successor has proper access
 * Returns the successor record if valid, null otherwise
 */
export async function verifySuccessorAccess(userId: string) {
  const supabase = createClientComponentClient()

  try {
    const { data: successor, error } = await supabase
      .from('successors')
      .select('*, profiles!successors_founder_id_fkey(email, full_name)')
      .eq('successor_id', userId)
      .single()

    if (error || !successor) {
//       console.log('⚠️ No successor record found for user:', userId)
      return null
    }

    if (successor.status !== 'active' || !successor.legal_accepted_at) {
//       console.log('⚠️ Successor not active or not accepted')
      return null
    }

    return successor

  } catch (err) {
    console.error('Error verifying successor access:', err)
    return null
  }
}
