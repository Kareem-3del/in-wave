import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function getEnvVars() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    try {
      const envPath = path.join(process.cwd(), '.env.local')
      const envContent = fs.readFileSync(envPath, 'utf8')
      const lines = envContent.split('\n')

      for (const line of lines) {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=').trim()
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') url = value
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceKey = value
      }
    } catch {}
  }

  return { url, serviceKey }
}

export async function POST() {
  try {
    const { url, serviceKey } = getEnvVars()

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 400 }
      )
    }

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const results: string[] = []

    // Check if data already exists
    const { data: existingProjects } = await supabase.from('projects').select('id').limit(1)
    if (existingProjects && existingProjects.length > 0) {
      return NextResponse.json({ success: true, message: 'Data already seeded' })
    }

    // Seed Projects
    const { error: pErr } = await supabase.from('projects').insert([
      { type: 1, images: ['/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp', '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-13-1688x1080-1-1024x655.webp'], title_italic: 'ZENITH', title_regular: 'GROVE', location: 'INDIA', year: '2025', href: '/portfolio/zenith-grove', show_marquee: true, display_order: 0 },
      { type: 2, images: ['/images/img_2256-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'NEST', location: 'USA', year: '2025', href: '/portfolio/noir-nest', display_order: 1 },
      { type: 1, images: ['/images/1-22-764x1080-1-724x1024.webp', '/images/30-1-1920x1075-1-1024x573.webp'], title_italic: 'VILLA', title_regular: 'CASCADE', location: 'UAE', year: '2024', href: '/portfolio/villa-cascade', show_marquee: true, display_order: 2 },
      { type: 2, images: ['/images/img_9119-1024x640.jpg.webp'], title_italic: 'EXQUISITE', title_regular: 'RESIDENCE', location: 'UAE', year: '2023', href: '/portfolio/exquisite-residence', display_order: 3 },
      { type: 3, images: ['/images/living__view09-kopiya-573x1024.jpg.webp', '/images/living___view290000-kopiya-1024x573.jpg.webp'], title_italic: 'TRANQUIL', title_regular: 'LUX', location: 'USA', year: '2024', href: '/portfolio/tranquil-lux', display_order: 4 },
      { type: 1, images: ['/images/nk_view190001_post-1-573x1024.jpg.webp', '/images/img_6310-1024x573.jpg.webp'], title_italic: 'ARCHITECTURAL', title_regular: 'ELEGANCE', location: 'UAE', year: '2024', href: '/portfolio/architectural-elegance', show_marquee: true, display_order: 5 },
      { type: 2, images: ['/images/acacia_11-2-1024x573.jpg.webp'], title_italic: 'LUXURY', title_regular: 'LIVING', location: 'PHILIPPINES', year: '2024', href: '/portfolio/luxury-living', display_order: 6 },
      { type: 3, images: ['/images/thureya-new_main-zone_view20-573x1024.jpg.webp', '/images/thureya-new_main-zone_view310000-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'HORIZON', location: 'UAE', year: '2024', href: '/portfolio/noir-horizon', display_order: 7 },
    ])
    results.push(pErr ? `Projects: ${pErr.message}` : 'Projects: OK')

    // Seed Testimonials
    const { error: tErr } = await supabase.from('testimonials').insert([
      { name: 'John', rating: 5, text: "The studio's systematic approach and exceptional organization exceeded my expectations. They were attentive to every detail, ensuring nothing was overlooked. The final result was even better than I imagined, and I couldn't be happier!", display_order: 0 },
      { name: 'Ahmed', rating: 5, text: "This team knows how to make things happen! Their organizational skills and methodical approach ensured a smooth process, and their ability to focus on the smallest details brought our project to life in the most incredible way. Highly efficient and creative professionals!", display_order: 1 },
      { name: 'Esam', rating: 5, text: "I was blown away by the level of professionalism and efficiency of the studio. The entire process was stress free, and their ability to balance creativity with a structured approach truly sets them apart. Highly recommended!", display_order: 2 },
      { name: 'Aisha', rating: 5, text: "The studio's procurement process is flawless. Every piece, from furniture to finishes, was carefully sourced and delivered without a hitch. Their professionalism and efficiency saved us time and eliminated unnecessary stress. A fantastic experience!", display_order: 3 },
      { name: 'Ahmed', rating: 5, text: "Designing our villa was a massive undertaking, but this studio made it an enjoyable journey. From the grand entryway to the cozy bedrooms, every detail was carefully thought out. Our family particularly loves the outdoor terrace with its breathtaking views. Thank you for turning our dream home into a reality!", display_order: 4 },
      { name: 'Nico', rating: 5, text: "We've partnered with many design firms over the years, but this studio stands out for their strategic and creative approach. Their designs brought our project to life, combining modern luxury with thoughtful functionality. The villas have received glowing reviews from clients.", display_order: 5 },
    ])
    results.push(tErr ? `Testimonials: ${tErr.message}` : 'Testimonials: OK')

    // Seed Hero Slides
    const { error: hErr } = await supabase.from('hero_slides').insert([
      { image_url: '/images/sl-home1.jpg', alt_text: 'Hero slide 1', display_order: 0 },
      { image_url: '/images/img_8442-1920x1080.jpg', alt_text: 'Hero slide 2', display_order: 1 },
      { image_url: '/images/img_9119-1728x1080.jpg', alt_text: 'Hero slide 3', display_order: 2 },
      { image_url: '/images/img_0249-1920x1075.jpg', alt_text: 'Hero slide 4', display_order: 3 },
      { image_url: '/images/villa_greece_1-3-1-2-1920x1075.jpg', alt_text: 'Hero slide 5', display_order: 4 },
      { image_url: '/images/img_8473-1-1920x1080.jpg', alt_text: 'Hero slide 6', display_order: 5 },
      { image_url: '/images/local_mr_obaid_dubai_2243_entrance_main_hall_family_dining_v1_28-7-1920x1075.jpg', alt_text: 'Hero slide 7', display_order: 6 },
      { image_url: '/images/img_1493-1-1-scaled-2-1920x960.jpg', alt_text: 'Hero slide 8', display_order: 7 },
      { image_url: '/images/img_9824-1920x1075.jpg', alt_text: 'Hero slide 9', display_order: 8 },
    ])
    results.push(hErr ? `Hero slides: ${hErr.message}` : 'Hero slides: OK')

    // Seed Offices
    const { error: oErr } = await supabase.from('offices').insert([
      { city: 'Dubai', country: 'UAE', phone: '+971 5018 77644', phone_href: 'tel:+971501877644', email: 'Info@innowave-me.com', email_href: 'mailto:Info@innowave-me.com', display_order: 0 },
      { city: 'Los Angeles', country: 'USA', phone: '+1 954 271-5832', phone_href: 'tel:+19542715832', display_order: 1 },
      { city: 'Kyiv', country: 'Ukraine', phone: '+380 98 080 77 07', phone_href: 'tel:+380980807707', display_order: 2 },
      { city: 'Montreal', country: 'Canada', phone: '+1 4384053284', phone_href: 'tel:+14384053284', display_order: 3 },
    ])
    results.push(oErr ? `Offices: ${oErr.message}` : 'Offices: OK')

    // Seed Services
    const { error: sErr } = await supabase.from('services').insert([
      { name: 'Interior design', display_order: 0 },
      { name: 'Architectural design', display_order: 1 },
      { name: "Author's supervision", display_order: 2 },
      { name: 'Equipment', display_order: 3 },
      { name: 'Renovation', display_order: 4 },
      { name: 'Realization', display_order: 5 },
    ])
    results.push(sErr ? `Services: ${sErr.message}` : 'Services: OK')

    // Seed Work Stages
    const { error: wErr } = await supabase.from('work_stages').insert([
      { stage_number: '01', title: 'Start', description: 'We start by studying your project, taking all needed measurements and choosing style for it.', display_order: 0 },
      { stage_number: '02', title: 'Plan', description: 'Then, we process a point-by-point plan and present several examples for you.', display_order: 1 },
      { stage_number: '03', title: 'Visualization', description: 'At this stage we create detailed visualization for each room to provide you with an overall picture.', display_order: 2 },
      { stage_number: '04', title: 'Album', description: 'The design project album with all plans and visualizations is ready.', display_order: 3 },
    ])
    results.push(wErr ? `Work stages: ${wErr.message}` : 'Work stages: OK')

    // Seed Team Info
    const { error: tiErr } = await supabase.from('team_info').insert([{
      title_lines: ['8 years experience', 'in combination with a', 'perfect taste'],
      description_paragraphs: [
        'Founded in 2016, IN-WAVE Architects has grown into a leading design studio specializing in luxury residential and commercial interiors. Our team combines years of experience with a passion for creating spaces that inspire.',
        'With over 90 projects completed across 10 countries, we bring a global perspective to every design while respecting local traditions and preferences.'
      ],
      image_url: '/images/team-photo.jpg',
      years_experience: 8,
      projects_count: 90,
      countries_count: 10,
    }])
    results.push(tiErr ? `Team info: ${tiErr.message}` : 'Team info: OK')

    // Seed Social Links
    const { error: slErr } = await supabase.from('social_links').insert([
      { platform: 'Facebook', icon_url: '/icons/facebook-ic.svg', href: 'https://www.facebook.com/IN-WAVE.Architecture.and.Design', display_order: 0 },
      { platform: 'Instagram', icon_url: '/icons/instagram-ic.svg', href: 'https://www.instagram.com/in-wave.architects/', display_order: 1 },
      { platform: 'Pinterest', icon_url: '/icons/pinterest-ic.svg', href: 'https://www.pinterest.com/nk__interior__', display_order: 2 },
      { platform: 'Behance', icon_url: '/icons/behance-logo0-1.svg', href: 'https://www.behance.net/4ebd134f', display_order: 3 },
      { platform: 'TikTok', icon_url: '/icons/logo-tiktok.svg', href: 'https://www.tiktok.com/@nk_interior_', display_order: 4 },
      { platform: 'LinkedIn', icon_url: '/icons/linkedin-circle-1.svg', href: 'https://www.linkedin.com/company/106635723', display_order: 5 },
    ])
    results.push(slErr ? `Social links: ${slErr.message}` : 'Social links: OK')

    const hasErrors = results.some(r => !r.includes('OK'))

    if (hasErrors) {
      return NextResponse.json(
        { error: 'Some data failed to seed', results },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, results })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed data' },
      { status: 500 }
    )
  }
}
