import { getProjects } from '@/lib/data/projects';
import { GalleryClient } from './GalleryClient';

export default async function Gallery() {
  const projects = await getProjects();

  // If no projects in DB, use fallback
  if (projects.length === 0) {
    const fallbackItems = [
      {
        id: '1',
        type: 1,
        images: [
          '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp',
          '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-13-1688x1080-1-1024x655.webp'
        ],
        title_italic: 'ZENITH',
        title_regular: 'GROVE',
        location: 'INDIA',
        year: '2025',
        href: '/portfolio/zenith-grove',
        show_marquee: true
      },
      {
        id: '2',
        type: 2,
        images: ['/images/img_2256-1024x573.jpg.webp'],
        title_italic: 'NOIR',
        title_regular: 'NEST',
        location: 'USA',
        year: '2025',
        href: '/portfolio/noir-nest',
        show_marquee: false
      },
    ];
    return <GalleryClient items={fallbackItems} />;
  }

  return <GalleryClient items={projects} />;
}
