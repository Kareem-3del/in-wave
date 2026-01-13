'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/login/actions'

interface DashboardHeaderProps {
  userEmail: string
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
    document.body.classList.remove('sidebar-open')
  }, [pathname])

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        document.body.classList.remove('sidebar-open')
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  const toggleMenu = () => {
    const newState = !menuOpen
    setMenuOpen(newState)
    if (newState) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.classList.remove('sidebar-open')
  }

  return (
    <>
      {/* Backdrop overlay - click to close menu */}
      {menuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
          <h2 className="header-title">Content Management</h2>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="user-email">{userEmail}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="logout-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="logout-text">Logout</span>
            </button>
          </form>
        </div>
      </header>
    </>
  )
}
