
import { NextResponse } from 'next/server'
import { verifyInfuraConnection, getNetworkStatus } from '@/lib/ethereum/config'

/**
 * Ethereum Network Status Check
 * Tests Infura connection and returns network information
 */
export async function GET() {
  try {
    const network = (process.env.ETHEREUM_NETWORK || 'sepolia') as 'mainnet' | 'sepolia' | 'polygon'
    
    // Test connection
    const isConnected = await verifyInfuraConnection(network)
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to Ethereum network',
          network,
          infuraConfigured: !!process.env.INFURA_API_KEY
        },
        { status: 500 }
      )
    }

    // Get network details
    const status = await getNetworkStatus(network)

    return NextResponse.json({
      success: true,
      connected: true,
      network: status.network,
      chainId: status.chainId,
      currentBlock: status.blockNumber,
      gasPrice: status.gasPrice ? `${status.gasPrice} gwei` : 'N/A',
      infuraKey: process.env.INFURA_API_KEY ? 'Configured ✓' : 'Missing ✗',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Ethereum status check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve network status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
