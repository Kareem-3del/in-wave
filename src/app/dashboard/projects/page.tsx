import Link from 'next/link'
import { getAllProjects, deleteProject } from '@/lib/data/projects'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'
import { DuplicateOrderWarning } from '@/components/dashboard/DuplicateOrderWarning'

async function handleToggle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('projects').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/dashboard/projects')
}

async function handleDelete(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await deleteProject(id)
  revalidatePath('/dashboard/projects')
}

async function handleUpdateOrder(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0
  const supabase = await createClient()
  await supabase.from('projects').update({ display_order }).eq('id', id)
  revalidatePath('/dashboard/projects')
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const projects = await getAllProjects()
  const params = await searchParams

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <div className="page-actions">
          <Link href="/dashboard/projects/new" className="btn btn-primary">
            + Add Project
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
      {params.success === 'project_created' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 8, marginBottom: 16, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✓</span> Project created successfully!
        </div>
      )}
      {params.success === 'project_updated' && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 8, marginBottom: 16, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✓</span> Project updated successfully!
        </div>
      )}
      {params.error === 'create_failed' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Failed to create project. Please try again.
        </div>
      )}
      {params.error === 'update_failed' && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, marginBottom: 16, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>✕</span> Failed to update project. Please try again.
        </div>
      )}

      {/* Duplicate Order Warning */}
      <DuplicateOrderWarning items={projects.map(p => ({ id: p.id, display_order: p.display_order }))} />

      <div className="card">
        {projects.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Location</th>
                <th>Year</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <form action={handleUpdateOrder} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="hidden" name="id" value={project.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={project.display_order}
                        style={{ width: 50, padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                        min={0}
                      />
                      <button type="submit" style={{ padding: '4px 8px', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
                        Save
                      </button>
                    </form>
                  </td>
                  <td>
                    <em>{project.title_italic}</em> {project.title_regular}
                  </td>
                  <td>{project.location}</td>
                  <td>{project.year}</td>
                  <td>Type {project.type}</td>
                  <td>
                    <ToggleActive
                      id={project.id}
                      isActive={project.is_active}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td>
                    <div className="actions">
                      <Link href={`/dashboard/projects/${project.id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <DeleteButton
                        id={project.id}
                        onDelete={handleDelete}
                        confirmMessage="Are you sure you want to delete this project?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏗️</div>
            <div className="empty-state-title">No projects yet</div>
            <div className="empty-state-text">Add your first project to get started</div>
            <Link href="/dashboard/projects/new" className="btn btn-primary">
              + Add Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
