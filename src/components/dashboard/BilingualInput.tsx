'use client'

import { useState } from 'react'

interface BilingualInputProps {
  name: string
  label: string
  defaultValueEn?: string
  defaultValueAr?: string
  required?: boolean
  placeholder?: string
  hint?: string
  type?: 'text' | 'textarea'
  rows?: number
}

export function BilingualInput({
  name,
  label,
  defaultValueEn = '',
  defaultValueAr = '',
  required = false,
  placeholder = '',
  hint,
  type = 'text',
  rows = 4
}: BilingualInputProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  return (
    <div className="form-group bilingual-input">
      <label className="form-label">{label}</label>

      <div className="bilingual-tabs">
        <button
          type="button"
          className={`bilingual-tab ${activeTab === 'en' ? 'active' : ''}`}
          onClick={() => setActiveTab('en')}
        >
          🇺🇸 English
        </button>
        <button
          type="button"
          className={`bilingual-tab ${activeTab === 'ar' ? 'active' : ''}`}
          onClick={() => setActiveTab('ar')}
        >
          🇸🇦 العربية
        </button>
      </div>

      <div className="bilingual-content">
        <div className={`bilingual-field ${activeTab === 'en' ? 'active' : ''}`}>
          {type === 'textarea' ? (
            <textarea
              name={`${name}_en`}
              className="form-textarea"
              defaultValue={defaultValueEn}
              required={required}
              placeholder={placeholder}
              rows={rows}
            />
          ) : (
            <input
              type="text"
              name={`${name}_en`}
              className="form-input"
              defaultValue={defaultValueEn}
              required={required}
              placeholder={placeholder}
            />
          )}
        </div>

        <div className={`bilingual-field ${activeTab === 'ar' ? 'active' : ''}`} dir="rtl">
          {type === 'textarea' ? (
            <textarea
              name={`${name}_ar`}
              className="form-textarea"
              defaultValue={defaultValueAr}
              placeholder={placeholder}
              rows={rows}
              style={{ fontFamily: 'Cairo, sans-serif', textAlign: 'right' }}
            />
          ) : (
            <input
              type="text"
              name={`${name}_ar`}
              className="form-input"
              defaultValue={defaultValueAr}
              placeholder={placeholder}
              style={{ fontFamily: 'Cairo, sans-serif', textAlign: 'right' }}
            />
          )}
        </div>
      </div>

      {hint && <p className="form-hint">{hint}</p>}

      <style jsx>{`
        .bilingual-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 0;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
        .bilingual-tab {
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-secondary, #6b7280);
          transition: all 0.2s;
        }
        .bilingual-tab:hover {
          color: var(--text-primary, #111827);
        }
        .bilingual-tab.active {
          color: var(--primary-color, #E5CCA8);
          border-bottom-color: var(--primary-color, #E5CCA8);
        }
        .bilingual-content {
          position: relative;
        }
        .bilingual-field {
          display: none;
        }
        .bilingual-field.active {
          display: block;
        }
        .bilingual-field :global(.form-input),
        .bilingual-field :global(.form-textarea) {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      `}</style>
    </div>
  )
}

interface BilingualArrayInputProps {
  name: string
  label: string
  defaultValuesEn?: string[]
  defaultValuesAr?: string[]
  hint?: string
  rows?: number
}

export function BilingualArrayInput({
  name,
  label,
  defaultValuesEn = [],
  defaultValuesAr = [],
  hint,
  rows = 4
}: BilingualArrayInputProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en')

  return (
    <div className="form-group bilingual-input">
      <label className="form-label">{label}</label>

      <div className="bilingual-tabs">
        <button
          type="button"
          className={`bilingual-tab ${activeTab === 'en' ? 'active' : ''}`}
          onClick={() => setActiveTab('en')}
        >
          🇺🇸 English
        </button>
        <button
          type="button"
          className={`bilingual-tab ${activeTab === 'ar' ? 'active' : ''}`}
          onClick={() => setActiveTab('ar')}
        >
          🇸🇦 العربية
        </button>
      </div>

      <div className="bilingual-content">
        <div className={`bilingual-field ${activeTab === 'en' ? 'active' : ''}`}>
          <textarea
            name={`${name}_en`}
            className="form-textarea"
            defaultValue={defaultValuesEn.join('\n')}
            placeholder="One item per line"
            rows={rows}
          />
        </div>

        <div className={`bilingual-field ${activeTab === 'ar' ? 'active' : ''}`} dir="rtl">
          <textarea
            name={`${name}_ar`}
            className="form-textarea"
            defaultValue={defaultValuesAr.join('\n')}
            placeholder="عنصر واحد في كل سطر"
            rows={rows}
            style={{ fontFamily: 'Cairo, sans-serif', textAlign: 'right' }}
          />
        </div>
      </div>

      {hint && <p className="form-hint">{hint}</p>}

      <style jsx>{`
        .bilingual-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 0;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
        .bilingual-tab {
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-secondary, #6b7280);
          transition: all 0.2s;
        }
        .bilingual-tab:hover {
          color: var(--text-primary, #111827);
        }
        .bilingual-tab.active {
          color: var(--primary-color, #E5CCA8);
          border-bottom-color: var(--primary-color, #E5CCA8);
        }
        .bilingual-content {
          position: relative;
        }
        .bilingual-field {
          display: none;
        }
        .bilingual-field.active {
          display: block;
        }
        .bilingual-field :global(.form-textarea) {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      `}</style>
    </div>
  )
}
