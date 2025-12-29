'use client'

interface StatusSelectProps {
  id: string
  currentStatus: string
  onUpdate: (formData: FormData) => Promise<void>
}

export function StatusSelect({ id, currentStatus, onUpdate }: StatusSelectProps) {
  return (
    <form action={onUpdate} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        className="form-select"
        style={{ width: 100, padding: '4px 8px', fontSize: 12 }}
        defaultValue={currentStatus}
        onChange={(e) => e.target.form?.requestSubmit()}
      >
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
        <option value="archived">Archived</option>
      </select>
    </form>
  )
}
