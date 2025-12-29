'use client'

import { logout } from '@/app/login/actions'

interface DashboardHeaderProps {
  userEmail: string
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h2 className="header-title">Content Management</h2>
      </div>
      <div className="header-right">
        <span className="user-email">{userEmail}</span>
        <form action={logout}>
          <button type="submit" className="logout-btn">
            Logout
          </button>
        </form>
      </div>
    </header>
  )
}
