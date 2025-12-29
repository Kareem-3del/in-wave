import { createClient } from '@/lib/supabase/server'
import type { FormSubmission, FormSubmissionInsert, FormSubmissionUpdate } from '@/lib/types/database'

export async function getFormSubmissions(): Promise<FormSubmission[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getFormSubmissionById(id: string): Promise<FormSubmission | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createFormSubmission(submission: FormSubmissionInsert): Promise<FormSubmission> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('form_submissions')
    .insert(submission)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFormSubmission(id: string, submission: FormSubmissionUpdate): Promise<FormSubmission> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('form_submissions')
    .update(submission)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFormSubmission(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('form_submissions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function markSubmissionAsRead(id: string): Promise<FormSubmission> {
  return updateFormSubmission(id, { status: 'read' })
}

export async function markSubmissionAsReplied(id: string): Promise<FormSubmission> {
  return updateFormSubmission(id, { status: 'replied' })
}

export async function archiveSubmission(id: string): Promise<FormSubmission> {
  return updateFormSubmission(id, { status: 'archived' })
}
