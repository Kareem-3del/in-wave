'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  name: string
  currentUrl?: string
  bucket?: string
  required?: boolean
  minWidth?: number
  minHeight?: number
  aspectRatio?: string // e.g., "16:9", "4:3", "1:1"
  onUpload?: (url: string) => void
}

interface ImageInfo {
  width: number
  height: number
  size: string
  ratio: string
}

export function ImageUpload({
  name,
  currentUrl,
  bucket = 'images',
  required,
  minWidth = 800,
  minHeight = 600,
  aspectRatio,
  onUpload
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || '')
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getAspectRatio = (w: number, h: number): string => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(w, h)
    return `${w / divisor}:${h / divisor}`
  }

  const validateImage = (file: File): Promise<{ valid: boolean; width: number; height: number; error?: string }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const { width, height } = img

        if (width < minWidth || height < minHeight) {
          resolve({
            valid: false,
            width,
            height,
            error: `Image too small. Minimum size: ${minWidth}×${minHeight}px. Your image: ${width}×${height}px`
          })
          return
        }

        if (aspectRatio) {
          const [targetW, targetH] = aspectRatio.split(':').map(Number)
          const targetRatio = targetW / targetH
          const imageRatio = width / height
          const tolerance = 0.1 // 10% tolerance

          if (Math.abs(imageRatio - targetRatio) > tolerance) {
            resolve({
              valid: false,
              width,
              height,
              error: `Wrong aspect ratio. Expected ${aspectRatio}, got ${getAspectRatio(width, height)}`
            })
            return
          }
        }

        resolve({ valid: true, width, height })
      }
      img.onerror = () => resolve({ valid: false, width: 0, height: 0, error: 'Failed to load image' })
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setImageInfo(null)

    // Validate dimensions
    const validation = await validateImage(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid image')
      return
    }

    // Set image info
    setImageInfo({
      width: validation.width,
      height: validation.height,
      size: formatFileSize(file.size),
      ratio: getAspectRatio(validation.width, validation.height)
    })

    setUploading(true)

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedUrl(data.url)
      onUpload?.(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreview(currentUrl || null)
      setImageInfo(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload">
      <input type="hidden" name={name} value={uploadedUrl} />

      <div
        className="upload-area"
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #ddd',
          borderRadius: 8,
          padding: preview ? 0 : 24,
          textAlign: 'center',
          cursor: 'pointer',
          background: '#fafafa',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 120,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              height: 150,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ color: '#666', fontSize: 14 }}>
              Click to upload image
            </div>
            <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
              Min: {minWidth}×{minHeight}px {aspectRatio && `• Ratio: ${aspectRatio}`}
            </div>
            <div style={{ color: '#999', fontSize: 11, marginTop: 2 }}>
              JPG, PNG, WebP (max 5MB)
            </div>
          </div>
        )}

        {uploading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
            fontWeight: 500,
          }}>
            Uploading...
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        required={required && !uploadedUrl}
      />

      {imageInfo && (
        <div style={{
          marginTop: 8,
          padding: '8px 12px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 6,
          fontSize: 12,
          color: '#166534',
        }}>
          <strong>✓</strong> {imageInfo.width}×{imageInfo.height}px • {imageInfo.ratio} • {imageInfo.size}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 8,
          padding: '8px 12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 6,
          fontSize: 12,
          color: '#dc2626',
        }}>
          {error}
        </div>
      )}

      {preview && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setPreview(null)
            setUploadedUrl('')
            setImageInfo(null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          style={{
            marginTop: 8,
            padding: '4px 12px',
            fontSize: 12,
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      )}
    </div>
  )
}
