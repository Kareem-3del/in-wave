'use client'

import { useState } from 'react'

interface StatusSelectProps {
  id: string
  currentStatus: string
  onUpdate: (formData: FormData) => Promise<void>
}

export function StatusSelect({ id, currentStatus, onUpdate }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setStatus(newStatus)
    setLoading(true)

    const formData = new FormData()
    formData.set('id', id)
    formData.set('status', newStatus)

    try {
      await onUpdate(formData)
    } catch (error) {
      console.error('Failed to update status:', error)
      setStatus(currentStatus) // Revert on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      name="status"
      className="form-select"
      style={{
        width: 100,
        padding: '4px 8px',
        fontSize: 12,
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'wait' : 'pointer',
      }}
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="new">New</option>
      <option value="read">Read</option>
      <option value="replied">Replied</option>
      <option value="archived">Archived</option>
    </select>
  )
}
