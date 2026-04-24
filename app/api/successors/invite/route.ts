
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { successorEmail, successorName, founderName } = await request.json()

  // Generate a unique invitation token
  const invitationToken = crypto.randomUUID()
  
  // Store the token in the database (you'll need to add this column)
  const { error: updateError } = await supabase
    .from('successors')
    .update({ 
      invitation_token: invitationToken,
      notified_at: new Date().toISOString()
    })
    .eq('email', successorEmail)
    .eq('founder_id', session.user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Send email using your preferred email service
  // This example uses a simple fetch to an email service API
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/successor/accept/${invitationToken}`
  
  const emailHtml = `
    <h2>You've been designated as a successor</h2>
    <p>Hello ${successorName},</p>
    <p>${founderName} has designated you as a successor for their Cairn Zero account.</p>
    <p>This means you'll have access to their critical information in the event they become unavailable.</p>
    <p><a href="${inviteUrl}">Click here to accept and verify your role</a></p>
    <p>If you did not expect this invitation, please ignore this email.</p>
  `

  // Replace this with your actual email service
  // Examples: SendGrid, AWS SES, Resend, etc.
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Cairn Zero <noreply@cairnzero.com>',
        to: successorEmail,
        subject: `${founderName} has designated you as a successor`,
        html: emailHtml
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
