'use client'

import { useState, useEffect } from 'react'
import './setup.css'

type Step = 'checking' | 'credentials' | 'database' | 'admin' | 'complete' | 'already-setup'

interface SetupState {
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceKey: string
  adminEmail: string
  adminPassword: string
}

const SQL_SCHEMA = `-- IN-WAVE Architects Database Schema
-- Run this in Supabase SQL Editor

-- Projects table (Portfolio/Gallery items)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type INTEGER NOT NULL CHECK (type IN (1, 2, 3)),
  images TEXT[] NOT NULL DEFAULT '{}',
  title_italic TEXT NOT NULL,
  title_regular TEXT NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  href TEXT NOT NULL,
  show_marquee BOOLEAN DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offices table
CREATE TABLE IF NOT EXISTS offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_href TEXT NOT NULL,
  email TEXT,
  email_href TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table (for contact form dropdown)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work stages table
CREATE TABLE IF NOT EXISTS work_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team info table (single row for about section)
CREATE TABLE IF NOT EXISTS team_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_lines TEXT[] NOT NULL DEFAULT '{}',
  description_paragraphs TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  years_experience INTEGER DEFAULT 8,
  projects_count INTEGER DEFAULT 90,
  countries_count INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  href TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_location TEXT,
  service TEXT NOT NULL,
  user_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table (key-value store for misc settings)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access policies (for active items only)
CREATE POLICY "Public read projects" ON projects FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read offices" ON offices FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read services" ON services FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read work_stages" ON work_stages FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read team_info" ON team_info FOR SELECT TO anon USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT TO anon USING (is_active = true);

-- Allow anonymous form submissions (insert only)
CREATE POLICY "Public form submission" ON form_submissions FOR INSERT TO anon WITH CHECK (true);

-- Full CRUD access for authenticated users (admins)
CREATE POLICY "Admin full access projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access hero_slides" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access offices" ON offices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access work_stages" ON work_stages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access team_info" ON team_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access social_links" ON social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access form_submissions" ON form_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offices_updated_at BEFORE UPDATE ON offices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_stages_updated_at BEFORE UPDATE ON work_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_info_updated_at BEFORE UPDATE ON team_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`

export default function SetupPage() {
  const [step, setStep] = useState<Step>('checking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [showSql, setShowSql] = useState(false)
  const [state, setState] = useState<SetupState>({
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: '',
    adminEmail: '',
    adminPassword: '',
  })

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message])
  }

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCHEMA)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = SQL_SCHEMA
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/setup/status')
      const data = await res.json()

      if (data.isConfigured && data.hasData) {
        setStep('already-setup')
      } else if (data.isConfigured) {
        setStep('database')
      } else {
        setStep('credentials')
      }
    } catch {
      setStep('credentials')
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/setup/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: state.supabaseUrl,
          supabaseAnonKey: state.supabaseAnonKey,
          supabaseServiceKey: state.supabaseServiceKey,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save credentials')
      }

      setStep('database')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDatabaseSetup = async () => {
    setLoading(true)
    setError(null)
    setLogs([])

    try {
      addLog('Creating database tables...')
      const schemaRes = await fetch('/api/setup/schema', { method: 'POST' })
      const schemaData = await schemaRes.json()

      if (!schemaRes.ok) {
        throw new Error(schemaData.error || 'Failed to create tables')
      }
      addLog('✓ Tables created successfully')

      addLog('Seeding initial data...')
      const seedRes = await fetch('/api/setup/seed', { method: 'POST' })
      const seedData = await seedRes.json()

      if (!seedRes.ok) {
        throw new Error(seedData.error || 'Failed to seed data')
      }
      addLog('✓ Data seeded successfully')

      setStep('admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      addLog('✗ Error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/setup/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.adminEmail,
          password: state.adminPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create admin user')
      }

      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>IN-WAVE Setup</h1>
          <p>Configure your website in a few simple steps</p>
        </div>

        {step === 'checking' && (
          <div className="setup-step">
            <div className="loading-spinner"></div>
            <p>Checking setup status...</p>
          </div>
        )}

        {step === 'already-setup' && (
          <div className="setup-step">
            <div className="success-icon">✓</div>
            <h2>Already Configured</h2>
            <p>Your website is already set up and ready to use.</p>
            <div className="setup-actions">
              <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
              <a href="/" className="btn btn-secondary">View Website</a>
            </div>
          </div>
        )}

        {step === 'credentials' && (
          <div className="setup-step">
            <h2>Step 1: Supabase Credentials</h2>
            <p>Enter your Supabase project credentials. You can find these in your Supabase dashboard under Project Settings → API.</p>

            <form onSubmit={handleCredentialsSubmit}>
              <div className="form-group">
                <label>Supabase Project URL</label>
                <input
                  type="url"
                  value={state.supabaseUrl}
                  onChange={(e) => setState({ ...state, supabaseUrl: e.target.value })}
                  placeholder="https://xxxxx.supabase.co"
                  required
                />
                <span className="hint">Found in Project Settings → API → Project URL</span>
              </div>

              <div className="form-group">
                <label>Anon/Public Key</label>
                <input
                  type="text"
                  value={state.supabaseAnonKey}
                  onChange={(e) => setState({ ...state, supabaseAnonKey: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  required
                />
                <span className="hint">The anon/public key from Project Settings → API</span>
              </div>

              <div className="form-group">
                <label>Service Role Key (Secret)</label>
                <input
                  type="password"
                  value={state.supabaseServiceKey}
                  onChange={(e) => setState({ ...state, supabaseServiceKey: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  required
                />
                <span className="hint">The service_role key (keep this secret!)</span>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </form>
          </div>
        )}

        {step === 'database' && (
          <div className="setup-step">
            <h2>Step 2: Database Setup</h2>
            <p>Create the database tables and seed initial data.</p>

            <div className="info-box">
              <h3>Before you continue:</h3>
              <ol>
                <li>Copy the SQL schema using the button below</li>
                <li>Go to your <a href={`${state.supabaseUrl ? state.supabaseUrl.replace('.supabase.co', '.supabase.com/project/' + state.supabaseUrl.split('//')[1]?.split('.')[0]) + '/sql/new' : 'https://supabase.com/dashboard'}`} target="_blank" rel="noopener noreferrer">Supabase SQL Editor</a></li>
                <li>Paste and run the SQL to create all tables</li>
                <li><strong>Create Storage Bucket:</strong> Go to Storage → Create bucket named "images" with <strong>Public</strong> access</li>
                <li>Come back here and click "Seed Data"</li>
              </ol>
            </div>

            <div className="sql-actions">
              <button onClick={copySQL} className="btn btn-secondary">
                {copied ? 'Copied!' : 'Copy SQL Schema'}
              </button>
              <button onClick={() => setShowSql(!showSql)} className="btn btn-secondary">
                {showSql ? 'Hide SQL' : 'View SQL'}
              </button>
            </div>

            {showSql && (
              <div className="sql-preview">
                <pre>{SQL_SCHEMA}</pre>
              </div>
            )}

            {logs.length > 0 && (
              <div className="logs">
                {logs.map((log, i) => (
                  <div key={i} className={`log-line ${log.startsWith('✓') ? 'success' : log.startsWith('✗') ? 'error' : ''}`}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleDatabaseSetup}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'I\'ve run the SQL - Seed Data'}
            </button>
          </div>
        )}

        {step === 'admin' && (
          <div className="setup-step">
            <h2>Step 3: Create Admin User</h2>
            <p>Create your admin account to access the dashboard.</p>

            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label>Admin Email</label>
                <input
                  type="email"
                  value={state.adminEmail}
                  onChange={(e) => setState({ ...state, adminEmail: e.target.value })}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Password</label>
                <input
                  type="password"
                  value={state.adminPassword}
                  onChange={(e) => setState({ ...state, adminPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin & Finish'}
              </button>
            </form>
          </div>
        )}

        {step === 'complete' && (
          <div className="setup-step">
            <div className="success-icon">✓</div>
            <h2>Setup Complete!</h2>
            <p>Your website is now configured and ready to use.</p>

            <div className="credentials-box">
              <h3>Your Login Credentials</h3>
              <p><strong>Email:</strong> {state.adminEmail}</p>
              <p><strong>Password:</strong> (the password you just set)</p>
            </div>

            <div className="setup-actions">
              <a href="/login" className="btn btn-primary">Go to Login</a>
              <a href="/" className="btn btn-secondary">View Website</a>
            </div>
          </div>
        )}

        <div className="setup-progress">
          <div className={`progress-step ${['credentials', 'database', 'admin', 'complete'].includes(step) ? 'active' : ''} ${['database', 'admin', 'complete'].includes(step) ? 'done' : ''}`}>
            1. Credentials
          </div>
          <div className={`progress-step ${['database', 'admin', 'complete'].includes(step) ? 'active' : ''} ${['admin', 'complete'].includes(step) ? 'done' : ''}`}>
            2. Database
          </div>
          <div className={`progress-step ${['admin', 'complete'].includes(step) ? 'active' : ''} ${step === 'complete' ? 'done' : ''}`}>
            3. Admin
          </div>
        </div>
      </div>
    </div>
  )
}
