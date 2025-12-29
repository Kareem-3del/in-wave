import { getHeroSlides } from '@/lib/data/hero-slides';
import { HeroClient } from './HeroClient';

export default async function Hero() {
  const slides = await getHeroSlides();

  // If no slides in DB, use fallback
  if (slides.length === 0) {
    const fallbackSlides = [
      { id: '1', image_url: '/images/sl-home1.jpg', alt_text: null },
      { id: '2', image_url: '/images/img_8442-1920x1080.jpg', alt_text: null },
      { id: '3', image_url: '/images/img_9119-1728x1080.jpg', alt_text: null },
    ];
    return <HeroClient slides={fallbackSlides} />;
  }

  return <HeroClient slides={slides} />;
}
