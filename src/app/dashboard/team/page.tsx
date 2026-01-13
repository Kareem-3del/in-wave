import { getTeamInfo } from '@/lib/data/team-info'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlertMessage } from '@/components/dashboard/AlertMessage'

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
    years_experience: parseInt(getField(formData, 'years_experience')) || 8,
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
    <div>
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
        <form action={handleSave}>
          {teamInfo && <input type="hidden" name="id" value={teamInfo.id} />}

          <div className="form-group">
            <label className="form-label">Title Lines (one per line)</label>
            <textarea
              name="title_lines"
              className="form-textarea"
              defaultValue={teamInfo?.title_lines?.join('\n') || '8 years experience\nin combination with a\nperfect taste'}
              rows={4}
              placeholder="First line&#10;Second line&#10;Third line"
            />
            <p className="form-hint">Each line appears on the About section</p>
          </div>

          <div className="form-group">
            <label className="form-label">Description Paragraphs (separate with blank lines)</label>
            <textarea
              name="description_paragraphs"
              className="form-textarea"
              defaultValue={teamInfo?.description_paragraphs?.join('\n\n') || 'First paragraph here.\n\nSecond paragraph here.'}
              rows={8}
              placeholder="First paragraph&#10;&#10;Second paragraph"
            />
            <p className="form-hint">Separate paragraphs with blank lines</p>
          </div>

          <div className="form-group">
            <label className="form-label">Team Image URL</label>
            <input
              type="text"
              name="image_url"
              className="form-input"
              defaultValue={teamInfo?.image_url || '/images/team.jpg'}
              placeholder="/images/team.jpg"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Years Experience</label>
              <input
                type="number"
                name="years_experience"
                className="form-input"
                defaultValue={teamInfo?.years_experience || 8}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Projects Count</label>
              <input
                type="number"
                name="projects_count"
                className="form-input"
                defaultValue={teamInfo?.projects_count || 90}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Countries Count</label>
              <input
                type="number"
                name="countries_count"
                className="form-input"
                defaultValue={teamInfo?.countries_count || 10}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
