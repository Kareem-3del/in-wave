import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read env from file if not in process.env
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

export async function POST() {
  try {
    const { url, serviceKey } = getEnvVars()

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured. Please complete step 1 first.' },
        { status: 400 }
      )
    }

    // Read schema SQL
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')

    if (!fs.existsSync(schemaPath)) {
      return NextResponse.json(
        { error: 'Schema file not found' },
        { status: 500 }
      )
    }

    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Execute SQL using Supabase's pg_query function (via REST API)
    // Note: This requires the schema to be run via SQL editor or pg connection
    // Since we can't run raw SQL via REST API, we'll create tables using the SDK

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Try to check if tables exist by querying them
    const { error: projectsError } = await supabase.from('projects').select('id').limit(1)

    if (projectsError && projectsError.message.includes('does not exist')) {
      // Tables don't exist - need to run SQL manually
      return NextResponse.json({
        error: 'Tables need to be created. Please run the SQL schema manually.',
        instructions: [
          '1. Go to your Supabase Dashboard → SQL Editor',
          '2. Copy the contents of supabase/schema.sql',
          '3. Run the SQL',
          '4. Come back and try again'
        ],
        sqlEditorUrl: `${url.replace('.supabase.co', '')}/sql/new`,
        schemaPath: 'supabase/schema.sql'
      }, { status: 400 })
    }

    // Tables exist
    return NextResponse.json({ success: true, message: 'Tables already exist' })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to setup database' },
      { status: 500 }
    )
  }
}
