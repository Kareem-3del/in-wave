import Link from 'next/link'
import { getAllHeroSlides } from '@/lib/data/hero-slides'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HeroSlideForm } from './HeroSlideForm'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { DuplicateOrderWarning } from '@/components/dashboard/DuplicateOrderWarning'

async function handleToggle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('hero_slides').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/dashboard/hero')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('hero_slides').delete().eq('id', id)
  revalidatePath('/dashboard/hero')
}

async function handleCreate(formData: FormData) {
  'use server'
  const image_url = formData.get('image_url') as string

  if (!image_url) {
    redirect('/dashboard/hero?error=missing_image')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('hero_slides').insert({
    image_url,
    alt_text: formData.get('alt_text') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: true,
  })

  if (error) {
    console.error('Error creating hero slide:', error)
    redirect('/dashboard/hero?error=create_failed')
  }

  revalidatePath('/dashboard/hero')
  redirect('/dashboard/hero?success=slide_created')
}

async function handleUpdate(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('hero_slides').update({
    image_url: formData.get('image_url') as string,
    alt_text: formData.get('alt_text') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }).eq('id', id)

  if (error) {
    console.error('Error updating hero slide:', error)
    redirect('/dashboard/hero?error=update_failed')
  }

  revalidatePath('/dashboard/hero')
  redirect('/dashboard/hero?success=slide_updated')
}

async function handleUpdateOrder(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0
  const supabase = await createClient()
  await supabase.from('hero_slides').update({ display_order }).eq('id', id)
  revalidatePath('/dashboard/hero')
}

export default async function HeroSlidesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const slides = await getAllHeroSlides()
  const params = await searchParams

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hero Slides</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'slide_created' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 8, marginBottom: 16, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✓</span> Hero slide created successfully!
        </div>
      )}
      {params.success === 'slide_updated' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 8, marginBottom: 16, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✓</span> Hero slide updated successfully!
        </div>
      )}
      {params.error === 'missing_image' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Please upload an image first.
        </div>
      )}
      {params.error === 'create_failed' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Failed to create slide. Please try again.
        </div>
      )}
      {params.error === 'update_failed' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Failed to update slide. Please try again.
        </div>
      )}

      {/* Duplicate Order Warning */}
      <DuplicateOrderWarning items={slides.map(s => ({ id: s.id, display_order: s.display_order }))} />

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>Add New Slide</h3>
        <HeroSlideForm onSubmit={handleCreate} defaultOrder={slides.length} />
      </div>

      <div className="card">
        {slides.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Image URL</th>
                <th>Alt Text</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id}>
                  <td>
                    <img
                      src={slide.image_url}
                      alt={slide.alt_text || ''}
                      style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {slide.image_url}
                  </td>
                  <td>{slide.alt_text || '-'}</td>
                  <td>
                    <form action={handleUpdateOrder} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="hidden" name="id" value={slide.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={slide.display_order}
                        style={{ width: 50, padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                        min={0}
                      />
                      <button type="submit" style={{ padding: '4px 8px', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
                        Save
                      </button>
                    </form>
                  </td>
                  <td>
                    <ToggleActive
                      id={slide.id}
                      isActive={slide.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td>
                    <div className="actions">
                      <Link href={`/dashboard/hero/${slide.id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <DeleteButton
                        id={slide.id}
                        onDelete={handleDelete}
                        confirmMessage="Are you sure you want to delete this slide?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <div className="empty-state-title">No hero slides yet</div>
            <div className="empty-state-text">Add your first slide using the form above</div>
          </div>
        )}
      </div>
    </div>
  )
}
