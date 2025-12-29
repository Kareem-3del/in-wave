import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // List all files in the images bucket
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (listError) {
      throw listError
    }

    // Get all image URLs that are currently in use
    const usedUrls = new Set<string>()

    // Check projects
    const { data: projects } = await supabase.from('projects').select('images')
    projects?.forEach(project => {
      if (project.images && Array.isArray(project.images)) {
        project.images.forEach((url: string) => usedUrls.add(url))
      }
    })

    // Check hero slides
    const { data: heroSlides } = await supabase.from('hero_slides').select('image_url')
    heroSlides?.forEach(slide => {
      if (slide.image_url) usedUrls.add(slide.image_url)
    })

    // Check team info
    const { data: teamInfo } = await supabase.from('team_info').select('image_url')
    teamInfo?.forEach(team => {
      if (team.image_url) usedUrls.add(team.image_url)
    })

    // Get public URL base
    const { data: urlData } = supabase.storage.from('images').getPublicUrl('')
    const baseUrl = urlData.publicUrl

    // Map files with usage info
    const filesWithInfo = files
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const publicUrl = `${baseUrl}${file.name}`
        return {
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          isUsed: usedUrls.has(publicUrl)
        }
      })

    return NextResponse.json({
      files: filesWithInfo,
      total: filesWithInfo.length,
      used: filesWithInfo.filter(f => f.isUsed).length,
      unused: filesWithInfo.filter(f => !f.isUsed).length
    })

  } catch (error) {
    console.error('List uploads error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list uploads' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filenames } = await request.json()

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return NextResponse.json(
        { error: 'No filenames provided' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.storage
      .from('images')
      .remove(filenames)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      deleted: filenames.length
    })

  } catch (error) {
    console.error('Delete uploads error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete uploads' },
      { status: 500 }
    )
  }
}
