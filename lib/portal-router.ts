
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type PortalContext = 'founder' | 'successor' | 'dual' | 'unknown'

interface PortalRouteDecision {
  context: PortalContext
  shouldRouteToSuccessor: boolean
  shouldRouteToFounder: boolean
  redirectPath: string | null
  debug: {
    hasFounderRecord: boolean
    hasSuccessorRecord: boolean
    successorStatus: string | null
    sessionContext: string | null
  }
}

/**
 * Determines the correct portal routing for a user who may have multiple roles
 * Honors the current session context and prevents portal identity crisis
 */
export async function determinePortalRoute(
  userId: string,
  email: string,
  currentPath: string
): Promise<PortalRouteDecision> {
  const supabase = createClientComponentClient()
  
  // Check for explicit session context flag
  const sessionContext = sessionStorage.getItem('portal_context')
  
  console.log('🔍 Portal Route Decision:')
  console.log('  User ID:', userId)
  console.log('  Email:', email)
  console.log('  Current Path:', currentPath)
  console.log('  Session Context:', sessionContext)

  // Check for founder record
  const { data: founderProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  // Check for successor record
  const { data: successorRecord } = await supabase
    .from('successors')
    .select('id, status, legal_accepted_at, successor_id')
    .eq('email', email)
    .single()

  const hasFounderRecord = !!founderProfile
  const hasSuccessorRecord = !!successorRecord
  
  console.log('  Has Founder Record:', hasFounderRecord)
  console.log('  Has Successor Record:', hasSuccessorRecord)
  console.log('  Successor Status:', successorRecord?.status)

  // RULE 1: Explicit session context always wins
  if (sessionContext === 'successor' && hasSuccessorRecord) {
    console.log('✅ Session context: SUCCESSOR (explicit)')
    return {
      context: 'successor',
      shouldRouteToSuccessor: true,
      shouldRouteToFounder: false,
      redirectPath: currentPath.startsWith('/successor') ? null : '/successor',
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: successorRecord?.status || null,
        sessionContext
      }
    }
  }

  if (sessionContext === 'founder' && hasFounderRecord) {
    console.log('✅ Session context: FOUNDER (explicit)')
    return {
      context: 'founder',
      shouldRouteToSuccessor: false,
      shouldRouteToFounder: true,
      redirectPath: currentPath.startsWith('/dashboard') ? null : '/dashboard',
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: successorRecord?.status || null,
        sessionContext
      }
    }
  }

  // RULE 2: Current path context (respect where they are)
  if (currentPath.startsWith('/successor') && hasSuccessorRecord) {
    console.log('✅ Respecting successor path context')
    sessionStorage.setItem('portal_context', 'successor')
    return {
      context: 'successor',
      shouldRouteToSuccessor: true,
      shouldRouteToFounder: false,
      redirectPath: null,
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: successorRecord?.status || null,
        sessionContext: 'successor'
      }
    }
  }

  if (currentPath.startsWith('/dashboard') && hasFounderRecord) {
    console.log('✅ Respecting founder path context')
    sessionStorage.setItem('portal_context', 'founder')
    return {
      context: 'founder',
      shouldRouteToSuccessor: false,
      shouldRouteToFounder: true,
      redirectPath: null,
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: successorRecord?.status || null,
        sessionContext: 'founder'
      }
    }
  }

  // RULE 3: Both roles exist - default to founder, set dual context
  if (hasFounderRecord && hasSuccessorRecord) {
    console.log('⚠️ Dual role detected - defaulting to founder')
    sessionStorage.setItem('portal_context', 'founder')
    return {
      context: 'dual',
      shouldRouteToSuccessor: false,
      shouldRouteToFounder: true,
      redirectPath: '/dashboard',
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: successorRecord?.status || null,
        sessionContext: 'founder'
      }
    }
  }

  // RULE 4: Only successor record
  if (hasSuccessorRecord && !hasFounderRecord) {
    console.log('✅ Successor only')
    sessionStorage.setItem('portal_context', 'successor')
    return {
      context: 'successor',
      shouldRouteToSuccessor: true,
      shouldRouteToFounder: false,
      redirectPath: '/successor',
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: successorRecord?.status || null,
        sessionContext: 'successor'
      }
    }
  }

  // RULE 5: Only founder record
  if (hasFounderRecord && !hasSuccessorRecord) {
    console.log('✅ Founder only')
    sessionStorage.setItem('portal_context', 'founder')
    return {
      context: 'founder',
      shouldRouteToSuccessor: false,
      shouldRouteToFounder: true,
      redirectPath: '/dashboard',
      debug: {
        hasFounderRecord,
        hasSuccessorRecord,
        successorStatus: null,
        sessionContext: 'founder'
      }
    }
  }

  // RULE 6: No records found
  console.log('❌ No portal records found')
  return {
    context: 'unknown',
    shouldRouteToSuccessor: false,
    shouldRouteToFounder: false,
    redirectPath: '/login',
    debug: {
      hasFounderRecord,
      hasSuccessorRecord,
      successorStatus: null,
      sessionContext: null
    }
  }
}
