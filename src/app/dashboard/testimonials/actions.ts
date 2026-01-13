'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createTestimonial, updateTestimonial } from '@/lib/data/testimonials'
import type { TestimonialInsert, TestimonialUpdate } from '@/lib/types/database'

export async function createTestimonialAction(formData: FormData) {
  // Get bilingual fields
  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const text_en = formData.get('text_en') as string
  const text_ar = formData.get('text_ar') as string

  const testimonial: TestimonialInsert = {
    // Legacy fields (use English as default)
    name: name_en,
    text: text_en,
    // Bilingual fields
    name_en,
    name_ar: name_ar || null,
    text_en,
    text_ar: text_ar || null,
    rating: parseInt(formData.get('rating') as string) || 5,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }

  let success = false
  try {
    await createTestimonial(testimonial)
    success = true
  } catch (error) {
    console.error('Error creating testimonial:', error)
  }

  revalidatePath('/dashboard/testimonials')
  if (success) {
    redirect('/dashboard/testimonials?success=testimonial_created')
  } else {
    redirect('/dashboard/testimonials?error=create_failed')
  }
}

export async function updateTestimonialAction(formData: FormData) {
  const id = formData.get('id') as string

  // Get bilingual fields
  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const text_en = formData.get('text_en') as string
  const text_ar = formData.get('text_ar') as string

  const testimonial: TestimonialUpdate = {
    // Legacy fields (use English as default)
    name: name_en,
    text: text_en,
    // Bilingual fields
    name_en,
    name_ar: name_ar || null,
    text_en,
    text_ar: text_ar || null,
    rating: parseInt(formData.get('rating') as string) || 5,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }

  let success = false
  try {
    await updateTestimonial(id, testimonial)
    success = true
  } catch (error) {
    console.error('Error updating testimonial:', error)
  }

  revalidatePath('/dashboard/testimonials')
  if (success) {
    redirect('/dashboard/testimonials?success=testimonial_updated')
  } else {
    redirect('/dashboard/testimonials?error=update_failed')
  }
}
