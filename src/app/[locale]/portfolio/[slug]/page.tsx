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
    title: `${title} | IN-WAVE Architects`,
    description: `${title} - ${project.location} (${project.year})`,
  };
}

// Dynamic route - projects are fetched at request time
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projectDetail');
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get related projects (same type)
  const allProjects = await getProjects();
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.type === project.type)
    .slice(0, 3);

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
