'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProject, updateProject } from '@/lib/data/projects'
import type { ProjectInsert, ProjectUpdate } from '@/lib/types/database'

export async function createProjectAction(formData: FormData) {
  const imagesRaw = formData.get('images') as string
  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw || '[]')
  } catch {
    images = imagesRaw ? imagesRaw.split('\n').filter(Boolean) : []
  }

  // Get bilingual fields
  const title_italic_en = formData.get('title_italic_en') as string
  const title_italic_ar = formData.get('title_italic_ar') as string
  const title_regular_en = formData.get('title_regular_en') as string
  const title_regular_ar = formData.get('title_regular_ar') as string
  const location_en = formData.get('location_en') as string
  const location_ar = formData.get('location_ar') as string

  const project: ProjectInsert = {
    type: parseInt(formData.get('type') as string) || 1,
    images,
    // Legacy fields (use English as default)
    title_italic: title_italic_en,
    title_regular: title_regular_en,
    location: location_en,
    // Bilingual fields
    title_italic_en,
    title_italic_ar: title_italic_ar || null,
    title_regular_en,
    title_regular_ar: title_regular_ar || null,
    location_en,
    location_ar: location_ar || null,
    year: formData.get('year') as string,
    href: formData.get('href') as string,
    show_marquee: formData.get('show_marquee') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }

  let success = false
  try {
    await createProject(project)
    success = true
  } catch (error) {
    console.error('Error creating project:', error)
  }

  revalidatePath('/dashboard/projects')
  if (success) {
    redirect('/dashboard/projects?success=project_created')
  } else {
    redirect('/dashboard/projects?error=create_failed')
  }
}

export async function updateProjectAction(formData: FormData) {
  const id = formData.get('id') as string
  const imagesRaw = formData.get('images') as string
  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw || '[]')
  } catch {
    images = imagesRaw ? imagesRaw.split('\n').filter(Boolean) : []
  }

  // Get bilingual fields
  const title_italic_en = formData.get('title_italic_en') as string
  const title_italic_ar = formData.get('title_italic_ar') as string
  const title_regular_en = formData.get('title_regular_en') as string
  const title_regular_ar = formData.get('title_regular_ar') as string
  const location_en = formData.get('location_en') as string
  const location_ar = formData.get('location_ar') as string

  const project: ProjectUpdate = {
    type: parseInt(formData.get('type') as string) || 1,
    images,
    // Legacy fields (use English as default)
    title_italic: title_italic_en,
    title_regular: title_regular_en,
    location: location_en,
    // Bilingual fields
    title_italic_en,
    title_italic_ar: title_italic_ar || null,
    title_regular_en,
    title_regular_ar: title_regular_ar || null,
    location_en,
    location_ar: location_ar || null,
    year: formData.get('year') as string,
    href: formData.get('href') as string,
    show_marquee: formData.get('show_marquee') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  }

  let success = false
  try {
    await updateProject(id, project)
    success = true
  } catch (error) {
    console.error('Error updating project:', error)
  }

  revalidatePath('/dashboard/projects')
  if (success) {
    redirect('/dashboard/projects?success=project_updated')
  } else {
    redirect('/dashboard/projects?error=update_failed')
  }
}
