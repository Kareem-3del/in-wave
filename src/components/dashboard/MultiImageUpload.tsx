'use client'

import { useState, useRef, DragEvent } from 'react'

interface ImageData {
  url: string
  width?: number
  height?: number
  size?: string
}

interface MultiImageUploadProps {
  name: string
  currentUrls?: string[]
  bucket?: string
  maxImages?: number
  minWidth?: number
  minHeight?: number
  onChange?: (urls: string[]) => void
}

export function MultiImageUpload({
  name,
  currentUrls = [],
  bucket = 'images',
  maxImages = 5,
  minWidth = 800,
  minHeight = 600,
  onChange,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageData[]>(currentUrls.map(url => ({ url })))
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
            error: `Image too small. Min: ${minWidth}×${minHeight}px. Yours: ${width}×${height}px`
          })
          return
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

    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    setError(null)

    const validation = await validateImage(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid image')
      return
    }

    setUploading(true)

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

      const newImage: ImageData = {
        url: data.url,
        width: data.width || validation.width,
        height: data.height || validation.height,
        size: data.size || formatFileSize(file.size)
      }
      const newImages = [...images, newImage]
      setImages(newImages)
      onChange?.(newImages.map(img => img.url))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onChange?.(newImages.map(img => img.url))
  }

  // Drag and Drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    // Add a slight delay to show drag effect
    setTimeout(() => {
      const target = e.target as HTMLElement
      target.style.opacity = '0.5'
    }, 0)
  }

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    target.style.opacity = '1'
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))

    if (dragIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newImages = [...images]
    const [draggedItem] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedItem)

    setImages(newImages)
    onChange?.(newImages.map(img => img.url))
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="multi-image-upload">
      <input type="hidden" name={name} value={JSON.stringify(images.map(img => img.url))} />

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        {images.map((img, index) => (
          <div
            key={img.url}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              position: 'relative',
              width: 140,
              borderRadius: 8,
              overflow: 'hidden',
              border: dragOverIndex === index ? '2px solid #3b82f6' : '1px solid #ddd',
              background: '#fff',
              cursor: 'grab',
              transform: dragOverIndex === index ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.15s, border 0.15s',
              opacity: draggedIndex === index ? 0.5 : 1,
            }}
          >
            <div style={{
              position: 'absolute',
              top: 4,
              left: 4,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              cursor: 'grab',
              zIndex: 2,
            }}>
              ⠿ Drag
            </div>
            <img
              src={img.url}
              alt={`Image ${index + 1}`}
              style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }}
              draggable={false}
            />
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                display: 'flex',
                gap: 4,
              }}
            >
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  width: 22,
                  height: 22,
                  border: 'none',
                  borderRadius: 4,
                  background: '#dc2626',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                padding: '6px 8px',
                background: '#f9fafb',
                borderTop: '1px solid #eee',
                fontSize: 10,
                color: '#666',
              }}
            >
              <div style={{ fontWeight: 600, color: '#333', marginBottom: 2 }}>#{index + 1}</div>
              {img.width && img.height && (
                <div>{img.width}×{img.height}px</div>
              )}
              {img.size && <div>{img.size}</div>}
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              width: 140,
              height: 130,
              border: '2px dashed #ddd',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploading ? 'wait' : 'pointer',
              background: '#fafafa',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {uploading ? (
              <span style={{ color: '#666', fontSize: 12 }}>Uploading...</span>
            ) : (
              <>
                <span style={{ fontSize: 28, color: '#999' }}>+</span>
                <span style={{ color: '#666', fontSize: 11 }}>Add Image</span>
                <span style={{ color: '#999', fontSize: 10 }}>Min: {minWidth}×{minHeight}</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      {error && (
        <div style={{
          padding: '8px 12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 6,
          fontSize: 12,
          color: '#dc2626',
          marginBottom: 8,
        }}>
          {error}
        </div>
      )}

      <div style={{ color: '#666', fontSize: 12 }}>
        {images.length}/{maxImages} images • Drag to reorder • Auto-optimized to WebP
      </div>
    </div>
  )
}
