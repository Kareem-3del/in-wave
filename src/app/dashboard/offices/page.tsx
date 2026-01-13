import { getAllOffices } from '@/lib/data/offices'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'

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

async function handleCreate(formData: FormData) {
  'use server'
  const city_en = formData.get('city_en') as string
  const city_ar = formData.get('city_ar') as string
  const country_en = formData.get('country_en') as string
  const country_ar = formData.get('country_ar') as string
  const phone = formData.get('phone') as string

  if (!city_en || !country_en || !phone) {
    redirect('/dashboard/offices?error=missing_fields')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('offices').insert({
    city: city_en,
    city_en,
    city_ar: city_ar || null,
    country: country_en,
    country_en,
    country_ar: country_ar || null,
    phone,
    phone_href: `tel:${phone.replace(/\s/g, '')}`,
    email: formData.get('email') as string || null,
    email_href: formData.get('email') ? `mailto:${formData.get('email')}` : null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: true,
  })

  if (error) {
    console.error('Error creating office:', error)
    redirect('/dashboard/offices?error=create_failed')
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

export default async function OfficesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const offices = await getAllOffices()
  const params = await searchParams

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Office Locations</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'office_created' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 8, marginBottom: 16, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✓</span> Office created successfully!
        </div>
      )}
      {params.error === 'missing_fields' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Please fill in all required fields (City, Country, Phone)
        </div>
      )}
      {params.error === 'create_failed' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Failed to create office. Please try again.
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>Add New Office</h3>
        <form action={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇺🇸 City (English)</label>
              <input
                type="text"
                name="city_en"
                className="form-input"
                placeholder="City (English)"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇸🇦 المدينة (عربي)</label>
              <input
                type="text"
                name="city_ar"
                className="form-input"
                placeholder="المدينة"
                dir="rtl"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇺🇸 Country (English)</label>
              <input
                type="text"
                name="country_en"
                className="form-input"
                placeholder="Country (English)"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇸🇦 البلد (عربي)</label>
              <input
                type="text"
                name="country_ar"
                className="form-input"
                placeholder="البلد"
                dir="rtl"
                style={{ fontFamily: 'Cairo, sans-serif' }}
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
                <th>🇺🇸 City</th>
                <th>🇸🇦 المدينة</th>
                <th>🇺🇸 Country</th>
                <th>🇸🇦 البلد</th>
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
                  <td>{office.city_en || office.city}</td>
                  <td style={{ direction: 'rtl' }}>{office.city_ar || '-'}</td>
                  <td>{office.country_en || office.country}</td>
                  <td style={{ direction: 'rtl' }}>{office.country_ar || '-'}</td>
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
