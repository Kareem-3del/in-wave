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

interface ValidationError {
  platform: string
  message: string
}

interface SocialLinksManagerProps {
  existingLinks: Link[]
  platforms: Platform[]
  onSave: (links: Link[]) => Promise<void>
}

// URL validation helper
function isValidUrl(string: string): boolean {
  // Allow empty strings (optional fields)
  if (!string) return false

  try {
    const url = new URL(string)
    // Check for valid protocols
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
    // Check for tel: and mailto: without full URL parsing
    if (string.startsWith('tel:') || string.startsWith('mailto:')) {
      return string.length > 5
    }
    return false
  }
}

// Get URL placeholder based on platform
function getPlaceholder(platformId: string): string {
  switch (platformId) {
    case 'email':
      return 'mailto:your@email.com'
    case 'phone':
      return 'tel:+1234567890'
    case 'whatsapp':
      return 'https://wa.me/1234567890'
    default:
      return `https://${platformId}.com/yourprofile`
  }
}

export function SocialLinksManager({ existingLinks, platforms, onSave }: SocialLinksManagerProps) {
  const [activeLinks, setActiveLinks] = useState<Link[]>(existingLinks)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Get available platforms (not already added)
  const availablePlatforms = platforms.filter(
    p => !activeLinks.some(link => link.platform === p.id)
  )

  // Filter available platforms by search
  const filteredPlatforms = availablePlatforms.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase())
  )

  // Validate a single link
  const validateLink = (link: Link): string | null => {
    if (!link.href.trim()) {
      return 'URL is required'
    }
    if (!isValidUrl(link.href.trim())) {
      return 'Please enter a valid URL (e.g., https://example.com)'
    }
    return null
  }

  // Validate all links
  const validateAll = (): boolean => {
    const newErrors: ValidationError[] = []

    activeLinks.forEach(link => {
      const error = validateLink(link)
      if (error) {
        newErrors.push({ platform: link.platform, message: error })
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  // Get error for a specific platform
  const getError = (platform: string): string | null => {
    const error = errors.find(e => e.platform === platform)
    return error?.message || null
  }

  // Check if field has been touched and has error
  const showError = (platform: string): boolean => {
    return touched.has(platform) && !!getError(platform)
  }

  const addPlatform = (platformId: string) => {
    const newLink: Link = {
      platform: platformId,
      href: '',
      display_order: activeLinks.length,
    }
    setActiveLinks([...activeLinks, newLink])
    // Don't mark as touched yet - let user type first
  }

  const removePlatform = (index: number) => {
    const platform = activeLinks[index].platform
    setActiveLinks(activeLinks.filter((_, i) => i !== index))
    // Remove from touched and errors
    setTouched(prev => {
      const next = new Set(prev)
      next.delete(platform)
      return next
    })
    setErrors(prev => prev.filter(e => e.platform !== platform))
  }

  const updateLink = (index: number, href: string) => {
    const updated = [...activeLinks]
    updated[index].href = href
    setActiveLinks(updated)

    // Validate on change if already touched
    const platform = updated[index].platform
    if (touched.has(platform)) {
      const error = validateLink(updated[index])
      setErrors(prev => {
        const filtered = prev.filter(e => e.platform !== platform)
        if (error) {
          return [...filtered, { platform, message: error }]
        }
        return filtered
      })
    }
  }

  const handleBlur = (platform: string, index: number) => {
    // Mark as touched
    setTouched(prev => new Set(prev).add(platform))

    // Validate this field
    const link = activeLinks[index]
    const error = validateLink(link)
    setErrors(prev => {
      const filtered = prev.filter(e => e.platform !== platform)
      if (error) {
        return [...filtered, { platform, message: error }]
      }
      return filtered
    })
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
    // Mark all as touched
    const allPlatforms = new Set(activeLinks.map(l => l.platform))
    setTouched(allPlatforms)

    // Validate all
    if (!validateAll()) {
      setSaveStatus('error')
      return
    }

    setSaving(true)
    setSaveStatus('idle')
    try {
      await onSave(activeLinks.map((link, index) => ({
        ...link,
        display_order: index,
      })))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const getPlatform = (id: string) => platforms.find(p => p.id === id)

  const hasErrors = errors.length > 0

  return (
    <div className="social-links-manager">
      {/* Active Links */}
      <div className="section-header">
        <h3 className="section-title">Active Social Links</h3>
        {activeLinks.length > 0 && (
          <span className="section-count">{activeLinks.length} link{activeLinks.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {activeLinks.length === 0 ? (
        <div className="empty-message">
          <Icon icon="mdi:link-plus" width={32} height={32} />
          <p>No social links added yet.</p>
          <span>Select from available platforms below to add your social links.</span>
        </div>
      ) : (
        <div className="active-links-list">
          {activeLinks.map((link, index) => {
            const platform = getPlatform(link.platform)
            const error = getError(link.platform)
            const hasError = showError(link.platform)

            return (
              <div
                key={link.platform}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`link-item ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''} ${hasError ? 'has-error' : ''}`}
              >
                <div className="link-item-main">
                  <div className="drag-handle" title="Drag to reorder">
                    <Icon icon="mdi:drag-vertical" width={20} height={20} />
                  </div>
                  <div className="platform-icon">
                    <Icon icon={platform?.icon || 'mdi:link'} width={24} height={24} />
                  </div>
                  <div className="platform-name">{platform?.name}</div>
                  <div className="input-wrapper">
                    <input
                      type="url"
                      value={link.href}
                      onChange={(e) => updateLink(index, e.target.value)}
                      onBlur={() => handleBlur(link.platform, index)}
                      placeholder={getPlaceholder(link.platform)}
                      className={`form-input link-input ${hasError ? 'input-error' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {hasError && (
                      <div className="field-error">
                        <Icon icon="mdi:alert-circle" width={14} height={14} />
                        {error}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlatform(index)}
                    className="btn-remove"
                    title="Remove"
                  >
                    <Icon icon="mdi:close" width={18} height={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Save Button and Status */}
      <div className="save-section">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn btn-primary btn-save ${hasErrors ? 'btn-disabled' : ''}`}
        >
          {saving ? (
            <>
              <Icon icon="mdi:loading" width={20} height={20} className="spin" />
              Saving...
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" width={20} height={20} />
              Save Changes
            </>
          )}
        </button>

        {saveStatus === 'success' && (
          <span className="save-message save-success">
            <Icon icon="mdi:check-circle" width={20} height={20} />
            Social links saved successfully!
          </span>
        )}
        {saveStatus === 'error' && hasErrors && (
          <span className="save-message save-error">
            <Icon icon="mdi:alert-circle" width={20} height={20} />
            Please fix the errors above before saving.
          </span>
        )}
        {saveStatus === 'error' && !hasErrors && (
          <span className="save-message save-error">
            <Icon icon="mdi:alert-circle" width={20} height={20} />
            Failed to save. Please try again.
          </span>
        )}
      </div>

      {/* Available Platforms */}
      <div className="section-header">
        <h3 className="section-title">Available Platforms</h3>
        <span className="section-count">{availablePlatforms.length} available</span>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <Icon icon="mdi:magnify" width={20} height={20} className="search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search platforms..."
          className="form-input search-input"
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch('')}
          >
            <Icon icon="mdi:close" width={16} height={16} />
          </button>
        )}
      </div>

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
            <Icon icon="mdi:plus" width={16} height={16} className="add-icon" />
          </button>
        ))}

        {filteredPlatforms.length === 0 && availablePlatforms.length > 0 && (
          <div className="no-results">
            <Icon icon="mdi:magnify-close" width={24} height={24} />
            No platforms match &quot;{search}&quot;
          </div>
        )}

        {availablePlatforms.length === 0 && (
          <div className="no-results">
            <Icon icon="mdi:check-all" width={24} height={24} />
            All platforms have been added!
          </div>
        )}
      </div>
    </div>
  )
}
