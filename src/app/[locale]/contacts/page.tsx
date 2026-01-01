import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import MapSection from '@/components/MapSection';
import SmoothScroll from '@/components/SmoothScroll';
import { ContactsClient } from '@/components/ContactsClient';
import { getAllOffices } from '@/lib/data/offices';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contacts' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contacts');
  const offices = await getAllOffices();

  return (
    <>
      <SmoothScroll />
      <main className="contacts-page wp-singular page-template page page-id-502 wp-theme-nk">
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

          <ContactsClient offices={offices} />

          <section className="section contacts-form-section">
            <div className="container">
              <h2 className="section-title">{t('sendMessage')}</h2>
            </div>
          </section>
          <ContactForm />

          <MapSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
