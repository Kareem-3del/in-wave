import { getAllWorkStages } from '@/lib/data/work-stages'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'

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

  const supabase = await createClient()
  await supabase.from('work_stages').insert({
    stage_number: formData.get('stage_number') as string,
    title: title_en,
    title_en,
    title_ar: title_ar || null,
    description: description_en,
    description_en,
    description_ar: description_ar || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: true,
  })
  revalidatePath('/dashboard/work-stages')
}

export default async function WorkStagesPage() {
  const stages = await getAllWorkStages()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Work Stages</h1>
      </div>

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
                style={{ fontFamily: 'Cairo, sans-serif' }}
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
                style={{ fontFamily: 'Cairo, sans-serif' }}
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
                  <td>{stage.display_order}</td>
                  <td>{stage.stage_number}</td>
                  <td>{stage.title_en || stage.title}</td>
                  <td style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>{stage.title_ar || '-'}</td>
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
