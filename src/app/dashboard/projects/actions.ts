'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProject, updateProject } from '@/lib/data/projects'
import type { ProjectInsert, ProjectUpdate } from '@/lib/types/database'

// Helper to get form field value with or without prefix
function getField(formData: FormData, name: string): string {
  let value = formData.get(name) as string
  if (value) return value
  for (const prefix of ['1_', '2_', '0_']) {
    value = formData.get(`${prefix}${name}`) as string
    if (value) return value
  }
  return ''
}

export async function createProjectAction(formData: FormData) {
  const imagesRaw = getField(formData, 'images')
  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw || '[]')
  } catch {
    images = imagesRaw ? imagesRaw.split('\n').filter(Boolean) : []
  }

  // Get bilingual fields
  const title_italic_en = getField(formData, 'title_italic_en') || getField(formData, 'title_italic')
  const title_italic_ar = getField(formData, 'title_italic_ar') || null
  const title_regular_en = getField(formData, 'title_regular_en') || getField(formData, 'title_regular')
  const title_regular_ar = getField(formData, 'title_regular_ar') || null
  const location_en = getField(formData, 'location_en') || getField(formData, 'location')
  const location_ar = getField(formData, 'location_ar') || null

  const project: ProjectInsert = {
    type: parseInt(getField(formData, 'type')) || 1,
    images,
    // Base fields (required by DB)
    title_italic: title_italic_en,
    title_regular: title_regular_en,
    location: location_en,
    // Bilingual fields
    title_italic_en,
    title_italic_ar,
    title_regular_en,
    title_regular_ar,
    location_en,
    location_ar,
    // Other fields
    year: getField(formData, 'year'),
    href: getField(formData, 'href'),
    show_marquee: getField(formData, 'show_marquee') === 'on',
    display_order: parseInt(getField(formData, 'display_order')) || 0,
    is_active: getField(formData, 'is_active') === 'on',
  }

  let success = false
  let errorMsg = ''
  try {
    await createProject(project)
    success = true
  } catch (error: unknown) {
    const err = error as { message?: string }
    errorMsg = err?.message || 'Unknown error'
    console.error('Error creating project:', errorMsg)
  }

  revalidatePath('/dashboard/projects')
  revalidatePath('/portfolio')
  revalidatePath('/')
  if (success) {
    redirect('/dashboard/projects?success=project_created')
  } else {
    redirect(`/dashboard/projects?error=create_failed&msg=${encodeURIComponent(errorMsg)}`)
  }
}

export async function updateProjectAction(formData: FormData) {
  const id = getField(formData, 'id')
  const imagesRaw = getField(formData, 'images')
  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw || '[]')
  } catch {
    images = imagesRaw ? imagesRaw.split('\n').filter(Boolean) : []
  }

  // Get bilingual fields
  const title_italic_en = getField(formData, 'title_italic_en') || getField(formData, 'title_italic')
  const title_italic_ar = getField(formData, 'title_italic_ar') || null
  const title_regular_en = getField(formData, 'title_regular_en') || getField(formData, 'title_regular')
  const title_regular_ar = getField(formData, 'title_regular_ar') || null
  const location_en = getField(formData, 'location_en') || getField(formData, 'location')
  const location_ar = getField(formData, 'location_ar') || null

  const project: ProjectUpdate = {
    type: parseInt(getField(formData, 'type')) || 1,
    images,
    // Base fields (required by DB)
    title_italic: title_italic_en,
    title_regular: title_regular_en,
    location: location_en,
    // Bilingual fields
    title_italic_en,
    title_italic_ar,
    title_regular_en,
    title_regular_ar,
    location_en,
    location_ar,
    // Other fields
    year: getField(formData, 'year'),
    href: getField(formData, 'href'),
    show_marquee: getField(formData, 'show_marquee') === 'on',
    display_order: parseInt(getField(formData, 'display_order')) || 0,
    is_active: getField(formData, 'is_active') === 'on',
  }

  let success = false
  let errorMsg = ''
  try {
    await updateProject(id, project)
    success = true
  } catch (error: unknown) {
    const err = error as { message?: string }
    errorMsg = err?.message || 'Unknown error'
    console.error('Error updating project:', errorMsg)
  }

  revalidatePath('/dashboard/projects')
  revalidatePath('/portfolio')
  revalidatePath('/')
  if (success) {
    redirect('/dashboard/projects?success=project_updated')
  } else {
    redirect(`/dashboard/projects?error=update_failed&msg=${encodeURIComponent(errorMsg)}`)
  }
}
