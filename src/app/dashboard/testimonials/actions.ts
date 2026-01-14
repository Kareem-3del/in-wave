'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createTestimonialAction(formData: FormData) {
  // Get form fields (BilingualInput sends name_en, text_en)
  const name = formData.get('name_en') as string || formData.get('name') as string
  const text = formData.get('text_en') as string || formData.get('text') as string

  // Validate required fields
  if (!name || !text) {
    redirect('/dashboard/testimonials?error=missing_fields')
  }

  const supabase = await createClient()
  const image_url = formData.get('image_url') as string || null

  // Only use columns that exist in the database
  const { error } = await supabase.from('testimonials').insert({
    name,
    text,
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

  // Get form fields (BilingualInput sends name_en, text_en)
  const name = formData.get('name_en') as string || formData.get('name') as string
  const text = formData.get('text_en') as string || formData.get('text') as string

  // Validate required fields
  if (!name || !text) {
    redirect('/dashboard/testimonials?error=missing_fields')
  }

  const supabase = await createClient()
  const image_url = formData.get('image_url') as string || null

  // Only use columns that exist in the database
  const { error } = await supabase.from('testimonials').update({
    name,
    text,
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
