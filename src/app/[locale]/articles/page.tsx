import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { ArticlesClient } from '@/components/ArticlesClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'articles' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('articles');

  // Placeholder articles - in a real app, this would come from a database
  const articles: never[] = [];

  return (
    <>
      <SmoothScroll />
      <main className="articles-page wp-singular page-template page page-id-501 wp-theme-nk">
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

          <ArticlesClient articles={articles} />

          <Footer />
        </div>
      </main>
    </>
  );
}
