import { getAllWorkStages } from '@/lib/data/work-stages'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { DuplicateOrderWarning } from '@/components/dashboard/DuplicateOrderWarning'

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

async function handleCreate(formData: FormData) {
  'use server'
  const title_en = formData.get('title_en') as string
  const title_ar = formData.get('title_ar') as string
  const description_en = formData.get('description_en') as string
  const description_ar = formData.get('description_ar') as string
  const stage_number = formData.get('stage_number') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0

  // Validate required fields
  if (!title_en || !description_en || !stage_number) {
    // Redirect with error
    redirect('/dashboard/work-stages?error=missing_fields')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('work_stages').insert({
    stage_number,
    title: title_en,
    title_en,
    title_ar: title_ar || null,
    description: description_en,
    description_en,
    description_ar: description_ar || null,
    display_order,
    is_active: true,
  })

  if (error) {
    console.error('Error creating stage:', error)
    redirect('/dashboard/work-stages?error=create_failed')
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

export default async function WorkStagesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const stages = await getAllWorkStages()
  const params = await searchParams

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Work Stages</h1>
      </div>

      {/* Alert Messages */}
      {params.success === 'stage_created' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 8, marginBottom: 16, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✓</span> Stage created successfully!
        </div>
      )}
      {params.error === 'missing_fields' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Please fill in all required fields (Stage #, Title, Description)
        </div>
      )}
      {params.error === 'create_failed' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Failed to create stage. Please try again.
        </div>
      )}

      {/* Duplicate Order Warning */}
      <DuplicateOrderWarning items={stages.map(s => ({ id: s.id, display_order: s.display_order }))} />

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>Add New Stage</h3>
        <form action={handleCreate}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              name="stage_number"
              className="form-input"
              placeholder="Stage # (e.g., 01)"
              required
              style={{ width: 100 }}
            />
            <input
              type="number"
              name="display_order"
              className="form-input"
              placeholder="Order"
              defaultValue={stages.length}
              style={{ width: 80 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇺🇸 Title (English)</label>
              <input
                type="text"
                name="title_en"
                className="form-input"
                placeholder="Stage Title (English)"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇸🇦 العنوان (عربي)</label>
              <input
                type="text"
                name="title_ar"
                className="form-input"
                placeholder="عنوان المرحلة"
                dir="rtl"
                style={{ }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇺🇸 Description (English)</label>
              <textarea
                name="description_en"
                className="form-textarea"
                placeholder="Stage description..."
                required
                rows={3}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>🇸🇦 الوصف (عربي)</label>
              <textarea
                name="description_ar"
                className="form-textarea"
                placeholder="وصف المرحلة..."
                dir="rtl"
                rows={3}
                style={{ }}
              />
            </div>
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
                <th>🇺🇸 Title</th>
                <th>🇸🇦 العنوان</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr key={stage.id}>
                  <td>
                    <form action={handleUpdateOrder} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="hidden" name="id" value={stage.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={stage.display_order}
                        style={{ width: 50, padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                        min={0}
                      />
                      <button type="submit" style={{ padding: '4px 8px', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
                        Save
                      </button>
                    </form>
                  </td>
                  <td>{stage.stage_number}</td>
                  <td>{stage.title_en || stage.title}</td>
                  <td style={{ direction: 'rtl' }}>{stage.title_ar || '-'}</td>
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
            <div className="empty-state-icon">📈</div>
            <div className="empty-state-title">No work stages yet</div>
            <div className="empty-state-text">Add stages to show your work process</div>
          </div>
        )}
      </div>
    </div>
  )
}
