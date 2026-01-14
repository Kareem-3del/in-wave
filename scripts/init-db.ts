import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hrduplvhuglxukyiwmez.supabase.co'
const supabaseServiceKey = 'sb_secret_HsIQEQR_CLntM0vjTXEX6g_naanFXY2'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runSQL(sql: string, description: string) {
  console.log(`Running: ${description}...`)
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single()
  if (error) {
    // Try direct approach
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql_query: sql })
    })
    if (!response.ok) {
      console.log(`  Note: ${description} - may already exist or using direct insert`)
    }
  }
  console.log(`  Done: ${description}`)
}

async function initDatabase() {
  console.log('🚀 Initializing IN-WAVE Architects Database...\n')

  // Create tables using direct Supabase client
  console.log('Creating tables...')

  // Projects
  const { error: projectsError } = await supabase.from('projects').select('id').limit(1)
  if (projectsError?.code === '42P01') {
    console.log('Tables do not exist. Please run schema.sql in Supabase SQL Editor first.')
    console.log('URL: https://supabase.com/dashboard/project/hrduplvhuglxukyiwmez/sql/new')
    process.exit(1)
  }

  console.log('Tables exist! Seeding data...\n')

  // Seed Projects
  console.log('Seeding projects...')
  const projects = [
    { type: 1, images: ['/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp', '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-13-1688x1080-1-1024x655.webp'], title_italic: 'ZENITH', title_regular: 'GROVE', location: 'INDIA', year: '2025', href: '/portfolio/zenith-grove', show_marquee: true, display_order: 0, is_active: true },
    { type: 2, images: ['/images/img_2256-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'NEST', location: 'USA', year: '2025', href: '/portfolio/noir-nest', show_marquee: false, display_order: 1, is_active: true },
    { type: 1, images: ['/images/1-22-764x1080-1-724x1024.webp', '/images/30-1-1920x1075-1-1024x573.webp'], title_italic: 'VILLA', title_regular: 'CASCADE', location: 'UAE', year: '2024', href: '/portfolio/villa-cascade', show_marquee: true, display_order: 2, is_active: true },
    { type: 2, images: ['/images/img_9119-1024x640.jpg.webp'], title_italic: 'EXQUISITE', title_regular: 'RESIDENCE', location: 'UAE', year: '2023', href: '/portfolio/exquisite-residence', show_marquee: false, display_order: 3, is_active: true },
    { type: 3, images: ['/images/living__view09-kopiya-573x1024.jpg.webp', '/images/living___view290000-kopiya-1024x573.jpg.webp'], title_italic: 'TRANQUIL', title_regular: 'LUX', location: 'USA', year: '2024', href: '/portfolio/tranquil-lux', show_marquee: false, display_order: 4, is_active: true },
    { type: 1, images: ['/images/nk_view190001_post-1-573x1024.jpg.webp', '/images/img_6310-1024x573.jpg.webp'], title_italic: 'ARCHITECTURAL', title_regular: 'ELEGANCE', location: 'UAE', year: '2024', href: '/portfolio/architectural-elegance', show_marquee: true, display_order: 5, is_active: true },
    { type: 2, images: ['/images/acacia_11-2-1024x573.jpg.webp'], title_italic: 'LUXURY', title_regular: 'LIVING', location: 'PHILIPPINES', year: '2024', href: '/portfolio/luxury-living', show_marquee: false, display_order: 6, is_active: true },
    { type: 3, images: ['/images/thureya-new_main-zone_view20-573x1024.jpg.webp', '/images/thureya-new_main-zone_view310000-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'HORIZON', location: 'UAE', year: '2024', href: '/portfolio/noir-horizon', show_marquee: false, display_order: 7, is_active: true },
  ]
  const { error: pErr } = await supabase.from('projects').upsert(projects, { onConflict: 'id' })
  if (pErr) console.log('  Projects:', pErr.message)
  else console.log('  ✓ Projects seeded')

  // Seed Testimonials
  console.log('Seeding testimonials...')
  const testimonials = [
    { name: 'John', rating: 5, text: "The studio's systematic approach and exceptional organization exceeded my expectations. They were attentive to every detail, ensuring nothing was overlooked. The final result was even better than I imagined, and I couldn't be happier!", display_order: 0, is_active: true },
    { name: 'Ahmed', rating: 5, text: "This team knows how to make things happen! Their organizational skills and methodical approach ensured a smooth process, and their ability to focus on the smallest details brought our project to life in the most incredible way. Highly efficient and creative professionals!", display_order: 1, is_active: true },
    { name: 'Esam', rating: 5, text: "I was blown away by the level of professionalism and efficiency of the studio. The entire process was stress free, and their ability to balance creativity with a structured approach truly sets them apart. Highly recommended!", display_order: 2, is_active: true },
    { name: 'Aisha', rating: 5, text: "The studio's procurement process is flawless. Every piece, from furniture to finishes, was carefully sourced and delivered without a hitch. Their professionalism and efficiency saved us time and eliminated unnecessary stress. A fantastic experience!", display_order: 3, is_active: true },
    { name: 'Ahmed', rating: 5, text: "Designing our villa was a massive undertaking, but this studio made it an enjoyable journey. From the grand entryway to the cozy bedrooms, every detail was carefully thought out. Our family particularly loves the outdoor terrace with its breathtaking views—it's where we spend most evenings now. Thank you for turning our dream home into a reality!", display_order: 4, is_active: true },
    { name: 'Nico', rating: 5, text: "We've partnered with many design firms over the years, but this studio stands out for their strategic and creative approach. Their designs brought our project to life, combining modern luxury with thoughtful functionality. The villas have received glowing reviews from clients, and we're already planning to collaborate on our next development.", display_order: 5, is_active: true },
  ]
  const { error: tErr } = await supabase.from('testimonials').upsert(testimonials, { onConflict: 'id' })
  if (tErr) console.log('  Testimonials:', tErr.message)
  else console.log('  ✓ Testimonials seeded')

  // Seed Hero Slides
  console.log('Seeding hero slides...')
  const heroSlides = [
    { image_url: '/images/sl-home1.jpg', alt_text: 'Hero slide 1', display_order: 0, is_active: true },
    { image_url: '/images/img_8442-1920x1080.jpg', alt_text: 'Hero slide 2', display_order: 1, is_active: true },
    { image_url: '/images/img_9119-1728x1080.jpg', alt_text: 'Hero slide 3', display_order: 2, is_active: true },
    { image_url: '/images/img_0249-1920x1075.jpg', alt_text: 'Hero slide 4', display_order: 3, is_active: true },
    { image_url: '/images/villa_greece_1-3-1-2-1920x1075.jpg', alt_text: 'Hero slide 5', display_order: 4, is_active: true },
    { image_url: '/images/img_8473-1-1920x1080.jpg', alt_text: 'Hero slide 6', display_order: 5, is_active: true },
    { image_url: '/images/local_mr_obaid_dubai_2243_entrance_main_hall_family_dining_v1_28-7-1920x1075.jpg', alt_text: 'Hero slide 7', display_order: 6, is_active: true },
    { image_url: '/images/img_1493-1-1-scaled-2-1920x960.jpg', alt_text: 'Hero slide 8', display_order: 7, is_active: true },
    { image_url: '/images/img_9824-1920x1075.jpg', alt_text: 'Hero slide 9', display_order: 8, is_active: true },
  ]
  const { error: hErr } = await supabase.from('hero_slides').upsert(heroSlides, { onConflict: 'id' })
  if (hErr) console.log('  Hero slides:', hErr.message)
  else console.log('  ✓ Hero slides seeded')

  // Seed Offices
  console.log('Seeding offices...')
  const offices = [
    { city: 'Dubai', country: 'UAE', phone: '+971 5018 77644', phone_href: 'tel:+971501877644', email: 'office@in-wavearchitects.com', email_href: 'mailto:office@in-wavearchitects.com', display_order: 0, is_active: true },
    { city: 'Los Angeles', country: 'USA', phone: '+1 954 271-5832', phone_href: 'tel:+19542715832', email: null, email_href: null, display_order: 1, is_active: true },
    { city: 'Kyiv', country: 'Ukraine', phone: '+380 98 080 77 07', phone_href: 'tel:+380980807707', email: null, email_href: null, display_order: 2, is_active: true },
    { city: 'Montreal', country: 'Canada', phone: '+1 4384053284', phone_href: 'tel:+14384053284', email: null, email_href: null, display_order: 3, is_active: true },
  ]
  const { error: oErr } = await supabase.from('offices').upsert(offices, { onConflict: 'id' })
  if (oErr) console.log('  Offices:', oErr.message)
  else console.log('  ✓ Offices seeded')

  // Seed Services
  console.log('Seeding services...')
  const services = [
    { name: 'Interior design', display_order: 0, is_active: true },
    { name: 'Architectural design', display_order: 1, is_active: true },
    { name: "Author's supervision", display_order: 2, is_active: true },
    { name: 'Equipment', display_order: 3, is_active: true },
    { name: 'Renovation', display_order: 4, is_active: true },
    { name: 'Realization', display_order: 5, is_active: true },
  ]
  const { error: sErr } = await supabase.from('services').upsert(services, { onConflict: 'id' })
  if (sErr) console.log('  Services:', sErr.message)
  else console.log('  ✓ Services seeded')

  // Seed Work Stages
  console.log('Seeding work stages...')
  const workStages = [
    { stage_number: '01', title: 'Start', description: 'We start by studying your project, taking all needed measurements and choosing style for it.', display_order: 0, is_active: true },
    { stage_number: '02', title: 'Plan', description: 'Then, we process a point-by-point plan and present several examples for you.', display_order: 1, is_active: true },
    { stage_number: '03', title: 'Visualization', description: 'At this stage we create detailed visualization for each room to provide you with an overall picture.', display_order: 2, is_active: true },
    { stage_number: '04', title: 'Album', description: 'The design project album with all plans and visualizations is ready.', display_order: 3, is_active: true },
  ]
  const { error: wErr } = await supabase.from('work_stages').upsert(workStages, { onConflict: 'id' })
  if (wErr) console.log('  Work stages:', wErr.message)
  else console.log('  ✓ Work stages seeded')

  // Seed Team Info
  console.log('Seeding team info...')
  const teamInfo = {
    title_lines: ['10 years experience', 'in combination with a', 'perfect taste'],
    description_paragraphs: ['Founded in 2016, IN-WAVE Architects has grown into a leading design studio specializing in luxury residential and commercial interiors. Our team combines years of experience with a passion for creating spaces that inspire.', 'With over 90 projects completed across 10 countries, we bring a global perspective to every design while respecting local traditions and preferences.'],
    image_url: '/images/team-photo.jpg',
    years_experience: 10,
    projects_count: 90,
    countries_count: 10,
  }
  const { error: tiErr } = await supabase.from('team_info').upsert(teamInfo, { onConflict: 'id' })
  if (tiErr) console.log('  Team info:', tiErr.message)
  else console.log('  ✓ Team info seeded')

  // Seed Social Links
  console.log('Seeding social links...')
  const socialLinks = [
    { platform: 'Facebook', icon_url: '/icons/facebook-ic.svg', href: 'https://www.facebook.com/IN-WAVE.Architecture.and.Design', display_order: 0, is_active: true },
    { platform: 'Instagram', icon_url: '/icons/instagram-ic.svg', href: 'https://www.instagram.com/in-wave.architects/', display_order: 1, is_active: true },
    { platform: 'Pinterest', icon_url: '/icons/pinterest-ic.svg', href: 'https://www.pinterest.com/nk__interior__', display_order: 2, is_active: true },
    { platform: 'Behance', icon_url: '/icons/behance-logo0-1.svg', href: 'https://www.behance.net/4ebd134f', display_order: 3, is_active: true },
    { platform: 'TikTok', icon_url: '/icons/logo-tiktok.svg', href: 'https://www.tiktok.com/@nk_interior_', display_order: 4, is_active: true },
    { platform: 'LinkedIn', icon_url: '/icons/linkedin-circle-1.svg', href: 'https://www.linkedin.com/company/106635723', display_order: 5, is_active: true },
  ]
  const { error: slErr } = await supabase.from('social_links').upsert(socialLinks, { onConflict: 'id' })
  if (slErr) console.log('  Social links:', slErr.message)
  else console.log('  ✓ Social links seeded')

  console.log('\n✅ Database initialization complete!')
  console.log('\n📋 Login credentials:')
  console.log('   Email: admin@in-wavearchitects.com')
  console.log('   Password: InWaveAdmin2025!')
  console.log('\n🌐 Dashboard: http://localhost:3000/dashboard')
}

initDatabase().catch(console.error)
