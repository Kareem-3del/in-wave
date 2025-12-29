import { createClient } from '@/lib/supabase/server'
import type { SocialLink, SocialLinkInsert, SocialLinkUpdate } from '@/lib/types/database'

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getSocialLinkById(id: string): Promise<SocialLink | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createSocialLink(link: SocialLinkInsert): Promise<SocialLink> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .insert(link)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSocialLink(id: string, link: SocialLinkUpdate): Promise<SocialLink> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .update(link)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSocialLink(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)

  if (error) throw error
}
