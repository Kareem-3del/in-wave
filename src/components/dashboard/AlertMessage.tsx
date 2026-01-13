'use client'

import { useEffect, useRef } from 'react'

interface AlertMessageProps {
  type: 'success' | 'error'
  message: string
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to top when alert appears
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const styles = type === 'success'
    ? { background: '#dcfce7', border: '1px solid #16a34a', color: '#166534', icon: '✓' }
    : { background: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b', icon: '✕' }

  return (
    <div
      ref={alertRef}
      style={{
        padding: '12px 16px',
        background: styles.background,
        border: styles.border,
        borderRadius: 8,
        marginBottom: 16,
        color: styles.color,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}
    >
      <span style={{ fontWeight: 700 }}>{styles.icon}</span> {message}
    </div>
  )
}
