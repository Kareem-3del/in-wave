import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function triggerN8nWebhook(webhookUrl: string, data: Record<string, unknown>) {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'inwave-website'
      })
    })
  } catch (error) {
    console.error('n8n webhook error:', error)
    // Don't fail the request if webhook fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { object_location, service, user_name, phone, email } = body

    // Validation
    if (!service || !user_name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Save to database
    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        object_location: object_location || null,
        service,
        user_name,
        phone,
        email,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      )
    }

    // Get n8n webhook settings
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['n8n_webhook_enabled', 'n8n_webhook_form_submission'])

    const settingsMap: Record<string, string> = {}
    settings?.forEach(s => { settingsMap[s.key] = s.value })

    // Trigger n8n webhook if enabled
    if (settingsMap.n8n_webhook_enabled === 'true' && settingsMap.n8n_webhook_form_submission) {
      await triggerN8nWebhook(settingsMap.n8n_webhook_form_submission, {
        event: 'form_submission',
        submission: {
          id: data.id,
          object_location: object_location || null,
          service,
          user_name,
          phone,
          email,
          created_at: data.created_at
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      id: data.id
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
