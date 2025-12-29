'use client'

import { useState, DragEvent } from 'react'
import { Icon } from '@iconify/react'

interface Platform {
  id: string
  name: string
  icon: string
}

interface Link {
  platform: string
  href: string
  display_order: number
}

interface SocialLinksManagerProps {
  existingLinks: Link[]
  platforms: Platform[]
  onSave: (links: Link[]) => Promise<void>
}

export function SocialLinksManager({ existingLinks, platforms, onSave }: SocialLinksManagerProps) {
  const [activeLinks, setActiveLinks] = useState<Link[]>(existingLinks)
  const [saving, setSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  // Get available platforms (not already added)
  const availablePlatforms = platforms.filter(
    p => !activeLinks.some(link => link.platform === p.id)
  )

  // Filter available platforms by search
  const filteredPlatforms = availablePlatforms.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase())
  )

  const addPlatform = (platformId: string) => {
    const newLink: Link = {
      platform: platformId,
      href: '',
      display_order: activeLinks.length,
    }
    setActiveLinks([...activeLinks, newLink])
  }

  const removePlatform = (index: number) => {
    setActiveLinks(activeLinks.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, href: string) => {
    const updated = [...activeLinks]
    updated[index].href = href
    setActiveLinks(updated)
  }

  // Drag and Drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))

    if (dragIndex !== dropIndex) {
      const newLinks = [...activeLinks]
      const [draggedItem] = newLinks.splice(dragIndex, 1)
      newLinks.splice(dropIndex, 0, draggedItem)
      setActiveLinks(newLinks)
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(activeLinks.map((link, index) => ({
      ...link,
      display_order: index,
    })))
    setSaving(false)
  }

  const getPlatform = (id: string) => platforms.find(p => p.id === id)

  return (
    <div>
      {/* Active Links */}
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Active Social Links</h3>

      {activeLinks.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#666', background: '#f9fafb', borderRadius: 8, marginBottom: 24 }}>
          No social links added. Select from available platforms below.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {activeLinks.map((link, index) => {
            const platform = getPlatform(link.platform)
            return (
              <div
                key={link.platform}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  background: dragOverIndex === index ? '#eff6ff' : '#fff',
                  border: dragOverIndex === index ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: 8,
                  cursor: 'grab',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ cursor: 'grab', color: '#999', fontSize: 18 }}>⠿</div>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon icon={platform?.icon || 'mdi:link'} width={24} height={24} />
                </div>
                <div style={{ width: 100, fontWeight: 500 }}>{platform?.name}</div>
                <input
                  type="url"
                  value={link.href}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder={`https://${link.platform}.com/...`}
                  className="form-input"
                  style={{ flex: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={() => removePlatform(index)}
                  style={{
                    padding: '8px 16px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary"
        style={{ marginBottom: 32 }}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {/* Available Platforms */}
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Available Platforms ({availablePlatforms.length})</h3>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search platforms..."
        className="form-input"
        style={{ marginBottom: 16, maxWidth: 300 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {filteredPlatforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => addPlatform(platform.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.background = '#eff6ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <Icon icon={platform.icon} width={20} height={20} />
            <span style={{ fontWeight: 500 }}>{platform.name}</span>
          </button>
        ))}

        {filteredPlatforms.length === 0 && availablePlatforms.length > 0 && (
          <div style={{ color: '#666', fontSize: 14 }}>
            No platforms match your search.
          </div>
        )}

        {availablePlatforms.length === 0 && (
          <div style={{ color: '#666', fontSize: 14 }}>
            All platforms have been added.
          </div>
        )}
      </div>
    </div>
  )
}
