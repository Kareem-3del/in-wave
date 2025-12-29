import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SettingsForm } from './SettingsForm'

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')

  const settings: Record<string, string> = {}
  data?.forEach(row => {
    settings[row.key] = row.value
  })
  return settings
}

async function handleSave(formData: FormData) {
  'use server'
  const supabase = await createClient()

  const settings = [
    // Tracking Pixels
    { key: 'facebook_pixel_id', value: formData.get('facebook_pixel_id') as string || '' },
    { key: 'google_analytics_id', value: formData.get('google_analytics_id') as string || '' },
    { key: 'google_tag_manager_id', value: formData.get('google_tag_manager_id') as string || '' },
    { key: 'tiktok_pixel_id', value: formData.get('tiktok_pixel_id') as string || '' },
    { key: 'snapchat_pixel_id', value: formData.get('snapchat_pixel_id') as string || '' },
    { key: 'linkedin_pixel_id', value: formData.get('linkedin_pixel_id') as string || '' },
    { key: 'pinterest_tag_id', value: formData.get('pinterest_tag_id') as string || '' },
    { key: 'twitter_pixel_id', value: formData.get('twitter_pixel_id') as string || '' },
    { key: 'hotjar_id', value: formData.get('hotjar_id') as string || '' },
    { key: 'clarity_id', value: formData.get('clarity_id') as string || '' },
    // n8n Webhooks
    { key: 'n8n_webhook_form_submission', value: formData.get('n8n_webhook_form_submission') as string || '' },
    { key: 'n8n_webhook_new_project', value: formData.get('n8n_webhook_new_project') as string || '' },
    { key: 'n8n_webhook_enabled', value: formData.get('n8n_webhook_enabled') === 'on' ? 'true' : 'false' },
    // Custom Scripts
    { key: 'custom_head_scripts', value: formData.get('custom_head_scripts') as string || '' },
    { key: 'custom_body_scripts', value: formData.get('custom_body_scripts') as string || '' },
  ]

  for (const setting of settings) {
    await supabase
      .from('site_settings')
      .upsert({ key: setting.key, value: setting.value }, { onConflict: 'key' })
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/')
}

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <SettingsForm settings={settings} onSave={handleSave} />

      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title">Database Setup</h3>
        <p style={{ marginBottom: 16, color: '#666' }}>
          Run the SQL schema in your Supabase dashboard to create the required tables.
        </p>

        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <p style={{ marginBottom: 8 }}><strong>Steps:</strong></p>
          <ol style={{ marginLeft: 20, color: '#666' }}>
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Copy the contents of <code>supabase/schema.sql</code></li>
            <li>Run the SQL to create all tables and policies</li>
          </ol>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title">Environment Variables</h3>
        <p style={{ marginBottom: 16, color: '#666' }}>
          Ensure these environment variables are set:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>NEXT_PUBLIC_SUPABASE_URL</code></td>
              <td>Your Supabase project URL</td>
              <td>
                <span className="badge badge-success">Set</span>
              </td>
            </tr>
            <tr>
              <td><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></td>
              <td>Your Supabase anon/public key</td>
              <td>
                <span className="badge badge-success">Set</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
