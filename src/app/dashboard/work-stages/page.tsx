import { getAllWorkStages } from '@/lib/data/work-stages'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { DuplicateOrderWarning } from '@/components/dashboard/DuplicateOrderWarning'
import { AlertMessage } from '@/components/dashboard/AlertMessage'

async function handleToggle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('work_stages').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/dashboard/work-stages')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('work_stages').delete().eq('id', id)
  revalidatePath('/dashboard/work-stages')
}

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

async function handleCreate(formData: FormData) {
  'use server'
  const title = getField(formData, 'title_en') || getField(formData, 'title')
  const description = getField(formData, 'description_en') || getField(formData, 'description')
  const stage_number = getField(formData, 'stage_number')
  const display_order = parseInt(getField(formData, 'display_order')) || 0

  // Validate required fields
  if (!title || !description || !stage_number) {
    redirect('/dashboard/work-stages?error=missing_fields')
  }

  const supabase = await createClient()
  // Only use columns that exist in the database
  const { error } = await supabase.from('work_stages').insert({
    stage_number,
    title,
    description,
    display_order,
    is_active: true,
  })

  if (error) {
    console.error('Error creating stage:', error)
    redirect(`/dashboard/work-stages?error=create_failed&msg=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/work-stages')
  redirect('/dashboard/work-stages?success=stage_created')
}

async function handleUpdateOrder(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0
  const supabase = await createClient()
  await supabase.from('work_stages').update({ display_order }).eq('id', id)
  revalidatePath('/dashboard/work-stages')
}

export default async function WorkStagesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; msg?: string }> }) {
  const stages = await getAllWorkStages()
  const params = await searchParams

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Work Stages</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'stage_created' && (
        <AlertMessage type="success" message="Stage created successfully!" />
      )}
      {params.error === 'missing_fields' && (
        <AlertMessage type="error" message="Please fill in all required fields (Stage #, Title, Description)" />
      )}
      {params.error === 'create_failed' && (
        <AlertMessage type="error" message={`Failed to create stage: ${params.msg || 'Please try again.'}`} />
      )}

      {/* Duplicate Order Warning */}
      <DuplicateOrderWarning items={stages.map(s => ({ id: s.id, display_order: s.display_order }))} />

      <div className="card mb-6">
        <h3 className="card-title mb-4">Add New Stage</h3>
        <form action={handleCreate}>
          <div className="grid-3 mb-4">
            <div>
              <input
                type="text"
                name="stage_number"
                className="form-input"
                placeholder="Stage # (e.g., 01)"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Stage Title"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="display_order"
                className="form-input"
                placeholder="Order"
                defaultValue={stages.length}
              />
            </div>
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Stage description..."
              required
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary">Add Stage</button>
        </form>
      </div>

      <div className="card">
        {stages.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Stage #</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr key={stage.id}>
                  <td>
                    <form action={handleUpdateOrder} className="inline-order-form">
                      <input type="hidden" name="id" value={stage.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={stage.display_order}
                        className="order-input"
                        min={0}
                      />
                      <button type="submit" className="order-btn">
                        Save
                      </button>
                    </form>
                  </td>
                  <td>
                    <span className="badge badge-info">{stage.stage_number}</span>
                  </td>
                  <td>{stage.title}</td>
                  <td>
                    <ToggleActive
                      id={stage.id}
                      isActive={stage.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td>
                    <DeleteButton
                      id={stage.id}
                      onDelete={handleDelete}
                      confirmMessage="Are you sure you want to delete this stage?"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-4 4 4 5-6" />
              </svg>
            </div>
            <div className="empty-state-title">No work stages yet</div>
            <div className="empty-state-text">Add stages to show your work process</div>
          </div>
        )}
      </div>
    </div>
  )
}
