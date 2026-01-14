'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { Service } from '@/lib/types/database'

// Available icons for services
const SERVICE_ICONS = [
  { value: 'mdi:home-city-outline', label: 'Architecture' },
  { value: 'mdi:sofa-outline', label: 'Interior' },
  { value: 'mdi:cube-scan', label: 'Visualization' },
  { value: 'mdi:clipboard-check-outline', label: 'Supervision' },
  { value: 'mdi:comment-question-outline', label: 'Consultation' },
  { value: 'mdi:tree-outline', label: 'Landscaping' },
  { value: 'mdi:ruler-square', label: 'Planning' },
  { value: 'mdi:palette-outline', label: 'Design' },
  { value: 'mdi:floor-plan', label: 'Floor Plan' },
  { value: 'mdi:lightbulb-outline', label: 'Lighting' },
  { value: 'mdi:hammer-wrench', label: 'Construction' },
  { value: 'mdi:pencil-ruler', label: 'Drafting' },
]

interface ServiceFormProps {
  service?: Service
  onSave: (formData: FormData) => Promise<void>
  onToggle?: (formData: FormData) => Promise<void>
  onDelete?: (formData: FormData) => Promise<void>
  defaultOrder?: number
  isNew?: boolean
}

export function ServiceForm({ service, onSave, onToggle, onDelete, defaultOrder = 0, isNew = false }: ServiceFormProps) {
  const [isExpanded, setIsExpanded] = useState(isNew)
  const [selectedIcon, setSelectedIcon] = useState(service?.icon || 'mdi:home-city-outline')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('icon', selectedIcon)
    await onSave(formData)
  }

  const handleToggle = async () => {
    if (onToggle && service) {
      const formData = new FormData()
      formData.set('id', service.id)
      formData.set('is_active', (!service.is_active).toString())
      await onToggle(formData)
    }
  }

  const handleDelete = async () => {
    if (onDelete && service && confirm('Are you sure you want to delete this service?')) {
      const formData = new FormData()
      formData.set('id', service.id)
      await onDelete(formData)
    }
  }

  if (isNew) {
    return (
      <form onSubmit={handleSubmit} className="service-form-new">
        <div className="grid-2 mb-4">
          <div className="form-group">
            <label className="form-label">Name (English) *</label>
            <input
              type="text"
              name="name_en"
              className="form-input"
              placeholder="Service name in English"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Name (Arabic)</label>
            <input
              type="text"
              name="name_ar"
              className="form-input"
              placeholder="اسم الخدمة بالعربية"
              dir="rtl"
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Icon</label>
          <div className="icon-selector">
            {SERVICE_ICONS.map((icon) => (
              <button
                key={icon.value}
                type="button"
                className={`icon-option ${selectedIcon === icon.value ? 'icon-option--selected' : ''}`}
                onClick={() => setSelectedIcon(icon.value)}
                title={icon.label}
              >
                <Icon icon={icon.value} width={24} height={24} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid-2 mb-4">
          <div className="form-group">
            <label className="form-label">Description (English)</label>
            <textarea
              name="description_en"
              className="form-textarea"
              rows={3}
              placeholder="Brief description of this service..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Arabic)</label>
            <textarea
              name="description_ar"
              className="form-textarea"
              rows={3}
              placeholder="وصف مختصر للخدمة..."
              dir="rtl"
            />
          </div>
        </div>

        <div className="form-group mb-4" style={{ maxWidth: '100px' }}>
          <label className="form-label">Order</label>
          <input
            type="number"
            name="display_order"
            className="form-input"
            defaultValue={defaultOrder}
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Service</button>
      </form>
    )
  }

  // Existing service - collapsible form
  return (
    <div className="service-item">
      <div className="service-item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="service-item-icon">
          <Icon icon={service?.icon || 'mdi:home-city-outline'} width={24} height={24} />
        </div>
        <div className="service-item-info">
          <span className="service-item-title">{service?.name_en || service?.name}</span>
          {service?.name_ar && <span className="service-item-subtitle">{service.name_ar}</span>}
        </div>
        <div className="service-item-meta">
          <span className={`status-badge ${service?.is_active ? 'status-badge--success' : 'status-badge--muted'}`}>
            {service?.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="service-item-order">#{service?.display_order}</span>
          <svg
            className={`service-item-chevron ${isExpanded ? 'service-item-chevron--open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="service-item-body">
          <input type="hidden" name="id" value={service?.id} />

          <div className="grid-2 mb-4">
            <div className="form-group">
              <label className="form-label">Name (English) *</label>
              <input
                type="text"
                name="name_en"
                className="form-input"
                defaultValue={service?.name_en || service?.name}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Name (Arabic)</label>
              <input
                type="text"
                name="name_ar"
                className="form-input"
                defaultValue={service?.name_ar || ''}
                dir="rtl"
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Icon</label>
            <div className="icon-selector">
              {SERVICE_ICONS.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  className={`icon-option ${selectedIcon === icon.value ? 'icon-option--selected' : ''}`}
                  onClick={() => setSelectedIcon(icon.value)}
                  title={icon.label}
                >
                  <Icon icon={icon.value} width={24} height={24} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2 mb-4">
            <div className="form-group">
              <label className="form-label">Description (English)</label>
              <textarea
                name="description_en"
                className="form-textarea"
                rows={3}
                defaultValue={service?.description_en || ''}
                placeholder="Brief description of this service..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description (Arabic)</label>
              <textarea
                name="description_ar"
                className="form-textarea"
                rows={3}
                defaultValue={service?.description_ar || ''}
                placeholder="وصف مختصر للخدمة..."
                dir="rtl"
              />
            </div>
          </div>

          <div className="form-group mb-4" style={{ maxWidth: '100px' }}>
            <label className="form-label">Order</label>
            <input
              type="number"
              name="display_order"
              className="form-input"
              defaultValue={service?.display_order}
            />
          </div>

          <div className="service-item-actions">
            <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleToggle}>
              {service?.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
