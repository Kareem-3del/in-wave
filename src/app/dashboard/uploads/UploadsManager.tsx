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
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        Loading uploads...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          color: '#dc2626',
          marginBottom: 16
        }}>
          {error}
        </div>
        <button onClick={loadUploads} className="btn btn-secondary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{
          flex: 1,
          padding: 16,
          background: '#f9fafb',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a' }}>{data?.total || 0}</div>
          <div style={{ fontSize: 13, color: '#666' }}>Total Files</div>
        </div>
        <div style={{
          flex: 1,
          padding: 16,
          background: '#ecfdf5',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{data?.used || 0}</div>
          <div style={{ fontSize: 13, color: '#059669' }}>In Use</div>
        </div>
        <div style={{
          flex: 1,
          padding: 16,
          background: '#fef3c7',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#d97706' }}>{data?.unused || 0}</div>
          <div style={{ fontSize: 13, color: '#d97706' }}>Unused</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              background: filter === 'all' ? '#1a1a1a' : '#fff',
              color: filter === 'all' ? '#fff' : '#1a1a1a',
              border: '1px solid #ddd',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('used')}
            style={{
              padding: '8px 16px',
              background: filter === 'used' ? '#059669' : '#fff',
              color: filter === 'used' ? '#fff' : '#059669',
              border: '1px solid #ddd',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            In Use
          </button>
          <button
            onClick={() => setFilter('unused')}
            style={{
              padding: '8px 16px',
              background: filter === 'unused' ? '#d97706' : '#fff',
              color: filter === 'unused' ? '#fff' : '#d97706',
              border: '1px solid #ddd',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Unused
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {selected.size > 0 ? (
            <>
              <span style={{ alignSelf: 'center', color: '#666', fontSize: 14 }}>
                {selected.size} selected
              </span>
              <button
                onClick={clearSelection}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              <button
                onClick={deleteSelected}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: deleting ? 'wait' : 'pointer',
                  fontWeight: 500
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={selectAllUnused}
                disabled={data?.unused === 0}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  color: data?.unused === 0 ? '#ccc' : '#d97706',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: data?.unused === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 500
                }}
              >
                Select All Unused
              </button>
              <button
                onClick={loadUploads}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Refresh
              </button>
            </>
          )}
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          color: '#666',
          background: '#f9fafb',
          borderRadius: 8
        }}>
          {filter === 'all' ? 'No files uploaded yet.' : `No ${filter} files.`}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16
        }}>
          {filteredFiles.map((file) => (
            <div
              key={file.name}
              onClick={() => !file.isUsed && toggleSelect(file.name)}
              style={{
                border: selected.has(file.name)
                  ? '2px solid #3b82f6'
                  : file.isUsed
                    ? '1px solid #d1fae5'
                    : '1px solid #fde68a',
                borderRadius: 8,
                overflow: 'hidden',
                background: selected.has(file.name) ? '#eff6ff' : '#fff',
                cursor: file.isUsed ? 'default' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={file.url}
                  alt={file.name}
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  background: file.isUsed ? '#059669' : '#d97706',
                  color: '#fff'
                }}>
                  {file.isUsed ? 'IN USE' : 'UNUSED'}
                </div>
                {!file.isUsed && (
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: selected.has(file.name) ? '#3b82f6' : 'rgba(255,255,255,0.9)',
                    border: selected.has(file.name) ? 'none' : '2px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14
                  }}>
                    {selected.has(file.name) && '✓'}
                  </div>
                )}
              </div>
              <div style={{
                padding: '8px 10px',
                borderTop: '1px solid #eee',
                background: '#fafafa'
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#333',
                  marginBottom: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 10, color: '#888' }}>
                  {formatSize(file.size)} • {formatDate(file.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div style={{
        marginTop: 24,
        padding: 16,
        background: '#f9fafb',
        borderRadius: 8,
        fontSize: 13,
        color: '#666'
      }}>
        <strong>How it works:</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li>Files marked <span style={{ color: '#059669', fontWeight: 600 }}>IN USE</span> are referenced in projects, hero slides, or team info.</li>
          <li>Files marked <span style={{ color: '#d97706', fontWeight: 600 }}>UNUSED</span> can be safely deleted to save storage space.</li>
          <li>Click on unused files to select them, then click &quot;Delete Selected&quot; to remove.</li>
        </ul>
      </div>
    </div>
  )
}
