import Link from 'next/link'
import { getAllProjects, deleteProject } from '@/lib/data/projects'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from '@/components/dashboard/DeleteButton'
import { ToggleActive } from '@/components/dashboard/ToggleActive'

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

export default async function ProjectsPage() {
  const projects = await getAllProjects()

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
                  <td>{project.display_order}</td>
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
