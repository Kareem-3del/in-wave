import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { ProjectDetailClient } from '@/components/ProjectDetailClient';
import { getProjectBySlug, getProjects } from '@/lib/data/projects';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = locale === 'ar' && project.title_italic_ar
    ? `${project.title_italic_ar} ${project.title_regular_ar || project.title_regular}`
    : `${project.title_italic_en || project.title_italic} ${project.title_regular_en || project.title_regular}`;

  return {
    title: `${title} | NKEY Architects`,
    description: `${title} - ${project.location} (${project.year})`,
  };
}

// Dynamic route - projects are fetched at request time
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projectDetail');
  let project = await getProjectBySlug(slug);

  // Fallback projects for demo
  const fallbackProjects = [
    {
      id: '1',
      type: 1,
      images: [
        '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp',
        '/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-13-1688x1080-1-1024x655.webp',
      ],
      title_italic: 'ZENITH',
      title_regular: 'GROVE',
      title_italic_en: 'ZENITH',
      title_regular_en: 'GROVE',
      title_italic_ar: 'زينيث',
      title_regular_ar: 'غروف',
      location: 'INDIA',
      location_en: 'INDIA',
      location_ar: 'الهند',
      year: '2025',
      href: '/portfolio/zenith-grove',
      show_marquee: false,
      display_order: 1,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
    {
      id: '2',
      type: 2,
      images: ['/images/img_2256-1024x573.jpg.webp'],
      title_italic: 'NOIR',
      title_regular: 'NEST',
      title_italic_en: 'NOIR',
      title_regular_en: 'NEST',
      title_italic_ar: 'نوار',
      title_regular_ar: 'نيست',
      location: 'USA',
      location_en: 'USA',
      location_ar: 'أمريكا',
      year: '2025',
      href: '/portfolio/noir-nest',
      show_marquee: false,
      display_order: 2,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
  ];

  // Try fallback if no project found
  if (!project) {
    const fallback = fallbackProjects.find(
      (p) => p.href === `/portfolio/${slug}`
    );
    if (fallback) {
      project = fallback;
    }
  }

  if (!project) {
    notFound();
  }

  // Get related projects (same type)
  const allProjects = await getProjects();
  const relatedProjects = allProjects.length > 0
    ? allProjects.filter((p) => p.id !== project.id && p.type === project.type).slice(0, 3)
    : fallbackProjects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <>
      <SmoothScroll />
      <main className="project-detail-page wp-singular single-project wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
          <Footer />
        </div>
      </main>
    </>
  );
}
