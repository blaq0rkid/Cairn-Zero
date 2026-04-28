import { ethers } from 'ethers'

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

    // ========================================================================
    // SOVEREIGN WALLET DERIVATION (Manifesto §3: Immediate upon Passkey creation)
    // ========================================================================
    
    // Decode public key to derive Ethereum address
    const publicKeyBuffer = Buffer.from(publicKey, 'base64url')
    
    // Extract uncompressed public key (skip first byte if 0x04 prefix exists)
    let uncompressedKey = publicKeyBuffer
    if (publicKeyBuffer[0] === 0x04) {
      uncompressedKey = publicKeyBuffer.slice(1)
    }
    
    // Hash the public key with Keccak-256
    const publicKeyHash = ethers.keccak256(uncompressedKey)
    
    // Take last 20 bytes as Ethereum address
    const ethereumAddress = ethers.getAddress('0x' + publicKeyHash.slice(-40))

    // Update profile with derived wallet address (address only, no private key)
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
