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
    await onSubmit(formData)
    if (!isEdit) {
      setImageUrl('')
    }
    setSubmitting(false)
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 300px', minWidth: 250 }}>
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
        <p style={{ fontSize: 11, color: '#666', marginTop: 8 }}>
          Recommended: Full HD (1920x1080) or higher, 16:9 aspect ratio
        </p>
      </div>
      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="form-label">Alt Text</label>
          <input
            type="text"
            name="alt_text"
            className="form-input"
            placeholder="Describe the image"
            defaultValue={slide?.alt_text || ''}
          />
        </div>
        <div>
          <label className="form-label">Display Order</label>
          <input
            type="number"
            name="display_order"
            className="form-input"
            placeholder="Order"
            defaultValue={slide?.display_order ?? defaultOrder}
          />
        </div>
        {isEdit && (
          <div>
            <label className="form-label">Status</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={slide?.is_active}
              />
              Active (visible on website)
            </label>
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting || !imageUrl}>
          {submitting ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Slide')}
        </button>
      </div>
    </form>
  )
}
