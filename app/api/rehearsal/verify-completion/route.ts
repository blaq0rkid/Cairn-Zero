export async function POST(req: NextRequest) {
  try {
    const { testMarkerId, decryptedMessage } = await req.json()

    // Get rehearsal record
    const { data: rehearsal } = await supabase
      .from('succession_rehearsals')
      .select('*')
      .eq('test_marker_id', testMarkerId)
      .single()

    if (!rehearsal) {
      return NextResponse.json({ error: 'Test marker not found' }, { status: 404 })
    }

    // Verify message was successfully decrypted (simple validation)
    if (!decryptedMessage || decryptedMessage.length < 10) {
      return NextResponse.json({ error: 'Invalid decrypted message' }, { status: 400 })
    }

    // Mark as verified
    await supabase
      .from('succession_rehearsals')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('id', rehearsal.id)

    // Update onboarding gate
    await supabase
      .from('onboarding_gates')
      .update({ rehearsal_completed: true })
      .eq('founder_id', rehearsal.founder_id)

    // Check if onboarding is complete
    const { data: gate } = await supabase
      .from('onboarding_gates')
      .select('*')
      .eq('founder_id', rehearsal.founder_id)
      .single()

    const isComplete = gate?.email_verified && 
                      gate?.passkey_created && 
                      gate?.wallet_derived && 
                      gate?.sovereignty_confirmed && 
                      gate?.successor_designated && 
                      gate?.rehearsal_completed

    if (isComplete) {
      await supabase
        .from('onboarding_gates')
        .update({
          onboarding_complete: true,
          completed_at: new Date().toISOString()
        })
        .eq('founder_id', rehearsal.founder_id)
    }

    // Notify founder of successful rehearsal
    const { data: founder } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', rehearsal.founder_id)
      .single()

    if (founder) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: founder.email,
          subject: 'Succession Rehearsal Complete ✓',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>✓ Succession Bridge Verified</h2>
              <p>Your designated successor has successfully unwrapped the test marker.</p>
              <p><strong>Status:</strong> Your succession bridge is functional and ready.</p>
              ${isComplete ? `
                <div style="background: #10B981; color: white; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <strong>Onboarding Complete!</strong><br/>
                  Your Cairn is now active and protecting your business continuity.
                </div>
              ` : ''}
            </div>
          `
        })
      })

      await supabase
        .from('succession_rehearsals')
        .update({ founder_notified: true })
        .eq('id', rehearsal.id)
    }

    return NextResponse.json({
      success: true,
      onboardingComplete: isComplete
    })
  } catch (error) {
    console.error('Rehearsal verification error:', error)
    return NextResponse.json({ error: 'Failed to verify rehearsal' }, { status: 500 })
  }
}
