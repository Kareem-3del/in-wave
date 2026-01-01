import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { AboutUsClient } from '@/components/AboutUsClient';
import { getTeamInfo } from '@/lib/data/team-info';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutUs' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('aboutUs');
  const teamInfo = await getTeamInfo();

  const defaultTeamInfo = {
    years_experience: 8,
    projects_count: 90,
    countries_count: 10,
    image_url: '/images/img_7397-1-683x1024.jpg.webp',
  };

  const displayTeamInfo = teamInfo || defaultTeamInfo;

  return (
    <>
      <SmoothScroll />
      <main className="about-page wp-singular page-template page page-id-500 wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <section className="section page-hero-section">
            <div className="container">
              <div className="page-hero">
                <h1 className="page-hero__title">
                  <span className="title">
                    <span className="title__item">
                      <span><i>{t('heroTitleItalic')}</i> {t('heroTitle')}</span>
                    </span>
                  </span>
                </h1>
                <p className="page-hero__desc">{t('heroDescription')}</p>
              </div>
            </div>
          </section>

          <AboutUsClient teamInfo={displayTeamInfo} />

          <Footer />
        </div>
      </main>
    </>
  );
}
