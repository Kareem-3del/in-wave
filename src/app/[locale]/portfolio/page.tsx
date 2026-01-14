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

  return (
    <>
      <SmoothScroll />
      <main className="portfolio-archive wp-singular page-template-portfolio page wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <PortfolioClient projects={projects} />
          <ContactForm />
          <Footer />
        </div>
      </main>
    </>
  );
}
