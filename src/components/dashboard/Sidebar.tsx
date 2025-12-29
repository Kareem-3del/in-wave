'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'Projects', href: '/dashboard/projects', icon: '🏗️' },
  { label: 'Testimonials', href: '/dashboard/testimonials', icon: '💬' },
  { label: 'Hero Slides', href: '/dashboard/hero', icon: '🖼️' },
  { label: 'Offices', href: '/dashboard/offices', icon: '🏢' },
  { label: 'Services', href: '/dashboard/services', icon: '📋' },
  { label: 'Work Stages', href: '/dashboard/work-stages', icon: '📈' },
  { label: 'Team Info', href: '/dashboard/team', icon: '👥' },
  { label: 'Social Links', href: '/dashboard/social-links', icon: '🔗' },
  { label: 'Submissions', href: '/dashboard/submissions', icon: '📨' },
  { label: 'Uploads', href: '/dashboard/uploads', icon: '📁' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <Link href="/dashboard">
          <span className="logo-text">NKEY</span>
          <span className="logo-sub">Dashboard</span>
        </Link>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="sidebar-footer">
        <Link href="/" className="view-site-link" target="_blank">
          View Website →
        </Link>
      </div>
    </aside>
  )
}
