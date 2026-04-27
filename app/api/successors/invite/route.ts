
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    console.error('❌ No session found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { successorEmail, successorName, founderEmail } = await request.json()

  // Validate required fields
  if (!successorEmail || !successorName || !founderEmail) {
    console.error('❌ Missing required fields')
    return NextResponse.json({ 
      error: 'Missing required fields'
    }, { status: 400 })
  }

  // Environment variable validation
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const apiKey = process.env.RESEND_API_KEY

  //console.log('🔍 Environment Check:')
  //console.log('- API Key exists:', !!apiKey)
  //console.log('- From Email:', fromEmail || '❌ MISSING')
  //console.log('- App URL:', appUrl || '❌ MISSING')

  if (!fromEmail || fromEmail !== 'noreply@mycairnzero.com') {
    console.error('❌ Invalid RESEND_FROM_EMAIL:', fromEmail)
    return NextResponse.json({ 
      error: 'Email configuration error',
      message: 'Sender email must be noreply@mycairnzero.com'
    }, { status: 500 })
  }

  if (!appUrl) {
    console.error('❌ NEXT_PUBLIC_APP_URL not set')
    return NextResponse.json({ 
      error: 'URL configuration error'
    }, { status: 500 })
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
      error: 'Successor not found'
    }, { status: 404 })
  }

  // Generate invitation token
  const invitationToken = crypto.randomUUID()
  const acceptUrl = `${appUrl}/successor/accept/${invitationToken}`
  
  //console.log('🔗 Accept URL:', acceptUrl)

  // Update database
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

  //console.log('✅ Database updated')

  // Send email
  try {
    //console.log('📧 Sending email...')
//     console.log('- From:', `Cairn Zero <${fromEmail}>`)
//     console.log('- To:', successorEmail)

    const { data, error } = await resend.emails.send({
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
              <strong>Important:</strong> Before accepting, you must review and agree to the legal terms and disclaimers that govern this role.
            </div>
            
            <p style="text-align: center;">
              <a href="${acceptUrl}" class="button">Review Terms & Accept Designation</a>
            </p>
            
            <p><small>If you did not expect this invitation, please ignore this email.</small></p>
          </div>
          
          <div class="footer">
            <p><strong>Cairn Zero</strong> - Certainty-Only. Zero-Knowledge Sovereignty.</p>
            <p style="margin-top: 10px;">
              <a href="${appUrl}/terms" style="color: #2563eb;">Terms</a> | 
              <a href="${appUrl}/privacy" style="color: #2563eb;">Privacy</a>
            </p>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      console.error('❌ Resend Error:')
      console.error('- Name:', error.name)
      console.error('- Message:', error.message)
      console.error('- Full:', JSON.stringify(error, null, 2))
      
      return NextResponse.json({ 
        error: 'Email sending failed',
        details: error.message,
        resendError: error.name
      }, { status: 500 })
    }

//     console.log('✅ Email sent successfully')
//     console.log('- Email ID:', data?.id)
    
    return NextResponse.json({ 
      success: true, 
      emailId: data?.id
    })
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    
    return NextResponse.json({ 
      error: 'Email sending failed',
      details: error.message
    }, { status: 500 })
  }
}
