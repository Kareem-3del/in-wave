import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function getEnvVars() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    try {
      const envPath = path.join(process.cwd(), '.env.local')
      const envContent = fs.readFileSync(envPath, 'utf8')
      const lines = envContent.split('\n')

      for (const line of lines) {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=').trim()
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') url = value
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceKey = value
      }
    } catch {}
  }

  return { url, serviceKey }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const { url, serviceKey } = getEnvVars()

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 400 }
      )
    }

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Create admin user using Supabase Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    })

    if (error) {
      // Check if user already exists
      if (error.message.includes('already been registered') || error.message.includes('already exists')) {
        return NextResponse.json({
          success: true,
          message: 'Admin user already exists',
          email
        })
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: data.user?.email
    })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
