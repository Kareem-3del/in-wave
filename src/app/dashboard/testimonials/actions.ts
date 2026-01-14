'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createTestimonialAction(formData: FormData) {
  // Get form fields (BilingualInput sends name_en, name_ar, text_en, text_ar)
  const name_en = formData.get('name_en') as string || formData.get('name') as string
  const name_ar = formData.get('name_ar') as string || null
  const text_en = formData.get('text_en') as string || formData.get('text') as string
  const text_ar = formData.get('text_ar') as string || null

  // Validate required fields
  if (!name_en || !text_en) {
    redirect('/dashboard/testimonials?error=missing_fields')
  }

  const supabase = await createClient()
  const image_url = formData.get('image_url') as string || null

  const { error } = await supabase.from('testimonials').insert({
    name: name_en,
    text: text_en,
    name_en,
    name_ar,
    text_en,
    text_ar,
    image_url,
    rating: parseInt(formData.get('rating') as string) || 5,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  })

  revalidatePath('/dashboard/testimonials')
  revalidatePath('/')

  if (error) {
    console.error('Error creating testimonial:', error)
    redirect(`/dashboard/testimonials?error=create_failed&msg=${encodeURIComponent(error.message)}`)
  } else {
    redirect('/dashboard/testimonials?success=testimonial_created')
  }
}

export async function updateTestimonialAction(formData: FormData) {
  const id = formData.get('id') as string

  // Get form fields (BilingualInput sends name_en, name_ar, text_en, text_ar)
  const name_en = formData.get('name_en') as string || formData.get('name') as string
  const name_ar = formData.get('name_ar') as string || null
  const text_en = formData.get('text_en') as string || formData.get('text') as string
  const text_ar = formData.get('text_ar') as string || null

  // Validate required fields
  if (!name_en || !text_en) {
    redirect('/dashboard/testimonials?error=missing_fields')
  }

  const supabase = await createClient()
  const image_url = formData.get('image_url') as string || null

  const { error } = await supabase.from('testimonials').update({
    name: name_en,
    text: text_en,
    name_en,
    name_ar,
    text_en,
    text_ar,
    image_url,
    rating: parseInt(formData.get('rating') as string) || 5,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }).eq('id', id)

  revalidatePath('/dashboard/testimonials')
  revalidatePath('/')

  if (error) {
    console.error('Error updating testimonial:', error)
    redirect(`/dashboard/testimonials?error=update_failed&msg=${encodeURIComponent(error.message)}`)
  } else {
    redirect('/dashboard/testimonials?success=testimonial_updated')
  }
}
