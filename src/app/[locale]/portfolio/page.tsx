import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import SmoothScroll from '@/components/SmoothScroll';
import { PortfolioClient } from '@/components/PortfolioClient';
import { getProjects } from '@/lib/data/projects';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'portfolio' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();

  // Fallback projects if none in DB
  const fallbackProjects = [
    {
      id: '1',
      type: 1,
      images: ['/images/270_kunal_schem_and_int_design_1200m_villa_india_exterior_v1_2024-7-655x1024.jpg.webp'],
      title_italic: 'ZENITH',
      title_regular: 'GROVE',
      location: 'INDIA',
      year: '2025',
      href: '/portfolio/zenith-grove',
      show_marquee: false,
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
      show_marquee: false,
    },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <>
      <SmoothScroll />
      <main className="portfolio-archive wp-singular page-template-portfolio page wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <PortfolioClient projects={displayProjects} />
          <ContactForm />
          <Footer />
        </div>
      </main>
    </>
  );
}
