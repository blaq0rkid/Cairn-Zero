
import { NextResponse } from 'next/server'
import Arweave from 'arweave'
import crypto from 'crypto'

/**
 * Verify Data Integrity from Arweave
 * Compares hash of retrieved data with original
 */
export async function POST(request: Request) {
  try {
    const { transactionId, originalHash } = await request.json()

    if (!transactionId) {
      return NextResponse.json(
        { error: 'transactionId is required' },
        { status: 400 }
      )
    }

    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    })

    // Retrieve data from Arweave
    const transaction = await arweave.transactions.getData(transactionId, {
      decode: true,
      string: true
    })

    // Calculate hash of retrieved data
    const retrievedHash = crypto
      .createHash('sha256')
      .update(transaction as string)
      .digest('hex')

    const match = originalHash ? retrievedHash === originalHash : null

    return NextResponse.json({
      success: true,
      integrityVerified: match !== false,
      transactionId,
      originalHash: originalHash || 'not_provided',
      retrievedHash,
      match: match,
      dataSize: (transaction as string).length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Integrity verification error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to verify data integrity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
