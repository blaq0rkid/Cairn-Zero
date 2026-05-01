
import { NextResponse } from 'next/server'
import Arweave from 'arweave'

/**
 * Arweave Gateway Health Check
 * Verifies connectivity to Arweave network
 */
export async function GET() {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    })

    const networkInfo = await arweave.network.getInfo()

    return NextResponse.json({
      success: true,
      gateway: 'https://arweave.net',
      connected: true,
      networkInfo: {
        network: networkInfo.network,
        version: networkInfo.version,
        height: networkInfo.height,
        current: networkInfo.current,
        blocks: networkInfo.blocks
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Arweave gateway error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to connect to Arweave gateway',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
