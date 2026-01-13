import { getAllServices } from '@/lib/data/services'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { AlertMessage } from '@/components/dashboard/AlertMessage'

// Helper to get form field value with or without prefix
function getField(formData: FormData, name: string): string {
  let value = formData.get(name) as string
  if (value) return value
  for (const prefix of ['1_', '2_', '0_']) {
    value = formData.get(`${prefix}${name}`) as string
    if (value) return value
  }
  return ''
}

async function handleToggle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('services').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/dashboard/services')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/dashboard/services')
}

async function handleCreate(formData: FormData) {
  'use server'
  const name = getField(formData, 'name_en') || getField(formData, 'name')
  const display_order = getField(formData, 'display_order')

  if (!name) {
    redirect('/dashboard/services?error=missing_name')
  }

  const supabase = await createClient()
  // Only use columns that definitely exist in the database
  const { error } = await supabase.from('services').insert({
    name,
    display_order: parseInt(display_order) || 0,
    is_active: true,
  })

  if (error) {
    console.error('Error creating service:', error)
    redirect(`/dashboard/services?error=create_failed&msg=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/services')
  redirect('/dashboard/services?success=service_created')
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; msg?: string }> }) {
  const services = await getAllServices()
  const params = await searchParams

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Services</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'service_created' && (
        <AlertMessage type="success" message="Service created successfully!" />
      )}
      {params.error === 'missing_name' && (
        <AlertMessage type="error" message="Please enter a service name" />
      )}
      {params.error === 'create_failed' && (
        <AlertMessage type="error" message={`Failed to create service: ${params.msg || 'Please try again.'}`} />
      )}

      <div className="card mb-6">
        <h3 className="card-title mb-4">Add New Service</h3>
        <form action={handleCreate}>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Service name"
              required
              style={{ flex: 1 }}
            />
            <input
              type="number"
              name="display_order"
              className="form-input"
              placeholder="Order"
              defaultValue={services.length}
              style={{ width: 100 }}
            />
            <button type="submit" className="btn btn-primary">Add Service</button>
          </div>
        </form>
        <p className="form-hint mt-4">These services appear in the contact form dropdown</p>
      </div>

      <div className="card">
        {services.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <span className="badge badge-info">{service.display_order}</span>
                  </td>
                  <td>{service.name}</td>
                  <td>
                    <ToggleActive
                      id={service.id}
                      isActive={service.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td>
                    <DeleteButton
                      id={service.id}
                      onDelete={handleDelete}
                      confirmMessage="Are you sure you want to delete this service?"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
            </div>
            <div className="empty-state-title">No services yet</div>
            <div className="empty-state-text">Add services that will appear in the contact form</div>
          </div>
        )}
      </div>
    </div>
  )
}
