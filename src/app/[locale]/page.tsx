import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Quote from '@/components/Quote';
import WorkStages from '@/components/WorkStages';
import HomeOwners from '@/components/HomeOwners';
import MapSection from '@/components/MapSection';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import FixedButtons from '@/components/FixedButtons';
import SmoothScroll from '@/components/SmoothScroll';
import { getTeamInfo } from '@/lib/data/team-info';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const teamInfo = await getTeamInfo();

  console.log("teamInfo = ", teamInfo)

  return (
    <>
      <SmoothScroll />
      <main className="home wp-singular page-template page-template-front-page page-template-front-page-php page page-id-496 wp-theme-nk">
        <Preloader />
        <Header />
        <FixedButtons />
        <div className="main-wrap">
          <Hero />
          <Gallery />
          <Quote />
          <WorkStages />
          <HomeOwners teamInfo={teamInfo} locale={locale as 'en' | 'ar'} />
          <MapSection />
          <div className='t-c-container'>
            <div className="t-c-container-text-sec">
              <img alt='sh-right' src="/images/text.png" />
            </div>
            <div className='t-c-container-frame t-c-container-frame-top'>
              <img alt='sh-right' src="/images/sh-right.png" />
            </div>
            <div className='t-c-container-frame t-c-container-frame-bottom'>
              <img alt='sh-right' src="/images/sh-left.png" />
            </div>
            <Testimonials />
            <ContactForm />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
