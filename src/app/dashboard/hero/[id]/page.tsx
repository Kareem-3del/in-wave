import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { HeroSlideForm } from '../HeroSlideForm'

async function getHeroSlide(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
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
  redirect('/dashboard/hero')
}

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slide = await getHeroSlide(id)

  if (!slide) {
    notFound()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Hero Slide</h1>
        <div className="page-actions">
          <Link href="/dashboard/hero" className="btn btn-secondary">
            Back to Slides
          </Link>
        </div>
      </div>

      <div className="card">
        <HeroSlideForm slide={slide} onSubmit={handleUpdate} />
      </div>
    </div>
  )
}
