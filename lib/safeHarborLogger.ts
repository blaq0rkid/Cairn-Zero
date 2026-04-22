export async function logSafeHarborStatusChange(  
  founderId: string,  
  priorStatus: SafeHarborStatus | null,  
  newStatus: SafeHarborStatus,  
  reasonCode: string,  
  actor: string = 'system',  
  eventReferences: Record<string, any> = {}  
) {  
  const supabase = createClientComponentClient()

  const { error } = await supabase  
    .from('safe_harbor_status_log')  
    .insert({  
      founder_id: founderId,  
      timestamp: new Date().toISOString(),  
      actor,  
      prior_status: priorStatus,  
      new_status: newStatus,  
      reason_code: reasonCode,  
      event_references: eventReferences  
    })

  if (error) {  
    console.error('Failed to log Safe Harbor status change:', error)  
  }  
}  
