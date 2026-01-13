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
    <div className="card settings-card">
      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <Icon icon={tab.icon} width={18} />
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <form action={handleSubmit}>
        {/* Tracking Pixels Tab */}
        {activeTab === 'pixels' && (
          <div className="settings-section">
            <h3 className="section-title">Tracking Pixels</h3>
            <p className="section-desc">
              Add your tracking pixel IDs to enable analytics and conversion tracking.
            </p>

            <div className="settings-grid">
              {/* Facebook Pixel */}
              <div className="form-group">
                <label className="form-label icon-label">
                  <Icon icon="mdi:facebook" width={20} className="icon-facebook" />
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
                <label className="form-label icon-label">
                  <Icon icon="mdi:google-analytics" width={20} className="icon-google" />
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
                <label className="form-label icon-label">
                  <Icon icon="mdi:tag" width={20} className="icon-gtm" />
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
                <label className="form-label icon-label">
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
                <label className="form-label icon-label">
                  <Icon icon="mdi:snapchat" width={20} className="icon-snapchat" />
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
                <label className="form-label icon-label">
                  <Icon icon="mdi:linkedin" width={20} className="icon-linkedin" />
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
                <label className="form-label icon-label">
                  <Icon icon="mdi:pinterest" width={20} className="icon-pinterest" />
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
                <label className="form-label icon-label">
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
                <label className="form-label icon-label">
                  <Icon icon="simple-icons:hotjar" width={20} className="icon-hotjar" />
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
                <label className="form-label icon-label">
                  <Icon icon="simple-icons:microsoft" width={20} className="icon-microsoft" />
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
          <div className="settings-section">
            <h3 className="section-title">n8n Webhook Integration</h3>
            <p className="section-desc">
              Connect your n8n workflows to automate actions when events occur on your website.
            </p>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="n8n_webhook_enabled"
                  defaultChecked={settings.n8n_webhook_enabled === 'true'}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Enable n8n Webhooks</span>
              </label>
              <p className="checkbox-hint">
                When enabled, the system will send data to your n8n webhook URLs
              </p>
            </div>

            <div className="webhook-fields">
              {/* Form Submission Webhook */}
              <div className="form-group">
                <label className="form-label icon-label">
                  <Icon icon="mdi:form-textbox" width={20} className="icon-success" />
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
                <label className="form-label icon-label">
                  <Icon icon="mdi:folder-plus" width={20} className="icon-info" />
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

            <div className="info-callout info-callout-info">
              <h4>
                <Icon icon="mdi:information" width={18} />
                How to set up n8n webhooks
              </h4>
              <ol>
                <li>Create a new workflow in your n8n instance</li>
                <li>Add a &quot;Webhook&quot; node as the trigger</li>
                <li>Copy the webhook URL from n8n</li>
                <li>Paste the URL in the field above</li>
                <li>Configure your workflow actions (email, Slack, CRM, etc.)</li>
              </ol>
            </div>
          </div>
        )}

        {/* Custom Scripts Tab */}
        {activeTab === 'scripts' && (
          <div className="settings-section">
            <h3 className="section-title">Custom Scripts</h3>
            <p className="section-desc">
              Add custom JavaScript or tracking codes that will be injected into your website.
            </p>

            <div className="form-group">
              <label className="form-label icon-label">
                <Icon icon="mdi:code-tags" width={18} />
                Head Scripts
              </label>
              <textarea
                name="custom_head_scripts"
                className="form-textarea code-textarea"
                placeholder="<!-- Scripts to be added in the <head> section -->"
                defaultValue={settings.custom_head_scripts || ''}
              />
              <p className="form-hint">These scripts will be added inside the &lt;head&gt; tag</p>
            </div>

            <div className="form-group">
              <label className="form-label icon-label">
                <Icon icon="mdi:code-braces" width={18} />
                Body Scripts
              </label>
              <textarea
                name="custom_body_scripts"
                className="form-textarea code-textarea"
                placeholder="<!-- Scripts to be added before </body> -->"
                defaultValue={settings.custom_body_scripts || ''}
              />
              <p className="form-hint">These scripts will be added before the closing &lt;/body&gt; tag</p>
            </div>

            <div className="info-callout info-callout-warning">
              <h4>
                <Icon icon="mdi:alert" width={18} />
                Security Warning
              </h4>
              <p>
                Only add scripts from trusted sources. Malicious scripts can compromise your website and user data.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="settings-footer">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="save-success">
              <Icon icon="mdi:check-circle" width={20} />
              Settings saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
