'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

interface SettingsFormProps {
  settings: Record<string, string>
  onSave: (formData: FormData) => Promise<void>
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'pixels' | 'webhooks' | 'scripts'>('pixels')

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    setSaved(false)
    await onSave(formData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'pixels', label: 'Tracking Pixels', icon: 'mdi:chart-line' },
    { id: 'webhooks', label: 'n8n Webhooks', icon: 'mdi:webhook' },
    { id: 'scripts', label: 'Custom Scripts', icon: 'mdi:code-tags' },
  ] as const

  return (
    <div className="card">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #e5e5e5', paddingBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: activeTab === tab.id ? '#1a1a1a' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#666',
              border: '1px solid #ddd',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
          >
            <Icon icon={tab.icon} width={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <form action={handleSubmit}>
        {/* Tracking Pixels Tab */}
        {activeTab === 'pixels' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tracking Pixels</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
              Add your tracking pixel IDs to enable analytics and conversion tracking.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {/* Facebook Pixel */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:facebook" width={20} style={{ color: '#1877f2' }} />
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  name="facebook_pixel_id"
                  className="form-input"
                  placeholder="e.g., 123456789012345"
                  defaultValue={settings.facebook_pixel_id || ''}
                />
              </div>

              {/* Google Analytics */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:google-analytics" width={20} style={{ color: '#e37400' }} />
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  name="google_analytics_id"
                  className="form-input"
                  placeholder="e.g., G-XXXXXXXXXX"
                  defaultValue={settings.google_analytics_id || ''}
                />
              </div>

              {/* Google Tag Manager */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:tag" width={20} style={{ color: '#4285f4' }} />
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  name="google_tag_manager_id"
                  className="form-input"
                  placeholder="e.g., GTM-XXXXXXX"
                  defaultValue={settings.google_tag_manager_id || ''}
                />
              </div>

              {/* TikTok Pixel */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="ic:baseline-tiktok" width={20} />
                  TikTok Pixel ID
                </label>
                <input
                  type="text"
                  name="tiktok_pixel_id"
                  className="form-input"
                  placeholder="e.g., XXXXXXXXXXXXXXXXXX"
                  defaultValue={settings.tiktok_pixel_id || ''}
                />
              </div>

              {/* Snapchat Pixel */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:snapchat" width={20} style={{ color: '#fffc00' }} />
                  Snapchat Pixel ID
                </label>
                <input
                  type="text"
                  name="snapchat_pixel_id"
                  className="form-input"
                  placeholder="e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  defaultValue={settings.snapchat_pixel_id || ''}
                />
              </div>

              {/* LinkedIn Pixel */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:linkedin" width={20} style={{ color: '#0077b5' }} />
                  LinkedIn Insight Tag ID
                </label>
                <input
                  type="text"
                  name="linkedin_pixel_id"
                  className="form-input"
                  placeholder="e.g., 1234567"
                  defaultValue={settings.linkedin_pixel_id || ''}
                />
              </div>

              {/* Pinterest Tag */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:pinterest" width={20} style={{ color: '#e60023' }} />
                  Pinterest Tag ID
                </label>
                <input
                  type="text"
                  name="pinterest_tag_id"
                  className="form-input"
                  placeholder="e.g., 1234567890123"
                  defaultValue={settings.pinterest_tag_id || ''}
                />
              </div>

              {/* Twitter/X Pixel */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="ri:twitter-x-fill" width={20} />
                  Twitter/X Pixel ID
                </label>
                <input
                  type="text"
                  name="twitter_pixel_id"
                  className="form-input"
                  placeholder="e.g., xxxxxx"
                  defaultValue={settings.twitter_pixel_id || ''}
                />
              </div>

              {/* Hotjar */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="simple-icons:hotjar" width={20} style={{ color: '#fd3a5c' }} />
                  Hotjar Site ID
                </label>
                <input
                  type="text"
                  name="hotjar_id"
                  className="form-input"
                  placeholder="e.g., 1234567"
                  defaultValue={settings.hotjar_id || ''}
                />
              </div>

              {/* Microsoft Clarity */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="simple-icons:microsoft" width={20} style={{ color: '#0078d4' }} />
                  Microsoft Clarity ID
                </label>
                <input
                  type="text"
                  name="clarity_id"
                  className="form-input"
                  placeholder="e.g., xxxxxxxxxx"
                  defaultValue={settings.clarity_id || ''}
                />
              </div>
            </div>
          </div>
        )}

        {/* n8n Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>n8n Webhook Integration</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
              Connect your n8n workflows to automate actions when events occur on your website.
            </p>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="n8n_webhook_enabled"
                  defaultChecked={settings.n8n_webhook_enabled === 'true'}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontWeight: 500 }}>Enable n8n Webhooks</span>
              </label>
              <p style={{ color: '#666', fontSize: 13, marginTop: 4, marginLeft: 26 }}>
                When enabled, the system will send data to your n8n webhook URLs
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Form Submission Webhook */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:form-textbox" width={20} style={{ color: '#059669' }} />
                  Form Submission Webhook
                </label>
                <input
                  type="url"
                  name="n8n_webhook_form_submission"
                  className="form-input"
                  placeholder="https://your-n8n-instance.com/webhook/form-submission"
                  defaultValue={settings.n8n_webhook_form_submission || ''}
                />
                <p className="form-hint">Triggered when a visitor submits the contact form</p>
              </div>

              {/* New Project Webhook */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon icon="mdi:folder-plus" width={20} style={{ color: '#3b82f6' }} />
                  New Project Webhook
                </label>
                <input
                  type="url"
                  name="n8n_webhook_new_project"
                  className="form-input"
                  placeholder="https://your-n8n-instance.com/webhook/new-project"
                  defaultValue={settings.n8n_webhook_new_project || ''}
                />
                <p className="form-hint">Triggered when a new project is created in the dashboard</p>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#0369a1' }}>
                <Icon icon="mdi:information" width={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                How to set up n8n webhooks
              </h4>
              <ol style={{ marginLeft: 20, color: '#0c4a6e', fontSize: 13 }}>
                <li>Create a new workflow in your n8n instance</li>
                <li>Add a "Webhook" node as the trigger</li>
                <li>Copy the webhook URL from n8n</li>
                <li>Paste the URL in the field above</li>
                <li>Configure your workflow actions (email, Slack, CRM, etc.)</li>
              </ol>
            </div>
          </div>
        )}

        {/* Custom Scripts Tab */}
        {activeTab === 'scripts' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Custom Scripts</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
              Add custom JavaScript or tracking codes that will be injected into your website.
            </p>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">
                <Icon icon="mdi:code-tags" width={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Head Scripts
              </label>
              <textarea
                name="custom_head_scripts"
                className="form-textarea"
                placeholder="<!-- Scripts to be added in the <head> section -->"
                defaultValue={settings.custom_head_scripts || ''}
                style={{ fontFamily: 'monospace', fontSize: 13, minHeight: 150 }}
              />
              <p className="form-hint">These scripts will be added inside the &lt;head&gt; tag</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Icon icon="mdi:code-braces" width={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Body Scripts
              </label>
              <textarea
                name="custom_body_scripts"
                className="form-textarea"
                placeholder="<!-- Scripts to be added before </body> -->"
                defaultValue={settings.custom_body_scripts || ''}
                style={{ fontFamily: 'monospace', fontSize: 13, minHeight: 150 }}
              />
              <p className="form-hint">These scripts will be added before the closing &lt;/body&gt; tag</p>
            </div>

            <div style={{ marginTop: 16, padding: 16, background: '#fef3c7', borderRadius: 8, border: '1px solid #fcd34d' }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#92400e' }}>
                <Icon icon="mdi:alert" width={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Security Warning
              </h4>
              <p style={{ color: '#78350f', fontSize: 13 }}>
                Only add scripts from trusted sources. Malicious scripts can compromise your website and user data.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon icon="mdi:check-circle" width={20} />
              Settings saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
