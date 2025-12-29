import Link from 'next/link'
import { getAllHeroSlides } from '@/lib/data/hero-slides'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { HeroSlideForm } from './HeroSlideForm'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'

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
  const supabase = await createClient()
  await supabase.from('hero_slides').insert({
    image_url: formData.get('image_url') as string,
    alt_text: formData.get('alt_text') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: true,
  })
  revalidatePath('/dashboard/hero')
}

async function handleUpdate(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('hero_slides').update({
    image_url: formData.get('image_url') as string,
    alt_text: formData.get('alt_text') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }).eq('id', id)
  revalidatePath('/dashboard/hero')
}

export default async function HeroSlidesPage() {
  const slides = await getAllHeroSlides()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hero Slides</h1>
      </div>

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
                  <td>{slide.display_order}</td>
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
