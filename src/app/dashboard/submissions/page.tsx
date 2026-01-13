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

  const newCount = submissions.filter(s => s.status === 'new').length

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Form Submissions</h1>
        <div className="page-actions">
          {newCount > 0 && (
            <span className="badge badge-success">
              {newCount} new
            </span>
          )}
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
                <tr key={sub.id} className={sub.status === 'new' ? 'row-highlight' : ''}>
                  <td data-label="Date">{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td data-label="Name">{sub.user_name}</td>
                  <td data-label="Email">
                    <a href={`mailto:${sub.email}`} className="table-link">{sub.email}</a>
                  </td>
                  <td data-label="Phone">
                    <a href={`tel:${sub.phone}`} className="table-link">{sub.phone}</a>
                  </td>
                  <td data-label="Service">{sub.service}</td>
                  <td data-label="Location">{sub.object_location || <span className="text-muted">-</span>}</td>
                  <td data-label="Status">
                    <span className={`badge ${statusColors[sub.status]}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td data-label="Actions">
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
            <div className="empty-state-icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            </div>
            <div className="empty-state-title">No submissions yet</div>
            <div className="empty-state-text">Form submissions from your website will appear here</div>
          </div>
        )}
      </div>
    </div>
  )
}
