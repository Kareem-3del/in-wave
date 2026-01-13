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
    <div className="social-links-manager">
      {/* Active Links */}
      <h3 className="section-title">Active Social Links</h3>

      {activeLinks.length === 0 ? (
        <div className="empty-message">
          No social links added. Select from available platforms below.
        </div>
      ) : (
        <div className="active-links-list">
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
                className={`link-item ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
              >
                <div className="drag-handle">⠿</div>
                <div className="platform-icon">
                  <Icon icon={platform?.icon || 'mdi:link'} width={24} height={24} />
                </div>
                <div className="platform-name">{platform?.name}</div>
                <input
                  type="url"
                  value={link.href}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder={`https://${link.platform}.com/...`}
                  className="form-input link-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={() => removePlatform(index)}
                  className="btn-remove"
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
        className="btn btn-primary save-btn"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {/* Available Platforms */}
      <h3 className="section-title">Available Platforms ({availablePlatforms.length})</h3>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search platforms..."
        className="form-input search-input"
      />

      <div className="platforms-grid">
        {filteredPlatforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => addPlatform(platform.id)}
            className="platform-btn"
          >
            <Icon icon={platform.icon} width={20} height={20} />
            <span>{platform.name}</span>
          </button>
        ))}

        {filteredPlatforms.length === 0 && availablePlatforms.length > 0 && (
          <div className="no-results">
            No platforms match your search.
          </div>
        )}

        {availablePlatforms.length === 0 && (
          <div className="no-results">
            All platforms have been added.
          </div>
        )}
      </div>
    </div>
  )
}
