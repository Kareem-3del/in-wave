'use client'

import { useState } from 'react'

interface ToggleActiveProps {
  id: string
  isActive: boolean
  onToggle: (formData: FormData) => Promise<void>
}

export function ToggleActive({ id, isActive, onToggle }: ToggleActiveProps) {
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(isActive)

  const handleToggle = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.set('id', id)
    formData.set('is_active', (!active).toString())

    try {
      await onToggle(formData)
      setActive(!active)
    } catch (error) {
      console.error('Toggle failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={active ? 'Click to hide' : 'Click to show'}
      className={`toggle-active-btn ${active ? 'is-active' : 'is-hidden'} ${loading ? 'is-loading' : ''}`}
    >
      <span className="toggle-dot" />
      {loading ? '...' : active ? 'Active' : 'Hidden'}
    </button>
  )
}
