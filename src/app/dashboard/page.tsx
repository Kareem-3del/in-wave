import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// Stats card icons as SVG components
const icons = {
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M5 20V8l7-5 7 5v12" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  testimonials: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h4" />
    </svg>
  ),
  hero: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  offices: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01" />
      <path d="M9 12v.01" />
      <path d="M9 15v.01" />
      <path d="M9 18v.01" />
    </svg>
  ),
  submissions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  newSubmissions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
}

async function getStats() {
  const supabase = await createClient()

  const [
    { count: projectsCount },
    { count: testimonialsCount },
    { count: heroCount },
    { count: officesCount },
    { count: submissionsCount },
    { count: newSubmissionsCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('hero_slides').select('*', { count: 'exact', head: true }),
    supabase.from('offices').select('*', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  return {
    projects: projectsCount || 0,
    testimonials: testimonialsCount || 0,
    heroSlides: heroCount || 0,
    offices: officesCount || 0,
    submissions: submissionsCount || 0,
    newSubmissions: newSubmissionsCount || 0,
  }
}

async function getRecentSubmissions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

export default async function DashboardPage() {
  const stats = await getStats()
  const recentSubmissions = await getRecentSubmissions()

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: icons.projects, href: '/dashboard/projects', color: '#3B82F6' },
    { label: 'Testimonials', value: stats.testimonials, icon: icons.testimonials, href: '/dashboard/testimonials', color: '#8B5CF6' },
    { label: 'Hero Slides', value: stats.heroSlides, icon: icons.hero, href: '/dashboard/hero', color: '#EC4899' },
    { label: 'Offices', value: stats.offices, icon: icons.offices, href: '/dashboard/offices', color: '#F59E0B' },
    { label: 'Submissions', value: stats.submissions, icon: icons.submissions, href: '/dashboard/submissions', color: '#10B981' },
    { label: 'New Submissions', value: stats.newSubmissions, icon: icons.newSubmissions, href: '/dashboard/submissions?status=new', color: stats.newSubmissions > 0 ? '#EF4444' : '#6B7280', highlight: stats.newSubmissions > 0 },
  ]

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card-link">
            <div className={`stat-card ${stat.highlight ? 'stat-card-highlight' : ''}`}>
              <div className="stat-header">
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                {stat.highlight && <span className="stat-badge">New</span>}
              </div>
              <div className="stat-value" style={stat.highlight ? { color: stat.color } : undefined}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="quick-actions">
        <Link href="/dashboard/projects/new" className="quick-action-btn">
          <span className="quick-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span>Add Project</span>
        </Link>
        <Link href="/dashboard/hero" className="quick-action-btn">
          <span className="quick-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </span>
          <span>Add Hero Slide</span>
        </Link>
        <Link href="/dashboard/testimonials" className="quick-action-btn">
          <span className="quick-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span>Manage Testimonials</span>
        </Link>
        <Link href="/dashboard/uploads" className="quick-action-btn">
          <span className="quick-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span>Upload Files</span>
        </Link>
      </div>

      <div className="card scale-in">
        <div className="card-header">
          <h3 className="card-title">Recent Submissions</h3>
          <Link href="/dashboard/submissions" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>
        {recentSubmissions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.user_name}</td>
                  <td>{submission.email}</td>
                  <td>{submission.service}</td>
                  <td>
                    <span className={`badge badge-${submission.status === 'new' ? 'success' : 'info'}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>{new Date(submission.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <div className="empty-state-title">No submissions yet</div>
            <div className="empty-state-text">Form submissions will appear here</div>
          </div>
        )}
      </div>
    </div>
  )
}
