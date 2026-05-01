
import { NextResponse } from 'next/server'
import Arweave from 'arweave'

/**
 * Check Arweave Transaction Status
 * Verifies if transaction is confirmed on blockchain
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const txId = searchParams.get('txId')

    if (!txId) {
      return NextResponse.json(
        { error: 'txId parameter is required' },
        { status: 400 }
      )
    }

    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    })

    // Get transaction status
    const status = await arweave.transactions.getStatus(txId)

    if (status.status === 200) {
      return NextResponse.json({
        success: true,
        transactionId: txId,
        status: 'confirmed',
        blockHeight: status.confirmed?.block_height,
        confirmations: status.confirmed?.number_of_confirmations,
        timestamp: new Date().toISOString()
      })
    } else if (status.status === 202) {
      return NextResponse.json({
        success: true,
        transactionId: txId,
        status: 'pending',
        message: 'Transaction submitted but not yet confirmed',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        transactionId: txId,
        status: 'not_found',
        httpStatus: status.status,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Transaction status error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check transaction status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
