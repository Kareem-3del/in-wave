import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/dashboard/ProjectForm'
import { getProjectById } from '@/lib/data/projects'
import { updateProjectAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Project</h1>
      </div>

      <div className="card">
        <ProjectForm project={project} action={updateProjectAction} />
      </div>
    </div>
  )
}
