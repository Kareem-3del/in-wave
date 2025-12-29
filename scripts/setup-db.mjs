// Database setup script using Supabase REST API
const SUPABASE_URL = 'https://hrduplvhuglxukyiwmez.supabase.co';
const SERVICE_KEY = 'sb_secret_HsIQEQR_CLntM0vjTXEX6g_naanFXY2';

async function createTable(tableName, columns) {
  // We'll insert data directly - tables are created automatically in Supabase
  console.log(`  Setting up ${tableName}...`);
}

async function insertData(table, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${table}: ${text}`);
  }
  return true;
}

async function checkTable(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    }
  });
  return response.ok;
}

async function main() {
  console.log('🚀 Setting up NKEY Architects Database...\n');

  // Check if tables exist
  const tablesExist = await checkTable('projects');

  if (!tablesExist) {
    console.log('❌ Tables do not exist yet.\n');
    console.log('Please run the schema.sql file in Supabase SQL Editor:');
    console.log('1. Go to: https://supabase.com/dashboard/project/hrduplvhuglxukyiwmez/sql/new');
    console.log('2. Copy contents of: supabase/schema.sql');
    console.log('3. Click "Run"\n');
    console.log('Then run this script again: node scripts/setup-db.mjs');
    process.exit(1);
  }

  console.log('✓ Tables exist! Seeding data...\n');

  try {
    // Seed Projects
    console.log('Seeding projects...');
    await insertData('projects', [
      { type: 1, images: ['/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp', '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-13-1688x1080-1-1024x655.webp'], title_italic: 'ZENITH', title_regular: 'GROVE', location: 'INDIA', year: '2025', href: '/portfolio/zenith-grove', show_marquee: true, display_order: 0, is_active: true },
      { type: 2, images: ['/images/img_2256-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'NEST', location: 'USA', year: '2025', href: '/portfolio/noir-nest', show_marquee: false, display_order: 1, is_active: true },
      { type: 1, images: ['/images/1-22-764x1080-1-724x1024.webp', '/images/30-1-1920x1075-1-1024x573.webp'], title_italic: 'VILLA', title_regular: 'CASCADE', location: 'UAE', year: '2024', href: '/portfolio/villa-cascade', show_marquee: true, display_order: 2, is_active: true },
      { type: 2, images: ['/images/img_9119-1024x640.jpg.webp'], title_italic: 'EXQUISITE', title_regular: 'RESIDENCE', location: 'UAE', year: '2023', href: '/portfolio/exquisite-residence', show_marquee: false, display_order: 3, is_active: true },
      { type: 3, images: ['/images/living__view09-kopiya-573x1024.jpg.webp', '/images/living___view290000-kopiya-1024x573.jpg.webp'], title_italic: 'TRANQUIL', title_regular: 'LUX', location: 'USA', year: '2024', href: '/portfolio/tranquil-lux', show_marquee: false, display_order: 4, is_active: true },
      { type: 1, images: ['/images/nk_view190001_post-1-573x1024.jpg.webp', '/images/img_6310-1024x573.jpg.webp'], title_italic: 'ARCHITECTURAL', title_regular: 'ELEGANCE', location: 'UAE', year: '2024', href: '/portfolio/architectural-elegance', show_marquee: true, display_order: 5, is_active: true },
      { type: 2, images: ['/images/acacia_11-2-1024x573.jpg.webp'], title_italic: 'LUXURY', title_regular: 'LIVING', location: 'PHILIPPINES', year: '2024', href: '/portfolio/luxury-living', show_marquee: false, display_order: 6, is_active: true },
      { type: 3, images: ['/images/thureya-new_main-zone_view20-573x1024.jpg.webp', '/images/thureya-new_main-zone_view310000-1024x573.jpg.webp'], title_italic: 'NOIR', title_regular: 'HORIZON', location: 'UAE', year: '2024', href: '/portfolio/noir-horizon', show_marquee: false, display_order: 7, is_active: true },
    ]);
    console.log('  ✓ Projects seeded');

    // Seed Testimonials
    console.log('Seeding testimonials...');
    await insertData('testimonials', [
      { name: 'John', rating: 5, text: "The studio's systematic approach and exceptional organization exceeded my expectations. They were attentive to every detail, ensuring nothing was overlooked. The final result was even better than I imagined, and I couldn't be happier!", display_order: 0, is_active: true },
      { name: 'Ahmed', rating: 5, text: "This team knows how to make things happen! Their organizational skills and methodical approach ensured a smooth process, and their ability to focus on the smallest details brought our project to life in the most incredible way.", display_order: 1, is_active: true },
      { name: 'Esam', rating: 5, text: "I was blown away by the level of professionalism and efficiency of the studio. The entire process was stress free, and their ability to balance creativity with a structured approach truly sets them apart. Highly recommended!", display_order: 2, is_active: true },
      { name: 'Aisha', rating: 5, text: "The studio's procurement process is flawless. Every piece, from furniture to finishes, was carefully sourced and delivered without a hitch. Their professionalism and efficiency saved us time and eliminated unnecessary stress.", display_order: 3, is_active: true },
      { name: 'Ahmed', rating: 5, text: "Designing our villa was a massive undertaking, but this studio made it an enjoyable journey. From the grand entryway to the cozy bedrooms, every detail was carefully thought out. Thank you for turning our dream home into a reality!", display_order: 4, is_active: true },
      { name: 'Nico', rating: 5, text: "We've partnered with many design firms over the years, but this studio stands out for their strategic and creative approach. Their designs brought our project to life, combining modern luxury with thoughtful functionality.", display_order: 5, is_active: true },
    ]);
    console.log('  ✓ Testimonials seeded');

    // Seed Hero Slides
    console.log('Seeding hero slides...');
    await insertData('hero_slides', [
      { image_url: '/images/sl-home1.jpg', alt_text: 'Hero slide 1', display_order: 0, is_active: true },
      { image_url: '/images/img_8442-1920x1080.jpg', alt_text: 'Hero slide 2', display_order: 1, is_active: true },
      { image_url: '/images/img_9119-1728x1080.jpg', alt_text: 'Hero slide 3', display_order: 2, is_active: true },
      { image_url: '/images/img_0249-1920x1075.jpg', alt_text: 'Hero slide 4', display_order: 3, is_active: true },
      { image_url: '/images/villa_greece_1-3-1-2-1920x1075.jpg', alt_text: 'Hero slide 5', display_order: 4, is_active: true },
      { image_url: '/images/img_8473-1-1920x1080.jpg', alt_text: 'Hero slide 6', display_order: 5, is_active: true },
      { image_url: '/images/local_mr_obaid_dubai_2243_entrance_main_hall_family_dining_v1_28-7-1920x1075.jpg', alt_text: 'Hero slide 7', display_order: 6, is_active: true },
      { image_url: '/images/img_1493-1-1-scaled-2-1920x960.jpg', alt_text: 'Hero slide 8', display_order: 7, is_active: true },
      { image_url: '/images/img_9824-1920x1075.jpg', alt_text: 'Hero slide 9', display_order: 8, is_active: true },
    ]);
    console.log('  ✓ Hero slides seeded');

    // Seed Offices
    console.log('Seeding offices...');
    await insertData('offices', [
      { city: 'Dubai', country: 'UAE', phone: '+971 5018 77644', phone_href: 'tel:+971501877644', email: 'office@nkeyarchitects.com', email_href: 'mailto:office@nkeyarchitects.com', display_order: 0, is_active: true },
      { city: 'Los Angeles', country: 'USA', phone: '+1 954 271-5832', phone_href: 'tel:+19542715832', display_order: 1, is_active: true },
      { city: 'Kyiv', country: 'Ukraine', phone: '+380 98 080 77 07', phone_href: 'tel:+380980807707', display_order: 2, is_active: true },
      { city: 'Montreal', country: 'Canada', phone: '+1 4384053284', phone_href: 'tel:+14384053284', display_order: 3, is_active: true },
    ]);
    console.log('  ✓ Offices seeded');

    // Seed Services
    console.log('Seeding services...');
    await insertData('services', [
      { name: 'Interior design', display_order: 0, is_active: true },
      { name: 'Architectural design', display_order: 1, is_active: true },
      { name: "Author's supervision", display_order: 2, is_active: true },
      { name: 'Equipment', display_order: 3, is_active: true },
      { name: 'Renovation', display_order: 4, is_active: true },
      { name: 'Realization', display_order: 5, is_active: true },
    ]);
    console.log('  ✓ Services seeded');

    // Seed Work Stages
    console.log('Seeding work stages...');
    await insertData('work_stages', [
      { stage_number: '01', title: 'Start', description: 'We start by studying your project, taking all needed measurements and choosing style for it.', display_order: 0, is_active: true },
      { stage_number: '02', title: 'Plan', description: 'Then, we process a point-by-point plan and present several examples for you.', display_order: 1, is_active: true },
      { stage_number: '03', title: 'Visualization', description: 'At this stage we create detailed visualization for each room to provide you with an overall picture.', display_order: 2, is_active: true },
      { stage_number: '04', title: 'Album', description: 'The design project album with all plans and visualizations is ready.', display_order: 3, is_active: true },
    ]);
    console.log('  ✓ Work stages seeded');

    // Seed Team Info
    console.log('Seeding team info...');
    await insertData('team_info', [{
      title_lines: ['8 years experience', 'in combination with a', 'perfect taste'],
      description_paragraphs: ['Founded in 2016, NKEY Architects has grown into a leading design studio.', 'With over 90 projects completed across 10 countries.'],
      image_url: '/images/team-photo.jpg',
      years_experience: 8,
      projects_count: 90,
      countries_count: 10,
    }]);
    console.log('  ✓ Team info seeded');

    // Seed Social Links
    console.log('Seeding social links...');
    await insertData('social_links', [
      { platform: 'Facebook', icon_url: '/icons/facebook-ic.svg', href: 'https://www.facebook.com/NKEY.Architecture.and.Design', display_order: 0, is_active: true },
      { platform: 'Instagram', icon_url: '/icons/instagram-ic.svg', href: 'https://www.instagram.com/nkey.architects/', display_order: 1, is_active: true },
      { platform: 'Pinterest', icon_url: '/icons/pinterest-ic.svg', href: 'https://www.pinterest.com/nk__interior__', display_order: 2, is_active: true },
      { platform: 'Behance', icon_url: '/icons/behance-logo0-1.svg', href: 'https://www.behance.net/4ebd134f', display_order: 3, is_active: true },
      { platform: 'TikTok', icon_url: '/icons/logo-tiktok.svg', href: 'https://www.tiktok.com/@nk_interior_', display_order: 4, is_active: true },
      { platform: 'LinkedIn', icon_url: '/icons/linkedin-circle-1.svg', href: 'https://www.linkedin.com/company/106635723', display_order: 5, is_active: true },
    ]);
    console.log('  ✓ Social links seeded');

    console.log('\n✅ Database setup complete!\n');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@nkeyarchitects.com');
    console.log('   Password: NkeyAdmin2025!');
    console.log('\n🌐 Dashboard: http://localhost:3000/dashboard');

  } catch (error) {
    if (error.message.includes('duplicate') || error.message.includes('already exists')) {
      console.log('\n⚠️  Data already exists (this is okay)');
    } else {
      console.error('\n❌ Error:', error.message);
    }
  }
}

main();
