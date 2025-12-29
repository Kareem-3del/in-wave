import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

const MAX_WIDTH = 2400
const MAX_HEIGHT = 2400
const QUALITY = 85

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'images'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max for input)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File must be less than 10MB' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process image with sharp
    let processedImage = sharp(buffer)
    const metadata = await processedImage.metadata()

    let finalWidth = metadata.width || 0
    let finalHeight = metadata.height || 0

    // Resize if too large (maintaining aspect ratio)
    if (finalWidth > MAX_WIDTH || finalHeight > MAX_HEIGHT) {
      processedImage = processedImage.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })

      // Recalculate dimensions after resize
      const ratio = Math.min(MAX_WIDTH / finalWidth, MAX_HEIGHT / finalHeight)
      finalWidth = Math.round(finalWidth * ratio)
      finalHeight = Math.round(finalHeight * ratio)
    }

    // Convert to WebP for better compression
    const optimizedBuffer = await processedImage
      .webp({ quality: QUALITY })
      .toBuffer()

    // Generate unique filename with .webp extension
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      })

    if (error) {
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return NextResponse.json(
          {
            error: `Storage bucket "${bucket}" not found. Please create it in Supabase Dashboard → Storage.`,
            instructions: 'Go to Supabase Dashboard → Storage → Create new bucket named "images" with public access.'
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    // Format file size
    const sizeKB = optimizedBuffer.length / 1024
    const sizeStr = sizeKB > 1024
      ? `${(sizeKB / 1024).toFixed(1)} MB`
      : `${sizeKB.toFixed(1)} KB`

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      width: finalWidth,
      height: finalHeight,
      size: sizeStr,
      format: 'webp',
      originalSize: `${(file.size / 1024).toFixed(1)} KB`,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
