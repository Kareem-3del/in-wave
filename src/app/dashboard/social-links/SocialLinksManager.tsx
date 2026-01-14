'use client'

import { useState, DragEvent } from 'react'
import { Icon } from '@iconify/react'

interface Platform {
  id: string
  name: string
  icon: string
}

interface Category {
  name: string
  icon: string
  platforms: string[]
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
  categories: Record<string, Category>
  onSave: (links: Link[]) => Promise<void>
}

// URL validation helper
function isValidUrl(string: string): boolean {
  if (!string) return false

  try {
    const url = new URL(string)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
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

export function SocialLinksManager({ existingLinks, platforms, categories, onSave }: SocialLinksManagerProps) {
  const [activeLinks, setActiveLinks] = useState<Link[]>(existingLinks)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Get available platforms (not already added)
  const availablePlatforms = platforms.filter(
    p => !activeLinks.some(link => link.platform === p.id)
  )

  // Filter by category
  const categoryFilteredPlatforms = activeCategory === 'all'
    ? availablePlatforms
    : availablePlatforms.filter(p =>
        categories[activeCategory]?.platforms.includes(p.id)
      )

  // Filter available platforms by search
  const filteredPlatforms = categoryFilteredPlatforms.filter(
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
  }

  const removePlatform = (index: number) => {
    const platform = activeLinks[index].platform
    setActiveLinks(activeLinks.filter((_, i) => i !== index))
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
    setTouched(prev => new Set(prev).add(platform))

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
    const allPlatforms = new Set(activeLinks.map(l => l.platform))
    setTouched(allPlatforms)

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
    <div className="social-links-layout">
      {/* Left Column - Active Links */}
      <div className="social-links-active">
        <div className="social-panel">
          <div className="social-panel-header">
            <div className="social-panel-title">
              <Icon icon="mdi:link-variant" width={20} height={20} />
              <span>Your Links</span>
            </div>
            {activeLinks.length > 0 && (
              <span className="social-panel-badge">{activeLinks.length}</span>
            )}
          </div>

          <div className="social-panel-content">
            {activeLinks.length === 0 ? (
              <div className="social-empty">
                <div className="social-empty-icon">
                  <Icon icon="mdi:link-plus" width={48} height={48} />
                </div>
                <h4>No links added yet</h4>
                <p>Select platforms from the right panel to add your social links</p>
              </div>
            ) : (
              <div className="social-links-list">
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
                      className={`social-link-card ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''} ${hasError ? 'has-error' : ''}`}
                    >
                      <div className="social-link-header">
                        <div className="social-link-drag" title="Drag to reorder">
                          <Icon icon="mdi:drag" width={18} height={18} />
                        </div>
                        <div className="social-link-platform">
                          <div className="social-link-icon">
                            <Icon icon={platform?.icon || 'mdi:link'} width={22} height={22} />
                          </div>
                          <span className="social-link-name">{platform?.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePlatform(index)}
                          className="social-link-remove"
                          title="Remove"
                        >
                          <Icon icon="mdi:trash-can-outline" width={18} height={18} />
                        </button>
                      </div>
                      <div className="social-link-body">
                        <div className="social-link-input-wrap">
                          <Icon icon="mdi:link" width={16} height={16} className="social-link-input-icon" />
                          <input
                            type="url"
                            value={link.href}
                            onChange={(e) => updateLink(index, e.target.value)}
                            onBlur={() => handleBlur(link.platform, index)}
                            placeholder={getPlaceholder(link.platform)}
                            className={`social-link-input ${hasError ? 'input-error' : ''}`}
                          />
                        </div>
                        {hasError && (
                          <div className="social-link-error">
                            <Icon icon="mdi:alert-circle" width={14} height={14} />
                            <span>{error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          {activeLinks.length > 0 && (
            <div className="social-panel-footer">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`social-save-btn ${hasErrors ? 'disabled' : ''}`}
              >
                {saving ? (
                  <>
                    <Icon icon="mdi:loading" width={20} height={20} className="spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save" width={20} height={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              {saveStatus === 'success' && (
                <div className="social-save-status success">
                  <Icon icon="mdi:check-circle" width={18} height={18} />
                  <span>Saved successfully!</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="social-save-status error">
                  <Icon icon="mdi:alert-circle" width={18} height={18} />
                  <span>{hasErrors ? 'Fix errors above' : 'Save failed'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Available Platforms */}
      <div className="social-links-available">
        <div className="social-panel">
          <div className="social-panel-header">
            <div className="social-panel-title">
              <Icon icon="mdi:apps" width={20} height={20} />
              <span>Add Platforms</span>
            </div>
            <span className="social-panel-badge">{availablePlatforms.length}</span>
          </div>

          {/* Search */}
          <div className="social-search">
            <Icon icon="mdi:magnify" width={18} height={18} className="social-search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search platforms..."
              className="social-search-input"
            />
            {search && (
              <button
                type="button"
                className="social-search-clear"
                onClick={() => setSearch('')}
              >
                <Icon icon="mdi:close" width={16} height={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="social-categories">
            <button
              type="button"
              className={`social-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <Icon icon="mdi:view-grid" width={16} height={16} />
              <span>All</span>
            </button>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                type="button"
                className={`social-category-btn ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                <Icon icon={category.icon} width={16} height={16} />
                <span>{category.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Platforms Grid */}
          <div className="social-panel-content">
            <div className="social-platforms-grid">
              {filteredPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => addPlatform(platform.id)}
                  className="social-platform-btn"
                >
                  <div className="social-platform-icon">
                    <Icon icon={platform.icon} width={24} height={24} />
                  </div>
                  <span className="social-platform-name">{platform.name}</span>
                  <div className="social-platform-add">
                    <Icon icon="mdi:plus" width={18} height={18} />
                  </div>
                </button>
              ))}

              {filteredPlatforms.length === 0 && availablePlatforms.length > 0 && (
                <div className="social-no-results">
                  <Icon icon="mdi:magnify-close" width={32} height={32} />
                  <p>No platforms match your search</p>
                </div>
              )}

              {availablePlatforms.length === 0 && (
                <div className="social-no-results">
                  <Icon icon="mdi:check-circle" width={32} height={32} />
                  <p>All platforms added!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
