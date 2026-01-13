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
    <div>
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
                  <td>{t.display_order}</td>
                  <td>{t.name}</td>
                  <td>{'⭐'.repeat(t.rating)}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.text.substring(0, 100)}...
                  </td>
                  <td>
                    <ToggleActive
                      id={t.id}
                      isActive={t.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td>
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
            <div className="empty-state-icon">💬</div>
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
