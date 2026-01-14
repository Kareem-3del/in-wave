'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/dashboard/ImageUpload'
import type { HeroSlide } from '@/lib/types/database'

interface HeroSlideFormProps {
  slide?: HeroSlide
  onSubmit: (formData: FormData) => Promise<void>
  defaultOrder?: number
}

export function HeroSlideForm({ slide, onSubmit, defaultOrder = 0 }: HeroSlideFormProps) {
  const [imageUrl, setImageUrl] = useState(slide?.image_url || '')
  const [submitting, setSubmitting] = useState(false)
  const [isActive, setIsActive] = useState(slide?.is_active ?? true)

  const isEdit = !!slide

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrl) {
      alert('Please upload an image first')
      return
    }
    setSubmitting(true)
    formData.set('image_url', imageUrl)
    if (slide) {
      formData.set('id', slide.id)
    }
    // Set is_active based on state
    if (isActive) {
      formData.set('is_active', 'on')
    } else {
      formData.delete('is_active')
    }
    await onSubmit(formData)
    if (!isEdit) {
      setImageUrl('')
    }
    setSubmitting(false)
  }

  return (
    <form action={handleSubmit} className="hero-slide-form">
      <div className="form-column form-column-image">
        <ImageUpload
          name="image_url"
          currentUrl={slide?.image_url}
          bucket="images"
          minWidth={1920}
          minHeight={1080}
          aspectRatio="16:9"
          onUpload={setImageUrl}
          required
        />
        <p className="image-hint">
          Recommended: Full HD (1920x1080) or higher, 16:9 aspect ratio
        </p>
      </div>
      <div className="form-column form-column-fields">
        <div className="form-group">
          <label className="form-label">Alt Text</label>
          <input
            type="text"
            name="alt_text"
            className="form-input"
            placeholder="Describe the image"
            defaultValue={slide?.alt_text || ''}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Display Order</label>
          <input
            type="number"
            name="display_order"
            className="form-input"
            placeholder="Order"
            defaultValue={slide?.display_order ?? defaultOrder}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="is_active_checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span style={{
              color: isActive ? 'var(--success)' : 'var(--text-muted)',
              fontWeight: 500
            }}>
              {isActive ? 'Active (visible on website)' : 'Hidden (not visible on website)'}
            </span>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting || !imageUrl}>
          {submitting ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Slide')}
        </button>
      </div>
    </form>
  )
}
