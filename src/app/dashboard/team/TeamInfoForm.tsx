'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/dashboard/ImageUpload'
import type { TeamInfo } from '@/lib/types/database'

interface TeamInfoFormProps {
  teamInfo: TeamInfo | null
  onSave: (formData: FormData) => Promise<void>
}

export function TeamInfoForm({ teamInfo, onSave }: TeamInfoFormProps) {
  const [imageUrl, setImageUrl] = useState(teamInfo?.image_url || '')

  const handleSubmit = async (formData: FormData) => {
    if (imageUrl) {
      formData.set('image_url', imageUrl)
    }
    await onSave(formData)
  }

  return (
    <form action={handleSubmit}>
      {teamInfo && <input type="hidden" name="id" value={teamInfo.id} />}

      <div className="form-group">
        <label className="form-label">Team Image</label>
        <ImageUpload
          name="image_url"
          currentUrl={teamInfo?.image_url || undefined}
          bucket="images"
          onUpload={setImageUrl}
        />
        <p className="form-hint">Upload a team photo or group image</p>
      </div>

      <div className="form-group">
        <label className="form-label">Title Lines (one per line)</label>
        <textarea
          name="title_lines"
          className="form-textarea"
          defaultValue={teamInfo?.title_lines?.join('\n') || '10 years experience\nin combination with a\nperfect taste'}
          rows={4}
          placeholder="First line&#10;Second line&#10;Third line"
        />
        <p className="form-hint">Each line appears on the About section</p>
      </div>

      {/* <div className="form-group">
        <label className="form-label">Title Lines EN (one per line)</label>

        <textarea
          name="title_lines_en"
          className="form-textarea"
          defaultValue={teamInfo?.title_lines_en?.join('\n') || '10 years experience\nin combination with a\nperfect taste'}
          rows={4}
          placeholder="First line&#10;Second line&#10;Third line"
        />
        <p className="form-hint">Each line appears on the About section</p>
      </div> */}

      {/* <div className="form-group">
        <label className="form-label">Title Lines AR(one per line)</label>
        <textarea
          name="title_lines_ar"
          className="form-textarea"
          defaultValue={teamInfo?.title_lines_ar?.join('\n') || '10 years experience\nin combination with a\nperfect taste'}
          rows={4}
          placeholder="First line&#10;Second line&#10;Third line"
        />


        <p className="form-hint">Each line appears on the About section</p>
      </div> */}

      <div className="form-group">
        <label className="form-label">Description Paragraphs (separate with blank lines)</label>
        <textarea
          name="description_paragraphs"
          className="form-textarea"
          defaultValue={teamInfo?.description_paragraphs?.join('\n\n') || 'First paragraph here.\n\nSecond paragraph here.'}
          rows={8}
          placeholder="First paragraph&#10;&#10;Second paragraph"
        />
        <p className="form-hint">Separate paragraphs with blank lines</p>
      </div>

      {/* <div className="form-group">
        <label className="form-label">Description Paragraphs EN(separate with blank lines)</label>
        <textarea
          name="description_paragraphs_en"
          className="form-textarea"
          defaultValue={teamInfo?.description_paragraphs_en?.join('\n\n') || 'First paragraph here.\n\nSecond paragraph here.'}
          rows={8}
          placeholder="First paragraph&#10;&#10;Second paragraph"
        />
        <p className="form-hint">Separate paragraphs with blank lines</p>
      </div>
 */}

      {/* <div className="form-group">
        <label className="form-label">Description Paragraphs AR(separate with blank lines)</label>
        <textarea
          name="description_paragraphs_ar"
          className="form-textarea"
          defaultValue={teamInfo?.description_paragraphs_ar?.join('\n\n') || 'First paragraph here.\n\nSecond paragraph here.'}
          rows={8}
          placeholder="First paragraph&#10;&#10;Second paragraph"
        />
        <p className="form-hint">Separate paragraphs with blank lines</p>
      </div> */}


      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">Years Experience</label>
          <input
            type="number"
            name="years_experience"
            className="form-input"
            defaultValue={teamInfo?.years_experience || 10}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Projects Count</label>
          <input
            type="number"
            name="projects_count"
            className="form-input"
            defaultValue={teamInfo?.projects_count || 90}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Countries Count</label>
          <input
            type="number"
            name="countries_count"
            className="form-input"
            defaultValue={teamInfo?.countries_count || 10}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  )
}
