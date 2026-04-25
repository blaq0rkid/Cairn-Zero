
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { successorEmail, successorName, founderEmail } = await request.json()

  // Generate invitation token
  const invitationToken = crypto.randomUUID()
  
  // Update successor record with token and notification timestamp
  const { error: updateError } = await supabase
    .from('successors')
    .update({ 
      invitation_token: invitationToken,
      notified_at: new Date().toISOString()
    })
    .eq('email', successorEmail)
    .eq('founder_id', session.user.id)

  if (updateError) {
    console.error('Database update error:', updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/successor/accept/${invitationToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: `Cairn Zero <${process.env.RESEND_FROM_EMAIL}>`,
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
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #2563eb;">Terms of Service</a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #2563eb;">Privacy Policy</a>
            </p>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json({ error: 'Failed to send invitation email', details: error }, { status: 500 })
    }

    console.log('Email sent successfully:', data)
    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send invitation email', details: error.message }, { status: 500 })
  }
}
