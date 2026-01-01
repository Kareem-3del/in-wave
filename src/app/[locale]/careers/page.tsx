import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { CareersClient } from '@/components/CareersClient';
import { CareersHero } from '@/components/CareersHero';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'careers' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SmoothScroll />
      <main className="careers-page wp-singular page-template page page-id-499 wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <CareersHero />
          <CareersClient />
          <Footer />
        </div>
      </main>
    </>
  );
}
