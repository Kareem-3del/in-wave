import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import SmoothScroll from '@/components/SmoothScroll';
import { ServicesClient } from '@/components/ServicesClient';
import { ServicesHero } from '@/components/ServicesHero';
import { getServices } from '@/lib/data/services';

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

  const services = await getServices();

  return (
    <>
      <SmoothScroll />
      <main className="services-page bg-neutral-950 min-h-screen">
        <Header />
        <div className="main-wrap">
          <ServicesHero locale={locale} />
          <ServicesClient services={services} />
          <div id="contact-form">
            <ContactForm />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
