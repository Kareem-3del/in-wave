import { getTeamInfo } from '@/lib/data/team-info'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlertMessage } from '@/components/dashboard/AlertMessage'
import { TeamInfoForm } from './TeamInfoForm'

// Helper to get form field value with or without prefix
function getField(formData: FormData, name: string): string {
  let value = formData.get(name) as string
  if (value) return value
  for (const prefix of ['1_', '2_', '0_']) {
    value = formData.get(`${prefix}${name}`) as string
    if (value) return value
  }
  return ''
}

async function handleSave(formData: FormData) {
  'use server'
  const supabase = await createClient()

  const titleLinesRaw = getField(formData, 'title_lines')
  const descParagraphsRaw = getField(formData, 'description_paragraphs')

  const data = {
    title_lines: titleLinesRaw.split('\n').filter(Boolean),
    description_paragraphs: descParagraphsRaw.split('\n\n').filter(Boolean),
    image_url: getField(formData, 'image_url'),
    years_experience: parseInt(getField(formData, 'years_experience')) || 10,
    projects_count: parseInt(getField(formData, 'projects_count')) || 90,
    countries_count: parseInt(getField(formData, 'countries_count')) || 10,
  }

  const existingId = getField(formData, 'id')

  let result
  if (existingId) {
    result = await supabase.from('team_info').update(data).eq('id', existingId)
  } else {
    result = await supabase.from('team_info').insert(data)
  }

  if (result.error) {
    console.error('Error saving team info:', result.error)
    redirect(`/dashboard/team?error=save_failed&msg=${encodeURIComponent(result.error.message)}`)
  }

  revalidatePath('/dashboard/team')
  revalidatePath('/') // Refresh homepage too
  redirect('/dashboard/team?success=saved')
}

export default async function TeamInfoPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; msg?: string }> }) {
  const teamInfo = await getTeamInfo()
  const params = await searchParams

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Team Info</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'saved' && (
        <AlertMessage type="success" message="Team info saved successfully!" />
      )}
      {params.error === 'save_failed' && (
        <AlertMessage type="error" message={`Failed to save team info: ${params.msg || 'Please try again.'}`} />
      )}

      <div className="card">
        <TeamInfoForm teamInfo={teamInfo} onSave={handleSave} />
      </div>
    </div>
  )
}
