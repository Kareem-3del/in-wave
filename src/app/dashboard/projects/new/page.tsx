import { ProjectForm } from '@/components/dashboard/ProjectForm'
import { createProjectAction } from '../actions'
import Link from 'next/link'

export default function NewProjectPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add New Project</h1>
      </div>

      <div className="card">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  )
}
