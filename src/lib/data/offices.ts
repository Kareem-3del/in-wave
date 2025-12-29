import { createClient } from '@/lib/supabase/server'
import type { Office, OfficeInsert, OfficeUpdate } from '@/lib/types/database'

export async function getOffices(): Promise<Office[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllOffices(): Promise<Office[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getOfficeById(id: string): Promise<Office | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createOffice(office: OfficeInsert): Promise<Office> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('offices')
    .insert(office)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOffice(id: string, office: OfficeUpdate): Promise<Office> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('offices')
    .update(office)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOffice(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('offices')
    .delete()
    .eq('id', id)

  if (error) throw error
}
