export async function POST(req: NextRequest) {
  try {
    const { testMarkerId, successorSignature } = await req.json()

    // Get rehearsal record
    const { data: rehearsal } = await supabase
      .from('succession_rehearsals')
      .select('*, successors(email)')
      .eq('test_marker_id', testMarkerId)
      .single()

    if (!rehearsal) {
      return NextResponse.json({ error: 'Test marker not found' }, { status: 404 })
    }

    if (rehearsal.status === 'unwrapped') {
      return NextResponse.json({ error: 'Test marker already unwrapped' }, { status: 400 })
    }

    // Update rehearsal status
    const { error: updateError } = await supabase
      .from('succession_rehearsals')
      .update({
        status: 'unwrapped',
        unwrapped_at: new Date().toISOString(),
        unwrap_signature: successorSignature
      })
      .eq('id', rehearsal.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Return encrypted payload and decryption key for client-side decryption
    return NextResponse.json({
      success: true,
      encryptedPayload: rehearsal.test_payload,
      decryptionKey: rehearsal.test_encryption_key
    })
  } catch (error) {
    console.error('Test marker unwrap error:', error)
    return NextResponse.json({ error: 'Failed to unwrap test marker' }, { status: 500 })
  }
}
