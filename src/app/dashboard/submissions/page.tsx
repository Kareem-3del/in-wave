import Link from 'next/link'
import { getFormSubmissions } from '@/lib/data/form-submissions'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { StatusSelect } from '@/components/dashboard/StatusSelect'
import { DeleteButton } from '@/components/dashboard/DeleteButton'

async function handleUpdateStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const supabase = await createClient()
  await supabase.from('form_submissions').update({ status }).eq('id', id)
  revalidatePath('/dashboard/submissions')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('form_submissions').delete().eq('id', id)
  revalidatePath('/dashboard/submissions')
}

export default async function SubmissionsPage() {
  const submissions = await getFormSubmissions()

  const statusColors: Record<string, string> = {
    new: 'badge-success',
    read: 'badge-info',
    replied: 'badge-warning',
    archived: 'badge-danger',
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Form Submissions</h1>
        <div className="page-actions">
          <span className="badge badge-success" style={{ marginRight: 8 }}>
            {submissions.filter(s => s.status === 'new').length} new
          </span>
        </div>
      </div>

      <div className="card">
        {submissions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td>{sub.user_name}</td>
                  <td>
                    <a href={`mailto:${sub.email}`}>{sub.email}</a>
                  </td>
                  <td>
                    <a href={`tel:${sub.phone}`}>{sub.phone}</a>
                  </td>
                  <td>{sub.service}</td>
                  <td>{sub.object_location || '-'}</td>
                  <td>
                    <span className={`badge ${statusColors[sub.status]}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <StatusSelect
                        id={sub.id}
                        currentStatus={sub.status}
                        onUpdate={handleUpdateStatus}
                      />
                      <DeleteButton
                        id={sub.id}
                        onDelete={handleDelete}
                        confirmMessage="Are you sure you want to delete this submission?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📨</div>
            <div className="empty-state-title">No submissions yet</div>
            <div className="empty-state-text">Form submissions from your website will appear here</div>
          </div>
        )}
      </div>
    </div>
  )
}
