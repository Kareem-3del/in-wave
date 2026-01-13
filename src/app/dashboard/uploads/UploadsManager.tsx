'use client'

import { useState, useEffect } from 'react'

interface UploadFile {
  name: string
  url: string
  size: number
  created_at: string
  isUsed: boolean
}

interface UploadsData {
  files: UploadFile[]
  total: number
  used: number
  unused: number
}

export function UploadsManager() {
  const [data, setData] = useState<UploadsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all')

  const loadUploads = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/uploads')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load uploads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUploads()
  }, [])

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleSelect = (filename: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(filename)) {
      newSelected.delete(filename)
    } else {
      newSelected.add(filename)
    }
    setSelected(newSelected)
  }

  const selectAllUnused = () => {
    if (!data) return
    const unusedFiles = data.files.filter(f => !f.isUsed).map(f => f.name)
    setSelected(new Set(unusedFiles))
  }

  const clearSelection = () => {
    setSelected(new Set())
  }

  const deleteSelected = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} file(s)? This cannot be undone.`)) return

    setDeleting(true)
    try {
      const res = await fetch('/api/uploads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames: Array.from(selected) })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setSelected(new Set())
      await loadUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete files')
    } finally {
      setDeleting(false)
    }
  }

  const filteredFiles = data?.files.filter(file => {
    if (filter === 'used') return file.isUsed
    if (filter === 'unused') return !file.isUsed
    return true
  }) || []

  if (loading) {
    return (
      <div className="uploads-loading">
        Loading uploads...
      </div>
    )
  }

  if (error) {
    return (
      <div className="uploads-error-container">
        <div className="uploads-error">
          {error}
        </div>
        <button onClick={loadUploads} className="btn btn-secondary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="uploads-manager">
      {/* Stats */}
      <div className="uploads-stats">
        <div className="stat-box stat-total">
          <div className="stat-number">{data?.total || 0}</div>
          <div className="stat-text">Total Files</div>
        </div>
        <div className="stat-box stat-used">
          <div className="stat-number">{data?.used || 0}</div>
          <div className="stat-text">In Use</div>
        </div>
        <div className="stat-box stat-unused">
          <div className="stat-number">{data?.unused || 0}</div>
          <div className="stat-text">Unused</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="uploads-toolbar">
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`filter-btn filter-used ${filter === 'used' ? 'active' : ''}`}
          >
            In Use
          </button>
          <button
            onClick={() => setFilter('unused')}
            className={`filter-btn filter-unused ${filter === 'unused' ? 'active' : ''}`}
          >
            Unused
          </button>
        </div>

        <div className="action-buttons">
          {selected.size > 0 ? (
            <>
              <span className="selected-count">
                {selected.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="btn btn-secondary btn-sm"
              >
                Clear
              </button>
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="btn btn-danger btn-sm"
              >
                {deleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={selectAllUnused}
                disabled={data?.unused === 0}
                className="btn btn-outline btn-sm"
              >
                Select All Unused
              </button>
              <button
                onClick={loadUploads}
                className="btn btn-secondary btn-sm"
              >
                Refresh
              </button>
            </>
          )}
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="uploads-empty">
          {filter === 'all' ? 'No files uploaded yet.' : `No ${filter} files.`}
        </div>
      ) : (
        <div className="uploads-grid">
          {filteredFiles.map((file) => (
            <div
              key={file.name}
              onClick={() => !file.isUsed && toggleSelect(file.name)}
              className={`upload-card ${selected.has(file.name) ? 'selected' : ''} ${file.isUsed ? 'in-use' : 'unused'}`}
            >
              <div className="upload-preview">
                <img
                  src={file.url}
                  alt={file.name}
                  className="upload-image"
                />
                <div className={`upload-badge ${file.isUsed ? 'badge-used' : 'badge-unused'}`}>
                  {file.isUsed ? 'IN USE' : 'UNUSED'}
                </div>
                {!file.isUsed && (
                  <div className={`upload-checkbox ${selected.has(file.name) ? 'checked' : ''}`}>
                    {selected.has(file.name) && '✓'}
                  </div>
                )}
              </div>
              <div className="upload-info">
                <div className="upload-name">
                  {file.name}
                </div>
                <div className="upload-meta">
                  {formatSize(file.size)} • {formatDate(file.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="uploads-help">
        <strong>How it works:</strong>
        <ul>
          <li>Files marked <span className="text-success">IN USE</span> are referenced in projects, hero slides, or team info.</li>
          <li>Files marked <span className="text-warning">UNUSED</span> can be safely deleted to save storage space.</li>
          <li>Click on unused files to select them, then click &quot;Delete Selected&quot; to remove.</li>
        </ul>
      </div>
    </div>
  )
}
