import { UploadsManager } from './UploadsManager'

export default function UploadsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Uploads Manager</h1>
      </div>

      <div className="card">
        <UploadsManager />
      </div>
    </div>
  )
}
