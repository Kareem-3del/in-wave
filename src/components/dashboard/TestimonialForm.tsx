'use client'

import Link from 'next/link'
import type { Testimonial } from '@/lib/types/database'
import { BilingualInput } from './BilingualInput'

interface TestimonialFormProps {
  testimonial?: Testimonial
  action: (formData: FormData) => Promise<void>
}

export function TestimonialForm({ testimonial, action }: TestimonialFormProps) {
  return (
    <form action={action}>
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <BilingualInput
        name="name"
        label="Customer Name"
        defaultValueEn={testimonial?.name_en || testimonial?.name || ''}
        defaultValueAr={testimonial?.name_ar || ''}
        required
        placeholder="e.g., John Smith"
      />

      <div className="form-group">
        <label className="form-label">Rating (1-5 stars)</label>
        <select
          name="rating"
          className="form-select"
          defaultValue={testimonial?.rating || 5}
        >
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
      </div>

      <BilingualInput
        name="text"
        label="Review Text"
        type="textarea"
        defaultValueEn={testimonial?.text_en || testimonial?.text || ''}
        defaultValueAr={testimonial?.text_ar || ''}
        required
        placeholder="Customer's review..."
        rows={6}
      />

      <div className="form-group">
        <label className="form-label">Display Order</label>
        <input
          type="number"
          name="display_order"
          className="form-input"
          defaultValue={testimonial?.display_order || 0}
          min={0}
        />
        <p className="form-hint">Lower numbers appear first</p>
      </div>

      <div className="form-group">
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={testimonial?.is_active ?? true}
          />
          <span className="toggle-slider"></span>
        </label>
        <span style={{ marginLeft: 12 }}>Active (visible on website)</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {testimonial ? 'Update Testimonial' : 'Create Testimonial'}
        </button>
        <Link href="/dashboard/testimonials" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  )
}
