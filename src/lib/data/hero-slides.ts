import { createClient } from '@/lib/supabase/server'
import type { HeroSlide, HeroSlideInsert, HeroSlideUpdate } from '@/lib/types/database'

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createHeroSlide(slide: HeroSlideInsert): Promise<HeroSlide> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .insert(slide)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHeroSlide(id: string, slide: HeroSlideUpdate): Promise<HeroSlide> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .update(slide)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id)

  if (error) throw error
}
