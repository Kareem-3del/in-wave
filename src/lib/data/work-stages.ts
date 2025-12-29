import { createClient } from '@/lib/supabase/server'
import type { WorkStage, WorkStageInsert, WorkStageUpdate } from '@/lib/types/database'

export async function getWorkStages(): Promise<WorkStage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_stages')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllWorkStages(): Promise<WorkStage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_stages')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getWorkStageById(id: string): Promise<WorkStage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_stages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createWorkStage(stage: WorkStageInsert): Promise<WorkStage> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_stages')
    .insert(stage)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateWorkStage(id: string, stage: WorkStageUpdate): Promise<WorkStage> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_stages')
    .update(stage)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteWorkStage(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('work_stages')
    .delete()
    .eq('id', id)

  if (error) throw error
}
