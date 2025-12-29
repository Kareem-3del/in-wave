import { createClient } from '@/lib/supabase/server'
import type { TeamInfo, TeamInfoInsert, TeamInfoUpdate } from '@/lib/types/database'

export async function getTeamInfo(): Promise<TeamInfo | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_info')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createTeamInfo(info: TeamInfoInsert): Promise<TeamInfo> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_info')
    .insert(info)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTeamInfo(id: string, info: TeamInfoUpdate): Promise<TeamInfo> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_info')
    .update(info)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function upsertTeamInfo(info: TeamInfoInsert): Promise<TeamInfo> {
  const existing = await getTeamInfo()

  if (existing) {
    return updateTeamInfo(existing.id, info)
  } else {
    return createTeamInfo(info)
  }
}
