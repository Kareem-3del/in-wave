import { getAllOffices } from '@/lib/data/offices'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { AlertMessage } from '@/components/dashboard/AlertMessage'

async function handleToggle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('offices').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/dashboard/offices')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('offices').delete().eq('id', id)
  revalidatePath('/dashboard/offices')
}

// Helper to get form field value with or without prefix
function getField(formData: FormData, name: string): string {
  // Try without prefix first
  let value = formData.get(name) as string
  if (value) return value
  // Try with common prefixes
  for (const prefix of ['1_', '2_', '0_']) {
    value = formData.get(`${prefix}${name}`) as string
    if (value) return value
  }
  return ''
}

async function handleCreate(formData: FormData) {
  'use server'
  const city = getField(formData, 'city_en') || getField(formData, 'city')
  const country = getField(formData, 'country_en') || getField(formData, 'country')
  const phone = getField(formData, 'phone')
  const email = getField(formData, 'email')
  const display_order = getField(formData, 'display_order')

  if (!city || !country || !phone) {
    redirect('/dashboard/offices?error=missing_fields')
  }

  const supabase = await createClient()
  // Only insert fields that exist in the database
  const { error } = await supabase.from('offices').insert({
    city,
    country,
    phone,
    phone_href: `tel:${phone.replace(/\s/g, '')}`,
    email: email || null,
    email_href: email ? `mailto:${email}` : null,
    display_order: parseInt(display_order) || 0,
    is_active: true,
  })

  if (error) {
    console.error('Error creating office:', error)
    redirect(`/dashboard/offices?error=create_failed&msg=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/offices')
  redirect('/dashboard/offices?success=office_created')
}

async function handleUpdateOrder(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0
  const supabase = await createClient()
  await supabase.from('offices').update({ display_order }).eq('id', id)
  revalidatePath('/dashboard/offices')
}

export default async function OfficesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; msg?: string }> }) {
  const offices = await getAllOffices()
  const params = await searchParams

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Office Locations</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'office_created' && (
        <AlertMessage type="success" message="Office created successfully!" />
      )}
      {params.error === 'missing_fields' && (
        <AlertMessage type="error" message="Please fill in all required fields (City, Country, Phone)" />
      )}
      {params.error === 'create_failed' && (
        <AlertMessage type="error" message={`Failed to create office: ${params.msg || 'Please try again.'}`} />
      )}

      <div className="card mb-6">
        <h3 className="card-title mb-4">Add New Office</h3>
        <form action={handleCreate}>
          <div className="grid-2 mb-4">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="City name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                className="form-input"
                placeholder="Country name"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <input
              type="text"
              name="phone"
              className="form-input flex-1"
              placeholder="Phone"
              required
            />
            <input
              type="email"
              name="email"
              className="form-input flex-1"
              placeholder="Email (optional)"
            />
            <input
              type="number"
              name="display_order"
              className="form-input order-field"
              placeholder="Order"
              defaultValue={offices.length}
            />
            <button type="submit" className="btn btn-primary">Add Office</button>
          </div>
        </form>
      </div>

      <div className="card">
        {offices.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>City</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offices.map((office) => (
                <tr key={office.id}>
                  <td>
                    <form action={handleUpdateOrder} className="inline-order-form">
                      <input type="hidden" name="id" value={office.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={office.display_order}
                        className="order-input"
                        min={0}
                      />
                      <button type="submit" className="order-btn">
                        Save
                      </button>
                    </form>
                  </td>
                  <td>{office.city}</td>
                  <td>{office.country}</td>
                  <td>{office.phone}</td>
                  <td>
                    <ToggleActive
                      id={office.id}
                      isActive={office.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td>
                    <DeleteButton
                      id={office.id}
                      onDelete={handleDelete}
                      confirmMessage="Are you sure you want to delete this office?"
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
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9v.01" />
                <path d="M9 12v.01" />
                <path d="M9 15v.01" />
                <path d="M9 18v.01" />
              </svg>
            </div>
            <div className="empty-state-title">No offices yet</div>
            <div className="empty-state-text">Add your first office location</div>
          </div>
        )}
      </div>
    </div>
  )
}
