
import { NextResponse } from 'next/server'
import { verifySarcophagusContract, getNetworkStatus } from '@/lib/ethereum/config'

/**
 * Sarcophagus Diamond Contract Verification
 * Tests connectivity to Sarcophagus v2 protocol
 */
export async function GET() {
  try {
    const network = (process.env.ETHEREUM_NETWORK || 'sepolia') as 'mainnet' | 'sepolia'
    
    // Get network status
    const status = await getNetworkStatus(network)
    
    // Verify Sarcophagus contract
    const isContractValid = await verifySarcophagusContract(network)

    return NextResponse.json({
      success: true,
      network: status.network,
      chainId: status.chainId,
      currentBlock: status.blockNumber,
      sarcophagus: {
        diamondContract: status.sarcophagusDiamond,
        verified: isContractValid,
        status: isContractValid ? 'Contract found and operational' : 'Contract not found or invalid'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Sarcophagus verification error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to verify Sarcophagus contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
