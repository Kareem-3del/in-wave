import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = await request.json()

    // Validate inputs
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    if (!supabaseUrl.includes('supabase.co')) {
      return NextResponse.json(
        { error: 'Invalid Supabase URL' },
        { status: 400 }
      )
    }

    // Test the connection
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { error } = await supabase.auth.getSession()

    // Note: getSession might return error if no session, but connection should work
    // Let's try a simple query instead
    try {
      await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      })
    } catch {
      return NextResponse.json(
        { error: 'Could not connect to Supabase. Please check your credentials.' },
        { status: 400 }
      )
    }

    // Write to .env.local
    const envPath = path.join(process.cwd(), '.env.local')
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}
`

    fs.writeFileSync(envPath, envContent)

    // Also set in process.env for immediate use
    process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey
    process.env.SUPABASE_SERVICE_ROLE_KEY = supabaseServiceKey

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save credentials' },
      { status: 500 }
    )
  }
}
