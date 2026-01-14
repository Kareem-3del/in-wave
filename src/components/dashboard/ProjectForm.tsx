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
    <form action={handleSubmit} className="project-form">
      {project && <input type="hidden" name="id" value={project.id} />}

      {/* Basic Information Section */}
      <div className="form-section">
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Basic Information
        </h3>

        <div className="form-grid form-grid-2">
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
        </div>

        <div className="form-grid form-grid-2">
          <BilingualInput
            name="location"
            label="Location"
            defaultValueEn={project?.location_en || project?.location || ''}
            defaultValueAr={project?.location_ar || ''}
            required
            placeholder="e.g., Dubai, UAE"
          />

          <BilingualInput
            name="category"
            label="Project Category"
            defaultValueEn={project?.category_en || ''}
            defaultValueAr={project?.category_ar || ''}
            placeholder="e.g., Interior Design, Villa"
            hint="Shown on project detail page"
          />
        </div>

        <div className="form-grid form-grid-2">
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
            <label className="form-label">Project Link (URL Slug)</label>
            <input
              type="text"
              name="href"
              className="form-input"
              defaultValue={project?.href}
              required
              placeholder="e.g., /portfolio/zenith-grove"
            />
            <p className="form-hint">The URL path for this project</p>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="form-section">
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Project Details
        </h3>

        <div className="form-grid form-grid-2">
          <BilingualInput
            name="client"
            label="Client Name"
            defaultValueEn={project?.client_en || ''}
            defaultValueAr={project?.client_ar || ''}
            placeholder="e.g., Smith Family, ABC Corp"
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
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Project Description
        </h3>

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

        <div className="form-grid form-grid-2">
          <BilingualInput
            name="challenge"
            label="The Challenge"
            type="textarea"
            rows={4}
            defaultValueEn={project?.challenge_en || ''}
            defaultValueAr={project?.challenge_ar || ''}
            placeholder="What challenges did this project present?"
            hint="Optional: Describe the challenges"
          />

          <BilingualInput
            name="solution"
            label="Our Solution"
            type="textarea"
            rows={4}
            defaultValueEn={project?.solution_en || ''}
            defaultValueAr={project?.solution_ar || ''}
            placeholder="How did you solve the challenges?"
            hint="Optional: Describe the solution"
          />
        </div>
      </div>

      {/* Images Section */}
      <div className="form-section">
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Images
        </h3>

        <div className="form-group">
          <label className="form-label">Portfolio Layout</label>
          <select
            name="type"
            className="form-select"
            value={layoutType}
            onChange={(e) => {
              const newType = parseInt(e.target.value)
              setLayoutType(newType)
              const maxAllowed = TYPE_MAX_IMAGES[newType] || 1
              if (images.length > maxAllowed) {
                setImages(images.slice(0, maxAllowed))
              }
            }}
          >
            <option value={1}>Single image (1 image)</option>
            <option value={2}>Two images - stacked vertically (2 images)</option>
            <option value={3}>Two images - side by side (2 images)</option>
          </select>
          <p className="form-hint">How images appear in the portfolio gallery grid</p>
        </div>

        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label className="form-label">Portfolio Thumbnail</label>
            <MultiImageUpload
              name="images"
              currentUrls={project?.images || []}
              bucket="images"
              maxImages={TYPE_MAX_IMAGES[layoutType] || 1}
              minWidth={1024}
              minHeight={768}
              onChange={setImages}
            />
            <p className="form-hint">Shown in portfolio grid. Min 1024×768px. Max {TYPE_MAX_IMAGES[layoutType] || 1} image(s).</p>
          </div>

          <div className="form-group">
            <label className="form-label">Project Gallery</label>
            <MultiImageUpload
              name="gallery_images"
              currentUrls={project?.gallery_images || []}
              bucket="images"
              maxImages={20}
              minWidth={800}
              minHeight={600}
              onChange={setGalleryImages}
            />
            <p className="form-hint">Shown on detail page. Min 800×600px. Up to 20 images.</p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="form-section">
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </h3>

        <div className="form-grid form-grid-3">
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              name="display_order"
              className="form-input"
              defaultValue={project?.display_order || 0}
              min={0}
            />
            <p className="form-hint">Lower = first</p>
          </div>

          <div className="form-group">
            <label className="form-label">Marquee</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="show_marquee"
                  defaultChecked={project?.show_marquee}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show animation</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="toggle-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={project?.is_active ?? true}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          {project ? 'Update Project' : 'Create Project'}
        </button>
        <Link href="/dashboard/projects" className="btn btn-secondary btn-lg">
          Cancel
        </Link>
      </div>
    </form>
  )
}
