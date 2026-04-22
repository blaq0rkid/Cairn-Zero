
// Safe Harbor Status Types and Calculation Logic

export type SafeHarborStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'VOID'

export interface SafeHarborState {
  status: SafeHarborStatus
  reason?: string
  lastChecked: Date
}

export interface Successor {
  id: string
  founder_id: string
  name: string
  email: string
  slot_number: number
  status: string
  created_at: string
}

export interface SuccessionPlaybook {
  id: string
  founder_id: string
  is_complete: boolean
  hardware_delivery_date: string | null
  last_dry_run_at: string | null
  created_at: string
  updated_at: string
}

export interface SeparationAttestation {
  id: string
  founder_id: string
  playbook_id: string
  is_signed: boolean
  signed_at: string | null
  attestation_text: string
  created_at: string
}

export interface Heartbeat {
  id: string
  founder_id: string
  last_checked_at: string
  check_type: string
  created_at: string
}

export type SubscriptionStatus = 'CURRENT' | 'DELINQUENT' | 'SUSPENDED'

export function calculateSafeHarborStatus(
  successors: Successor[],
  successionPlaybook: SuccessionPlaybook | null,
  subscriptionStatus: SubscriptionStatus,
  separationAttestation: SeparationAttestation | null,
  heartbeat: Heartbeat | null
): SafeHarborState {
  
  // VOID: Missing critical prerequisites
  if (successors.length === 0) {
    return {
      status: 'VOID',
      reason: 'No successors designated',
      lastChecked: new Date()
    }
  }

  if (!successionPlaybook || !successionPlaybook.is_complete) {
    return {
      status: 'VOID',
      reason: 'Succession Playbook incomplete',
      lastChecked: new Date()
    }
  }

  // SUSPENDED: Non-compliance triggers (Section 6)
  
  // Check 7-Day Separation Attestation (Section 2.3)
  if (!separationAttestation || !separationAttestation.is_signed) {
    if (successionPlaybook.hardware_delivery_date) {
      const deliveryDate = new Date(successionPlaybook.hardware_delivery_date)
      const attestationDeadline = new Date(deliveryDate.getTime() + (168 * 60 * 60 * 1000)) // 168 hours = 7 days
      
      if (new Date() > attestationDeadline) {
        return {
          status: 'SUSPENDED',
          reason: 'SEPARATION_ATTESTATION_EXPIRED',
          lastChecked: new Date()
        }
      }
    }
  }

  // Check subscription status
  if (subscriptionStatus !== 'CURRENT') {
    // Note: During 90-day Suspension Grace, Safe Harbor is NOT Active
    // but vaults remain protected (Section 4.2)
    return {
      status: 'SUSPENDED',
      reason: 'SUBSCRIPTION_DELINQUENT',
      lastChecked: new Date()
    }
  }

  // Check heartbeat status (Section 4.1)
  if (heartbeat) {
    const heartbeatWindow = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    const lastHeartbeat = new Date(heartbeat.last_checked_at)
    const heartbeatExpiry = new Date(lastHeartbeat.getTime() + heartbeatWindow)
    
    if (new Date() > heartbeatExpiry) {
      return {
        status: 'SUSPENDED',
        reason: 'HEARTBEAT_LAPSED',
        lastChecked: new Date()
      }
    }
  }

  // ACTIVE: All conditions met (Section 6)
  if (
    successors.length > 0 &&
    successionPlaybook.is_complete &&
    subscriptionStatus === 'CURRENT' &&
    separationAttestation?.is_signed &&
    heartbeat
  ) {
    const heartbeatWindow = 30 * 24 * 60 * 60 * 1000
    const lastHeartbeat = new Date(heartbeat.last_checked_at)
    const heartbeatExpiry = new Date(lastHeartbeat.getTime() + heartbeatWindow)
    
    if (new Date() <= heartbeatExpiry) {
      return {
        status: 'ACTIVE',
        lastChecked: new Date()
      }
    }
  }

  // PENDING: Prerequisites incomplete but no disqualifying breach
  return {
    status: 'PENDING',
    reason: 'One or more prerequisites incomplete',
    lastChecked: new Date()
  }
}
