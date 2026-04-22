type SafeHarborStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'VOID'

interface SafeHarborState {  
  status: SafeHarborStatus  
  reason?: string  
  lastChecked: Date  
}

function calculateSafeHarborStatus(  
  successors: Successor[],  
  successionPlaybook: SuccessionPlaybook,  
  subscriptionStatus: SubscriptionStatus,  
  separationAttestation: SeparationAttestation | null,  
  heartbeat: Heartbeat  
): SafeHarborState {  
    
  // VOID: Missing critical prerequisites  
  if (successors.length === 0) {  
    return {  
      status: 'VOID',  
      reason: 'No successors designated',  
      lastChecked: new Date()  
    }  
  }

  if (!successionPlaybook.isComplete) {  
    return {  
      status: 'VOID',  
      reason: 'Succession Playbook incomplete',  
      lastChecked: new Date()  
    }  
  }

  // SUSPENDED: Non-compliance triggers (Section 6)  
    
  // Check 7-Day Separation Attestation (Section 2.3)  
  if (!separationAttestation || !separationAttestation.isSigned) {  
    const deliveryDate = new Date(successionPlaybook.hardwareDeliveryDate)  
    const attestationDeadline = new Date(deliveryDate.getTime() + (168 * 60 * 60 * 1000)) // 168 hours = 7 days  
      
    if (new Date() > attestationDeadline) {  
      return {  
        status: 'SUSPENDED',  
        reason: 'SEPARATION_ATTESTATION_EXPIRED',  
        lastChecked: new Date()  
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
  const heartbeatWindow = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds  
  const lastHeartbeat = new Date(heartbeat.lastCheckedAt)  
  const heartbeatExpiry = new Date(lastHeartbeat.getTime() + heartbeatWindow)  
    
  if (new Date() > heartbeatExpiry) {  
    return {  
      status: 'SUSPENDED',  
      reason: 'HEARTBEAT_LAPSED',  
      lastChecked: new Date()  
    }  
  }

  // ACTIVE: All conditions met (Section 6)  
  if (  
    successors.length > 0 &&  
    successionPlaybook.isComplete &&  
    subscriptionStatus === 'CURRENT' &&  
    separationAttestation?.isSigned &&  
    new Date() <= heartbeatExpiry  
  ) {  
    return {  
      status: 'ACTIVE',  
      lastChecked: new Date()  
    }  
  }

  // PENDING: Prerequisites incomplete but no disqualifying breach  
  return {  
    status: 'PENDING',  
    reason: 'One or more prerequisites incomplete',  
    lastChecked: new Date()  
  }  
}  
