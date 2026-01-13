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
    <div>
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

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>Add New Office</h3>
        <form action={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="City name"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>Country</label>
              <input
                type="text"
                name="country"
                className="form-input"
                placeholder="Country name"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              name="phone"
              className="form-input"
              placeholder="Phone"
              required
              style={{ flex: 1, minWidth: 150 }}
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email (optional)"
              style={{ flex: 1, minWidth: 150 }}
            />
            <input
              type="number"
              name="display_order"
              className="form-input"
              placeholder="Order"
              defaultValue={offices.length}
              style={{ width: 80 }}
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
                    <form action={handleUpdateOrder} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="hidden" name="id" value={office.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={office.display_order}
                        style={{ width: 50, padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                        min={0}
                      />
                      <button type="submit" style={{ padding: '4px 8px', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
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
            <div className="empty-state-icon">🏢</div>
            <div className="empty-state-title">No offices yet</div>
            <div className="empty-state-text">Add your first office location</div>
          </div>
        )}
      </div>
    </div>
  )
}
