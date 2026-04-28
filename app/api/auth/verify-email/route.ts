
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    // Verify the code
    const { data: verification, error: verifyError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (verifyError || !verification) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    let userId = existingProfile?.id

    if (!existingProfile) {
      // Create new profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          email,
          email_verified: true,
          email_verified_at: new Date().toISOString()
        })
        .select()
        .single()

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 })
      }

      userId = newProfile.id

      // Create onboarding gate
      await supabase
        .from('onboarding_gates')
        .insert({
          founder_id: userId,
          email_verified: true
        })
    } else {
      // Update existing profile
      await supabase
        .from('profiles')
        .update({
          email_verified: true,
          email_verified_at: new Date().toISOString()
        })
        .eq('id', userId)

      // Update onboarding gate
      await supabase
        .from('onboarding_gates')
        .update({ email_verified: true })
        .eq('founder_id', userId)
    }

    // Delete used verification code
    await supabase
      .from('email_verifications')
      .delete()
      .eq('id', verification.id)

    return NextResponse.json({ 
      success: true,
      userId 
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
