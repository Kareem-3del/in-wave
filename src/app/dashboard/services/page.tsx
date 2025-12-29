import { getAllServices } from '@/lib/data/services'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'

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
  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string

  const supabase = await createClient()
  await supabase.from('services').insert({
    name: name_en,
    name_en,
    name_ar: name_ar || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: true,
  })
  revalidatePath('/dashboard/services')
}

export default async function ServicesPage() {
  const services = await getAllServices()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Services</h1>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>Add New Service</h3>
        <form action={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇺🇸 English</label>
              <input
                type="text"
                name="name_en"
                className="form-input"
                placeholder="Service name (English)"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇸🇦 العربية</label>
              <input
                type="text"
                name="name_ar"
                className="form-input"
                placeholder="اسم الخدمة (عربي)"
                dir="rtl"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="number"
              name="display_order"
              className="form-input"
              placeholder="Order"
              defaultValue={services.length}
              style={{ width: 80 }}
            />
            <button type="submit" className="btn btn-primary">Add Service</button>
          </div>
        </form>
        <p className="form-hint" style={{ marginTop: 8 }}>These services appear in the contact form dropdown</p>
      </div>

      <div className="card">
        {services.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>🇺🇸 English</th>
                <th>🇸🇦 Arabic</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.display_order}</td>
                  <td>{service.name_en || service.name}</td>
                  <td style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>{service.name_ar || '-'}</td>
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
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No services yet</div>
            <div className="empty-state-text">Add services that will appear in the contact form</div>
          </div>
        )}
      </div>
    </div>
  )
}
