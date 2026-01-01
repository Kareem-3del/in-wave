import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { ServicesClient } from '@/components/ServicesClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SmoothScroll />
      <main className="services-page wp-singular page-template page wp-theme-nk">
        <Header />
        <div className="main-wrap">
          <ServicesClient />
          <Footer />
        </div>
      </main>
    </>
  );
}
