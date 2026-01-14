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

// Map layout type to max images allowed
const TYPE_MAX_IMAGES: Record<number, number> = {
  1: 1, // Type 1 - Single image
  2: 2, // Type 2 - Two images, stacked
  3: 2, // Type 3 - Two images, side by side
}

export function ProjectForm({ project, action }: ProjectFormProps) {
  const [images, setImages] = useState<string[]>(project?.images || [])
  const [galleryImages, setGalleryImages] = useState<string[]>(project?.gallery_images || [])
  const [layoutType, setLayoutType] = useState<number>(project?.type || 1)

  const handleSubmit = async (formData: FormData) => {
    formData.set('images', JSON.stringify(images))
    formData.set('gallery_images', JSON.stringify(galleryImages))
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

      <BilingualInput
        name="category"
        label="Project Category / Type"
        defaultValueEn={project?.category_en || ''}
        defaultValueAr={project?.category_ar || ''}
        placeholder="e.g., Interior Design, Villa, Restaurant"
        hint="This is shown on the project detail page (e.g., Interior Design, Residential, Commercial)"
      />

      {/* Project Details Section */}
      <div className="form-section">
        <h3 className="form-section-title">Project Details</h3>

        <div className="form-row">
          <BilingualInput
            name="client"
            label="Client Name"
            defaultValueEn={project?.client_en || ''}
            defaultValueAr={project?.client_ar || ''}
            placeholder="e.g., Smith Family, ABC Corporation"
          />

          <div className="form-group">
            <label className="form-label">Project Area</label>
            <input
              type="text"
              name="area"
              className="form-input"
              defaultValue={project?.area || ''}
              placeholder="e.g., 500 sqm, 2,500 sqft"
            />
            <p className="form-hint">Size of the project (include unit)</p>
          </div>
        </div>

        <BilingualInput
          name="scope"
          label="Project Scope"
          defaultValueEn={project?.scope_en || ''}
          defaultValueAr={project?.scope_ar || ''}
          placeholder="e.g., Full interior design, renovation, furniture selection"
          hint="What services were provided for this project"
        />
      </div>

      {/* Project Description Section */}
      <div className="form-section">
        <h3 className="form-section-title">Project Description</h3>

        <BilingualInput
          name="description"
          label="Main Description"
          type="textarea"
          rows={5}
          defaultValueEn={project?.description_en || ''}
          defaultValueAr={project?.description_ar || ''}
          placeholder="Describe the project, its vision, and key features..."
          hint="This is the main description shown on the project detail page"
        />

        <BilingualInput
          name="challenge"
          label="The Challenge"
          type="textarea"
          rows={4}
          defaultValueEn={project?.challenge_en || ''}
          defaultValueAr={project?.challenge_ar || ''}
          placeholder="What challenges did this project present?"
          hint="Optional: Describe the challenges or requirements"
        />

        <BilingualInput
          name="solution"
          label="Our Solution"
          type="textarea"
          rows={4}
          defaultValueEn={project?.solution_en || ''}
          defaultValueAr={project?.solution_ar || ''}
          placeholder="How did you solve the challenges?"
          hint="Optional: Describe how you addressed the challenges"
        />
      </div>

      {/* Images Section */}
      <div className="form-section">
        <h3 className="form-section-title">Images</h3>

        <div className="form-group">
          <label className="form-label">Image Layout</label>
        <select
          name="type"
          className="form-select"
          value={layoutType}
          onChange={(e) => {
            const newType = parseInt(e.target.value)
            setLayoutType(newType)
            // Trim images if new type allows fewer
            const maxAllowed = TYPE_MAX_IMAGES[newType] || 1
            if (images.length > maxAllowed) {
              setImages(images.slice(0, maxAllowed))
            }
          }}
        >
          <option value={1}>Single image (1 image max)</option>
          <option value={2}>Two images - stacked (2 images max)</option>
          <option value={3}>Two images - side by side (2 images max)</option>
        </select>
        <p className="form-hint">Controls how images are displayed in the portfolio gallery</p>
      </div>

      <div className="form-group">
        <label className="form-label">Portfolio Thumbnail Images</label>
        <MultiImageUpload
          name="images"
          currentUrls={project?.images || []}
          bucket="images"
          maxImages={TYPE_MAX_IMAGES[layoutType] || 1}
          minWidth={1024}
          minHeight={768}
          onChange={setImages}
        />
        <p className="form-hint">These images appear in the portfolio grid. Min 1024×768px. Max {TYPE_MAX_IMAGES[layoutType] || 1} image(s) for the selected layout.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Project Gallery Images</label>
        <MultiImageUpload
          name="gallery_images"
          currentUrls={project?.gallery_images || []}
          bucket="images"
          maxImages={20}
          minWidth={800}
          minHeight={600}
          onChange={setGalleryImages}
        />
        <p className="form-hint">These images appear on the project detail page gallery. Add multiple images to showcase the project. Min 800×600px.</p>
      </div>
      </div>

      {/* Settings Section */}
      <div className="form-section">
        <h3 className="form-section-title">Settings</h3>

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
