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

  return (
    <div
      ref={alertRef}
      className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`}
    >
      <span style={{ fontWeight: 700 }}>{type === 'success' ? '✓' : '✕'}</span> {message}
    </div>
  )
}
