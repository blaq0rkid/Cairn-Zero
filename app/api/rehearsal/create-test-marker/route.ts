import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { encryptData, generateKeyPair, exportPublicKey } from '@/lib/encryption'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { founderId, successorId, testMessage } = await req.json()

    // Verify founder and successor
    const { data: founder } = await supabase
      .from('profiles')
      .select('id, ethereum_address')
      .eq('id', founderId)
      .single()

    const { data: successor } = await supabase
      .from('successors')
      .select('id, email')
      .eq('id', successorId)
      .eq('founder_id', founderId)
      .single()

    if (!founder || !successor) {
      return NextResponse.json({ error: 'Invalid founder or successor' }, { status: 404 })
    }

    // Generate encryption key pair for test
    const keyPair = await generateKeyPair()
    const publicKeyExported = await exportPublicKey(keyPair.publicKey)

    // Encrypt test message (client-side encryption simulation)
    const encryptedPayload = await encryptData(
      testMessage || 'This is a test succession marker. If you can read this, the succession bridge is functional.',
      keyPair.publicKey
    )

    // Generate unique test marker ID
    const testMarkerId = `TEST-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Create rehearsal record
    const { data: rehearsal, error: rehearsalError } = await supabase
      .from('succession_rehearsals')
      .insert({
        founder_id: founderId,
        successor_id: successorId,
        test_marker_id: testMarkerId,
        test_payload: encryptedPayload,
        test_encryption_key: publicKeyExported,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .select()
      .single()

    if (rehearsalError) {
      return NextResponse.json({ error: rehearsalError.message }, { status: 500 })
    }

    // Send email notification to successor
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: successor.email,
        subject: 'Succession Rehearsal: Test Marker Available',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Succession Rehearsal</h2>
            <p>You have been designated as a successor. A test marker has been created to verify the succession bridge.</p>
            <p><strong>Test Marker ID:</strong> ${testMarkerId}</p>
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/rehearsal/unwrap/${testMarkerId}" 
                 style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Unwrap Test Marker
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This is a rehearsal to ensure the succession system works correctly. No real data is at risk.
            </p>
          </div>
        `
      })
    })

    // Update onboarding gate
    await supabase
      .from('onboarding_gates')
      .update({ successor_designated: true })
      .eq('founder_id', founderId)

    return NextResponse.json({
      success: true,
      testMarkerId,
      rehearsalId: rehearsal.id
    })
  } catch (error) {
    console.error('Test marker creation error:', error)
    return NextResponse.json({ error: 'Failed to create test marker' }, { status: 500 })
  }
}
