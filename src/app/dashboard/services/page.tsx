import { getAllServices } from '@/lib/data/services'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlertMessage } from '@/components/dashboard/AlertMessage'
import { ServiceForm } from './ServiceForm'

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
  revalidatePath('/') // Refresh frontend
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/dashboard/services')
  revalidatePath('/') // Refresh frontend
}

async function handleCreate(formData: FormData) {
  'use server'
  const name_en = getField(formData, 'name_en') || getField(formData, 'name')
  const name_ar = getField(formData, 'name_ar') || null
  const description_en = getField(formData, 'description_en') || null
  const description_ar = getField(formData, 'description_ar') || null
  const icon = getField(formData, 'icon') || null
  const display_order = getField(formData, 'display_order')

  if (!name_en) {
    redirect('/dashboard/services?error=missing_name')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('services').insert({
    name: name_en,
    name_en,
    name_ar,
    description_en,
    description_ar,
    icon,
    display_order: parseInt(display_order) || 0,
    is_active: true,
  })

  if (error) {
    console.error('Error creating service:', error)
    redirect(`/dashboard/services?error=create_failed&msg=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/services')
  revalidatePath('/') // Refresh frontend
  revalidatePath('/services') // Refresh services page
  redirect('/dashboard/services?success=service_created')
}

async function handleUpdate(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const name_en = getField(formData, 'name_en') || getField(formData, 'name')
  const name_ar = getField(formData, 'name_ar') || null
  const description_en = getField(formData, 'description_en') || null
  const description_ar = getField(formData, 'description_ar') || null
  const icon = getField(formData, 'icon') || null
  const display_order = getField(formData, 'display_order')

  if (!name_en) {
    redirect('/dashboard/services?error=missing_name')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('services').update({
    name: name_en,
    name_en,
    name_ar,
    description_en,
    description_ar,
    icon,
    display_order: parseInt(display_order) || 0,
  }).eq('id', id)

  if (error) {
    console.error('Error updating service:', error)
    redirect(`/dashboard/services?error=update_failed&msg=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/services')
  revalidatePath('/') // Refresh frontend
  revalidatePath('/services') // Refresh services page
  redirect('/dashboard/services?success=service_updated')
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
      {(params.success === 'service_created' || params.success === 'service_updated') && (
        <AlertMessage type="success" message={params.success === 'service_created' ? "Service created successfully!" : "Service updated successfully!"} />
      )}
      {params.error === 'missing_name' && (
        <AlertMessage type="error" message="Please enter a service name" />
      )}
      {(params.error === 'create_failed' || params.error === 'update_failed') && (
        <AlertMessage type="error" message={`Failed: ${params.msg || 'Please try again.'}`} />
      )}

      <div className="card mb-6">
        <h3 className="card-title mb-4">Add New Service</h3>
        <ServiceForm
          isNew={true}
          onSave={handleCreate}
          defaultOrder={services.length}
        />
        <p className="form-hint mt-4">These services appear on the Services page and in the contact form dropdown</p>
      </div>

      <div className="card">
        <h3 className="card-title mb-4">Manage Services ({services.length})</h3>
        {services.length > 0 ? (
          <div className="services-list">
            {services.map((service) => (
              <ServiceForm
                key={service.id}
                service={service}
                onSave={handleUpdate}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
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
            <div className="empty-state-text">Add services that will appear on the Services page</div>
          </div>
        )}
      </div>
    </div>
  )
}
