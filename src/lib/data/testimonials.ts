import { createClient } from '@/lib/supabase/server'
import type { Testimonial, TestimonialInsert, TestimonialUpdate } from '@/lib/types/database'

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createTestimonial(testimonial: TestimonialInsert): Promise<Testimonial> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTestimonial(id: string, testimonial: TestimonialUpdate): Promise<Testimonial> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) throw error
}
