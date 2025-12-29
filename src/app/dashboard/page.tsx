import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{stats.projects}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Testimonials</div>
          <div className="stat-value">{stats.testimonials}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hero Slides</div>
          <div className="stat-value">{stats.heroSlides}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Offices</div>
          <div className="stat-value">{stats.offices}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Form Submissions</div>
          <div className="stat-value">{stats.submissions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New Submissions</div>
          <div className="stat-value" style={{ color: stats.newSubmissions > 0 ? '#16a34a' : undefined }}>
            {stats.newSubmissions}
          </div>
        </div>
      </div>

      <div className="card">
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
            <div className="empty-state-icon">📬</div>
            <div className="empty-state-title">No submissions yet</div>
            <div className="empty-state-text">Form submissions will appear here</div>
          </div>
        )}
      </div>
    </div>
  )
}
