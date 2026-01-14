import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://hrduplvhuglxukyiwmez.supabase.co'
const supabaseServiceKey = 'sb_secret_HsIQEQR_CLntM0vjTXEX6g_naanFXY2'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

export async function GET() {
  const results: string[] = []

  try {
    // Seed Projects
    const { error: pErr } = await supabase.from('projects').insert([
      { type: 1, images: ['/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp'], title_italic: 'ZENITH', title_regular: 'GROVE', location: 'INDIA', year: '2025', href: '/portfolio/zenith-grove', show_marquee: true, display_order: 0 },
      { type: 2, images: ['/images/img_2256-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'NEST', location: 'USA', year: '2025', href: '/portfolio/noir-nest', display_order: 1 },
      { type: 1, images: ['/images/1-22-764x1080-1-724x1024.webp'], title_italic: 'VILLA', title_regular: 'CASCADE', location: 'UAE', year: '2024', href: '/portfolio/villa-cascade', show_marquee: true, display_order: 2 },
      { type: 2, images: ['/images/img_9119-1024x640.jpg.webp'], title_italic: 'EXQUISITE', title_regular: 'RESIDENCE', location: 'UAE', year: '2023', href: '/portfolio/exquisite-residence', display_order: 3 },
      { type: 3, images: ['/images/living__view09-kopiya-573x1024.jpg.webp'], title_italic: 'TRANQUIL', title_regular: 'LUX', location: 'USA', year: '2024', href: '/portfolio/tranquil-lux', display_order: 4 },
      { type: 1, images: ['/images/nk_view190001_post-1-573x1024.jpg.webp'], title_italic: 'ARCHITECTURAL', title_regular: 'ELEGANCE', location: 'UAE', year: '2024', href: '/portfolio/architectural-elegance', show_marquee: true, display_order: 5 },
      { type: 2, images: ['/images/acacia_11-2-1024x573.jpg.webp'], title_italic: 'LUXURY', title_regular: 'LIVING', location: 'PHILIPPINES', year: '2024', href: '/portfolio/luxury-living', display_order: 6 },
      { type: 3, images: ['/images/thureya-new_main-zone_view20-573x1024.jpg.webp'], title_italic: 'NOIR', title_regular: 'HORIZON', location: 'UAE', year: '2024', href: '/portfolio/noir-horizon', display_order: 7 },
    ])
    results.push(pErr ? `Projects: ${pErr.message}` : 'Projects: OK')

    // Seed Testimonials
    const { error: tErr } = await supabase.from('testimonials').insert([
      { name: 'John', rating: 5, text: "The studio's systematic approach exceeded my expectations.", display_order: 0 },
      { name: 'Ahmed', rating: 5, text: "This team knows how to make things happen!", display_order: 1 },
      { name: 'Esam', rating: 5, text: "I was blown away by the level of professionalism.", display_order: 2 },
      { name: 'Aisha', rating: 5, text: "The studio's procurement process is flawless.", display_order: 3 },
      { name: 'Ahmed', rating: 5, text: "Designing our villa was a massive undertaking.", display_order: 4 },
      { name: 'Nico', rating: 5, text: "This studio stands out for their strategic approach.", display_order: 5 },
    ])
    results.push(tErr ? `Testimonials: ${tErr.message}` : 'Testimonials: OK')

    // Seed Hero Slides
    const { error: hErr } = await supabase.from('hero_slides').insert([
      { image_url: '/images/sl-home1.jpg', alt_text: 'Hero 1', display_order: 0 },
      { image_url: '/images/img_8442-1920x1080.jpg', alt_text: 'Hero 2', display_order: 1 },
      { image_url: '/images/img_9119-1728x1080.jpg', alt_text: 'Hero 3', display_order: 2 },
      { image_url: '/images/img_0249-1920x1075.jpg', alt_text: 'Hero 4', display_order: 3 },
      { image_url: '/images/villa_greece_1-3-1-2-1920x1075.jpg', alt_text: 'Hero 5', display_order: 4 },
    ])
    results.push(hErr ? `Hero: ${hErr.message}` : 'Hero: OK')

    // Seed Offices
    const { error: oErr } = await supabase.from('offices').insert([
      { city: 'Dubai', country: 'UAE', phone: '+971 5018 77644', phone_href: 'tel:+971501877644', email: 'Info@innowave-me.com', display_order: 0 },
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
      { stage_number: '01', title: 'Start', description: 'Study project and take measurements.', display_order: 0 },
      { stage_number: '02', title: 'Plan', description: 'Process a point-by-point plan.', display_order: 1 },
      { stage_number: '03', title: 'Visualization', description: 'Create detailed visualization.', display_order: 2 },
      { stage_number: '04', title: 'Album', description: 'Design project album ready.', display_order: 3 },
    ])
    results.push(wErr ? `Work Stages: ${wErr.message}` : 'Work Stages: OK')

    // Seed Team Info
    const { error: tiErr } = await supabase.from('team_info').insert([{
      title_lines: ['10 years experience', 'in combination with a', 'perfect taste'],
      description_paragraphs: ['Founded in 2016, IN-WAVE Architects.'],
      image_url: '/images/team-photo.jpg',
      years_experience: 10,
      projects_count: 90,
      countries_count: 10,
    }])
    results.push(tiErr ? `Team: ${tiErr.message}` : 'Team: OK')

    // Seed Social Links
    const { error: slErr } = await supabase.from('social_links').insert([
      { platform: 'Facebook', icon_url: '/icons/facebook-ic.svg', href: 'https://facebook.com/IN-WAVE', display_order: 0 },
      { platform: 'Instagram', icon_url: '/icons/instagram-ic.svg', href: 'https://instagram.com/in-wave.architects', display_order: 1 },
      { platform: 'Pinterest', icon_url: '/icons/pinterest-ic.svg', href: 'https://pinterest.com/nk__interior__', display_order: 2 },
      { platform: 'Behance', icon_url: '/icons/behance-logo0-1.svg', href: 'https://behance.net/4ebd134f', display_order: 3 },
      { platform: 'TikTok', icon_url: '/icons/logo-tiktok.svg', href: 'https://tiktok.com/@nk_interior_', display_order: 4 },
      { platform: 'LinkedIn', icon_url: '/icons/linkedin-circle-1.svg', href: 'https://linkedin.com/company/106635723', display_order: 5 },
    ])
    results.push(slErr ? `Social: ${slErr.message}` : 'Social: OK')

    const hasErrors = results.some(r => r.includes('relation') || r.includes('does not exist'))

    if (hasErrors) {
      return NextResponse.json({
        success: false,
        message: 'Tables do not exist. Please run schema.sql first.',
        instructions: [
          '1. Go to: https://supabase.com/dashboard/project/hrduplvhuglxukyiwmez/sql/new',
          '2. Copy contents of: supabase/schema.sql',
          '3. Click "Run"',
          '4. Visit this URL again'
        ],
        results
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      credentials: {
        email: 'Info@innowave-me.com',
        password: 'InWaveAdmin2025!'
      },
      dashboard: 'http://localhost:3000/dashboard',
      results
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results
    }, { status: 500 })
  }
}
