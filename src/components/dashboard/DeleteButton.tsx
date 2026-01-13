'use client'

import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  onDelete: (formData: FormData) => Promise<void>
  confirmMessage?: string
}

export function DeleteButton({ id, onDelete, confirmMessage = 'Are you sure you want to delete this item?' }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    if (confirm(confirmMessage)) {
      setLoading(true)
      try {
        await onDelete(formData)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <form action={handleSubmit} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          fontWeight: 500,
          fontSize: 13,
          background: '#ef4444',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          transition: 'all 0.15s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#dc2626')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#ef4444')}
      >
        {loading ? 'Deleting...' : '🗑 Delete'}
      </button>
    </form>
  )
}
