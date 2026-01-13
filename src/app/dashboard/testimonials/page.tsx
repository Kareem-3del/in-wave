import Link from 'next/link'
import { getAllTestimonials } from '@/lib/data/testimonials'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { AlertMessage } from '@/components/dashboard/AlertMessage'

async function handleToggle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('testimonials').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/dashboard/testimonials')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('testimonials').delete().eq('id', id)
  revalidatePath('/dashboard/testimonials')
}

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; msg?: string }> }) {
  const testimonials = await getAllTestimonials()
  const params = await searchParams

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Testimonials</h1>
        <div className="page-actions">
          <Link href="/dashboard/testimonials/new" className="btn btn-primary">
            + Add Testimonial
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
      {params.success === 'testimonial_created' && (
        <AlertMessage type="success" message="Testimonial created successfully!" />
      )}
      {params.success === 'testimonial_updated' && (
        <AlertMessage type="success" message="Testimonial updated successfully!" />
      )}
      {params.error === 'missing_fields' && (
        <AlertMessage type="error" message="Please fill in all required fields (Name and Review Text)" />
      )}
      {params.error === 'create_failed' && (
        <AlertMessage type="error" message={`Failed to create testimonial: ${params.msg || 'Please try again.'}`} />
      )}
      {params.error === 'update_failed' && (
        <AlertMessage type="error" message={`Failed to update testimonial: ${params.msg || 'Please try again.'}`} />
      )}

      <div className="card">
        {testimonials.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td data-label="Order">
                    <span className="badge badge-info">{t.display_order}</span>
                  </td>
                  <td data-label="Name">{t.name}</td>
                  <td data-label="Rating">
                    <span className="rating-stars">{'★'.repeat(t.rating)}</span>
                  </td>
                  <td data-label="Review" className="text-truncate">
                    {t.text.substring(0, 100)}...
                  </td>
                  <td data-label="Status">
                    <ToggleActive
                      id={t.id}
                      isActive={t.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td data-label="Actions">
                    <div className="actions">
                      <Link href={`/dashboard/testimonials/${t.id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <DeleteButton
                        id={t.id}
                        onDelete={handleDelete}
                        confirmMessage="Are you sure you want to delete this testimonial?"
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 9h8" />
                <path d="M8 13h6" />
              </svg>
            </div>
            <div className="empty-state-title">No testimonials yet</div>
            <div className="empty-state-text">Add your first testimonial to get started</div>
            <Link href="/dashboard/testimonials/new" className="btn btn-primary">
              + Add Testimonial
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
