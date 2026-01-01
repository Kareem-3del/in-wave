import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { AboutUsClient } from '@/components/AboutUsClient';

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

  return (
    <>
      <SmoothScroll />
      <main className="about-page wp-singular page-template page wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <AboutUsClient />
          <Footer />
        </div>
      </main>
    </>
  );
}
