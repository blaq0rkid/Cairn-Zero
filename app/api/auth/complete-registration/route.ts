
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { 
      userId, 
      credentialId, 
      publicKey, 
      transports,
      authenticatorData,
      clientDataJSON
    } = await req.json()

    // Verify user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse authenticator data for device metadata
    const authDataBuffer = Buffer.from(authenticatorData, 'base64url')
    const flags = authDataBuffer[32]
    const backupEligible = (flags & 0x08) !== 0
    const backupState = (flags & 0x10) !== 0

    // Store passkey (public key only - Zero-Knowledge principle)
    const { error: passkeyError } = await supabase
      .from('passkeys')
      .insert({
        user_id: userId,
        credential_id: credentialId,
        public_key: publicKey,
        transports,
        counter: 0,
        backup_eligible: backupEligible,
        backup_state: backupState,
        device_type: 'platform'
      })

    if (passkeyError) {
      return NextResponse.json({ error: passkeyError.message }, { status: 500 })
    }

    // Derive Ethereum address from public key
    const publicKeyBuffer = Buffer.from(publicKey, 'base64url')
    
    let uncompressedKey = publicKeyBuffer
    if (publicKeyBuffer[0] === 0x04) {
      uncompressedKey = publicKeyBuffer.slice(1)
    }
    
    const publicKeyHash = ethers.keccak256(uncompressedKey)
    const ethereumAddress = ethers.getAddress('0x' + publicKeyHash.slice(-40))

    // Update profile with derived wallet address
    const { error: walletError } = await supabase
      .from('profiles')
      .update({
        ethereum_address: ethereumAddress,
        wallet_derived_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (walletError) {
      return NextResponse.json({ error: walletError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      ethereumAddress 
    })
  } catch (error) {
    console.error('Complete registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
