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
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        fontWeight: 500,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: active ? '#dcfce7' : '#f3f4f6',
        color: active ? '#16a34a' : '#6b7280',
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: active ? '#16a34a' : '#9ca3af',
      }} />
      {loading ? '...' : active ? 'Active' : 'Hidden'}
    </button>
  )
}
