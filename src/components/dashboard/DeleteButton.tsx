'use client'

interface DeleteButtonProps {
  id: string
  onDelete: (formData: FormData) => Promise<void>
  confirmMessage?: string
}

export function DeleteButton({ id, onDelete, confirmMessage = 'Are you sure you want to delete this item?' }: DeleteButtonProps) {
  const handleSubmit = async (formData: FormData) => {
    if (confirm(confirmMessage)) {
      await onDelete(formData)
    }
  }

  return (
    <form action={handleSubmit} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger btn-sm">
        Delete
      </button>
    </form>
  )
}
