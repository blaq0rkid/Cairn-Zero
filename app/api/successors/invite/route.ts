
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    console.error('❌ No session found - user not authenticated')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { successorEmail, successorName, founderEmail } = await request.json()

  // Validate required fields
  if (!successorEmail || !successorName || !founderEmail) {
    console.error('❌ Missing required fields:', { successorEmail, successorName, founderEmail })
    return NextResponse.json({ 
      error: 'Missing required fields',
      message: 'successorEmail, successorName, and founderEmail are required'
    }, { status: 400 })
  }

  // Check environment variables
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const apiKey = process.env.RESEND_API_KEY

  console.log('📧 Email Configuration Check:')
  console.log('- RESEND_API_KEY exists:', !!apiKey)
  console.log('- RESEND_FROM_EMAIL:', fromEmail || '❌ MISSING')
  console.log('- NEXT_PUBLIC_APP_URL:', appUrl || '❌ MISSING')

  if (!fromEmail) {
    console.error('❌ RESEND_FROM_EMAIL is not set')
    return NextResponse.json({ 
      error: 'Server configuration error',
      message: 'Email sender address not configured'
    }, { status: 500 })
  }

  if (!appUrl) {
    console.error('❌ NEXT_PUBLIC_APP_URL is not set')
    return NextResponse.json({ 
      error: 'Server configuration error',
      message: 'Application URL not configured'
    }, { status: 500 })
  }

  // Verify sender address exactly matches
  if (fromEmail !== 'noreply@mycairnzero.com') {
    console.error('⚠️ RESEND_FROM_EMAIL mismatch:', fromEmail, 'expected: noreply@mycairnzero.com')
  }

  // Check if successor exists
  const { data: existingSuccessor, error: fetchError } = await supabase
    .from('successors')
    .select('id, invitation_token, notified_at')
    .eq('email', successorEmail)
    .eq('founder_id', session.user.id)
    .single()

  if (fetchError || !existingSuccessor) {
    console.error('❌ Successor not found:', fetchError?.message)
    return NextResponse.json({ 
      error: 'Successor not found',
      message: 'Please add the successor first before sending an invitation'
    }, { status: 404 })
  }

  // Generate new invitation token
  const invitationToken = crypto.randomUUID()
  const acceptUrl = `${appUrl}/successor/accept/${invitationToken}`
  
  console.log('🔗 Generated accept URL:', acceptUrl)

  // Update successor record
  const { error: updateError } = await supabase
    .from('successors')
    .update({ 
      invitation_token: invitationToken,
      notified_at: new Date().toISOString()
    })
    .eq('email', successorEmail)
    .eq('founder_id', session.user.id)

  if (updateError) {
    console.error('❌ Database update error:', updateError)
    return NextResponse.json({ 
      error: 'Database error',
      message: updateError.message 
    }, { status: 500 })
  }

  console.log('✅ Database updated with invitation token')

  // Prepare email data
  const emailData = {
    from: `Cairn Zero <${fromEmail}>`,
    to: successorEmail,
    subject: `${founderEmail} has designated you as a successor`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Succession Designation Notice</h1>
        </div>
        
        <div class="content">
          <p>Hello ${successorName},</p>
          
          <p><strong>${founderEmail}</strong> has designated you as a successor within the Cairn Zero system.</p>
          
          <p>This designation ensures business continuity and digital asset accessibility in the event of the Designator's incapacity or unavailability.</p>
          
          <div class="warning">
            <strong>Important:</strong> Before accepting, you must review and agree to the legal terms and disclaimers that govern this role, including fiduciary responsibilities and digital attestation requirements.
          </div>
          
          <p style="text-align: center;">
            <a href="${acceptUrl}" class="button">Review Terms & Accept Designation</a>
          </p>
          
          <p><small>If you did not expect this invitation, please ignore this email.</small></p>
        </div>
        
        <div class="footer">
          <p><strong>Legal Notice:</strong></p>
          <p>This notification is sent by Cairn Zero, a technical service provider operating under the "Certainty-Only" Principle of Zero-Knowledge Sovereignty.</p>
          
          <p><strong>Zero-Knowledge Sovereignty:</strong> Cairn Zero does not possess, manage, or have the technical ability to view the contents of the Designator's secured data. All data is encrypted client-side.</p>
          
          <p><strong>No Legal or Fiduciary Advice:</strong> This notification does not constitute legal, financial, or estate planning advice.</p>
          
          <p><strong>Sub-Processing Notice:</strong> This email is delivered via Resend, a third-party email service provider. Your contact information is used solely for maintaining this succession bridge.</p>
          
          <p><strong>Privacy:</strong> Your email address and designation details are processed in accordance with our Privacy Policy and the Succession Notification Terms.</p>
          
          <hr style="border: none; border-top: 1px solid #d1d5db; margin: 20px 0;">
          
          <p style="text-align: center; margin: 0;">
            <strong>Cairn Zero</strong><br>
            Certainty-Only. Zero-Knowledge Sovereignty.<br>
            <a href="${appUrl}/terms" style="color: #2563eb;">Terms of Service</a> | 
            <a href="${appUrl}/privacy" style="color: #2563eb;">Privacy Policy</a>
          </p>
        </div>
      </body>
      </html>
    `
  }

  console.log('📧 Sending email with Resend...')
  console.log('- From:', emailData.from)
  console.log('- To:', emailData.to)
  console.log('- Accept URL:', acceptUrl)

  try {
    const { data, error } = await resend.emails.send(emailData)

    if (error) {
      console.error('❌ Resend API Error:')
      console.error('- Error Name:', error.name)
      console.error('- Error Message:', error.message)
      console.error('- Full Error:', JSON.stringify(error, null, 2))
      
      return NextResponse.json({ 
        error: 'Email sending failed',
        details: error.message,
        resendError: error.name,
        statusCode: (error as any).statusCode || 'unknown'
      }, { status: 500 })
    }

    console.log('✅ Email sent successfully!')
    console.log('- Email ID:', data?.id)
    console.log('- Response:', JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      emailId: data?.id,
      message: 'Invitation sent successfully'
    })
  } catch (error: any) {
    console.error('❌ Unexpected error sending email:')
    console.error('- Error Type:', error.constructor.name)
    console.error('- Error Message:', error.message)
    console.error('- Stack:', error.stack)
    
    return NextResponse.json({ 
      error: 'Failed to send invitation email',
      details: error.message,
      type: error.constructor.name
    }, { status: 500 })
  }
}
