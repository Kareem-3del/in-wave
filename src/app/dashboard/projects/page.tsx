import Link from 'next/link'
import { getAllProjects, deleteProject } from '@/lib/data/projects'
import { revalidatePath } from 'next/cache'
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

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; msg?: string }> }) {
  const projects = await getAllProjects()
  const params = await searchParams

  return (
    <div className="fade-in">
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
        <AlertMessage type="success" message="Project created successfully!" />
      )}
      {params.success === 'project_updated' && (
        <AlertMessage type="success" message="Project updated successfully!" />
      )}
      {params.error === 'create_failed' && (
        <AlertMessage type="error" message={`Failed to create project: ${params.msg || 'Please try again.'}`} />
      )}
      {params.error === 'update_failed' && (
        <AlertMessage type="error" message={`Failed to update project: ${params.msg || 'Please try again.'}`} />
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
                    <form action={handleUpdateOrder} className="inline-order-form">
                      <input type="hidden" name="id" value={project.id} />
                      <input
                        type="number"
                        name="display_order"
                        defaultValue={project.display_order}
                        className="order-input"
                        min={0}
                      />
                      <button type="submit" className="order-btn">
                        Save
                      </button>
                    </form>
                  </td>
                  <td>
                    <span className="text-accent">{project.title_italic}</span>{' '}
                    {project.title_regular}
                  </td>
                  <td>{project.location}</td>
                  <td>{project.year}</td>
                  <td>
                    <span className="badge badge-info">Type {project.type}</span>
                  </td>
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
            <div className="empty-state-icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M2 20h20" />
                <path d="M5 20V8l7-5 7 5v12" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </div>
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
