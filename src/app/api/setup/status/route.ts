import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Check if credentials are configured
    const isConfigured = !!(supabaseUrl && supabaseKey)

    if (!isConfigured) {
      return NextResponse.json({ isConfigured: false, hasData: false })
    }

    // Check if tables exist and have data
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase.from('projects').select('id').limit(1)

    const hasData = !error && data && data.length > 0

    return NextResponse.json({ isConfigured, hasData })
  } catch {
    return NextResponse.json({ isConfigured: false, hasData: false })
  }
}
