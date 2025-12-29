'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/types/database'
import { MultiImageUpload } from './MultiImageUpload'
import { BilingualInput } from './BilingualInput'

interface ProjectFormProps {
  project?: Project
  action: (formData: FormData) => Promise<void>
}

export function ProjectForm({ project, action }: ProjectFormProps) {
  const [images, setImages] = useState<string[]>(project?.images || [])

  const handleSubmit = async (formData: FormData) => {
    formData.set('images', JSON.stringify(images))
    await action(formData)
  }

  return (
    <form action={handleSubmit}>
      {project && <input type="hidden" name="id" value={project.id} />}

      <BilingualInput
        name="title_italic"
        label="Title (Italic Part)"
        defaultValueEn={project?.title_italic_en || project?.title_italic || ''}
        defaultValueAr={project?.title_italic_ar || ''}
        required
        placeholder="e.g., ZENITH"
        hint="The italicized part of the title"
      />

      <BilingualInput
        name="title_regular"
        label="Title (Regular Part)"
        defaultValueEn={project?.title_regular_en || project?.title_regular || ''}
        defaultValueAr={project?.title_regular_ar || ''}
        required
        placeholder="e.g., GROVE"
        hint="The regular part of the title"
      />

      <BilingualInput
        name="location"
        label="Location"
        defaultValueEn={project?.location_en || project?.location || ''}
        defaultValueAr={project?.location_ar || ''}
        required
        placeholder="e.g., India"
      />

      <div className="form-group">
        <label className="form-label">Year</label>
        <input
          type="text"
          name="year"
          className="form-input"
          defaultValue={project?.year}
          required
          placeholder="e.g., 2025"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Project Link</label>
        <input
          type="text"
          name="href"
          className="form-input"
          defaultValue={project?.href}
          required
          placeholder="e.g., /portfolio/zenith-grove"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Layout Type</label>
        <select
          name="type"
          className="form-select"
          defaultValue={project?.type || 1}
        >
          <option value={1}>Type 1 - Single image, right aligned</option>
          <option value={2}>Type 2 - Two images, stacked</option>
          <option value={3}>Type 3 - Two images, side by side</option>
        </select>
        <p className="form-hint">Determines how images are displayed in the gallery</p>
      </div>

      <div className="form-group">
        <label className="form-label">Project Images</label>
        <MultiImageUpload
          name="images"
          currentUrls={project?.images || []}
          bucket="images"
          maxImages={5}
          minWidth={1024}
          minHeight={768}
          onChange={setImages}
        />
        <p className="form-hint">Min 1024×768px. First image is the main thumbnail.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Display Order</label>
        <input
          type="number"
          name="display_order"
          className="form-input"
          defaultValue={project?.display_order || 0}
          min={0}
        />
        <p className="form-hint">Lower numbers appear first</p>
      </div>

      <div className="form-group">
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="show_marquee"
            defaultChecked={project?.show_marquee}
          />
          <span className="toggle-slider"></span>
        </label>
        <span style={{ marginLeft: 12 }}>Show Marquee Animation</span>
      </div>

      <div className="form-group">
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={project?.is_active ?? true}
          />
          <span className="toggle-slider"></span>
        </label>
        <span style={{ marginLeft: 12 }}>Active (visible on website)</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {project ? 'Update Project' : 'Create Project'}
        </button>
        <Link href="/dashboard/projects" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  )
}
