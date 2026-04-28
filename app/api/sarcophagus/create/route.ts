import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SarcophagusClient } from '@/lib/sarcophagus/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, encryptedData, successorAddress, checkInFrequencyDays } = await req.json()

    // Get user's Ethereum address
    const { data: profile } = await supabase
      .from('profiles')
      .select('ethereum_address, email')
      .eq('id', userId)
      .single()

    if (!profile?.ethereum_address) {
      return NextResponse.json({ error: 'Wallet not derived' }, { status: 400 })
    }

    // Calculate resurrection time based on check-in frequency
    const resurrectionTime = Math.floor(Date.now() / 1000) + (checkInFrequencyDays * 24 * 60 * 60)

    // Initialize Sarcophagus client
    const sarcoClient = new SarcophagusClient(
      process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production' ? 'mainnet' : 'sepolia'
    )

    // Create Sarcophagus
    const sarcoId = await sarcoClient.createSarcophagus(profile.ethereum_address, {
      resurrectionTime,
      recipientAddress: successorAddress,
      encryptedPayload: encryptedData,
      archaeologistCount: 3 // Use 3 archaeologists for redundancy
    })

    // Store Sarcophagus ID in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        sarcophagus_id: sarcoId,
        sarcophagus_resurrection_time: new Date(resurrectionTime * 1000).toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      sarcoId,
      resurrectionTime 
    })
  } catch (error) {
    console.error('Sarcophagus creation error:', error)
    return NextResponse.json({ error: 'Failed to create Sarcophagus' }, { status: 500 })
  }
}
