
import { NextRequest, NextResponse } from 'next/server'
import { SarcophagusSuccessionBridge } from '@/lib/sarcophagus/succession-bridge'
import { createClient } from '@supabase/supabase-js'

/**
 * Blockchain Succession Trigger API
 * Handles real-world succession events from Sarcophagus v2
 */

export async function POST(request: NextRequest) {
  try {
    const { cairnId, sarcophagusId, network } = await request.json()

    if (!cairnId || !sarcophagusId) {
      return NextResponse.json(
        { error: 'Missing cairnId or sarcophagusId' },
        { status: 400 }
      )
    }

    const bridge = new SarcophagusSuccessionBridge(network || 'sepolia')
    
    // Monitor heartbeat and trigger if conditions met
    await bridge.monitorHeartbeat(cairnId)

    return NextResponse.json({
      success: true,
      message: 'Heartbeat monitored and succession triggered if applicable',
      cairnId,
      sarcophagusId
    })

  } catch (error) {
    console.error('Blockchain succession trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to process blockchain succession trigger' },
      { status: 500 }
    )
  }
}

/**
 * Get Succession Status
 * Checks current blockchain state for a cairn
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cairnId = searchParams.get('cairnId')
    const network = searchParams.get('network') as 'mainnet' | 'sepolia' || 'sepolia'

    if (!cairnId) {
      return NextResponse.json(
        { error: 'Missing cairnId parameter' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: cairn, error } = await supabase
      .from('cairns')
      .select('*, succession_rehearsals(*)')
      .eq('id', cairnId)
      .single()

    if (error || !cairn) {
      return NextResponse.json(
        { error: 'Cairn not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      cairnId: cairn.id,
      sarcophagusId: cairn.sarcophagus_id,
      blockchainNetwork: cairn.blockchain_network,
      resurrectionTime: cairn.resurrection_time,
      successionStatus: cairn.succession_rehearsals?.[0]?.status || 'pending',
      triggeredAt: cairn.succession_rehearsals?.[0]?.triggered_at,
    })

  } catch (error) {
    console.error('Get succession status error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve succession status' },
      { status: 500 }
    )
  }
}
