'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Atropos from 'atropos/react';
import 'atropos/css';
import { ZebraMarquee } from './Marquee';
import type { Locale } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryItem {
  id: string;
  type: number;
  images: string[];
  title_italic: string;
  title_regular: string;
  location: string;
  year: string;
  href: string;
  show_marquee: boolean;
  // Bilingual fields
  title_italic_en?: string | null;
  title_italic_ar?: string | null;
  title_regular_en?: string | null;
  title_regular_ar?: string | null;
  location_en?: string | null;
  location_ar?: string | null;
}

interface GalleryClientProps {
  items: GalleryItem[];
}

function getLocalizedValue(item: GalleryItem, field: 'title_italic' | 'title_regular' | 'location', locale: Locale): string {
  const localizedKey = `${field}_${locale}` as keyof GalleryItem;
  const fallbackKey = `${field}_en` as keyof GalleryItem;
  const legacyKey = field as keyof GalleryItem;

  return (item[localizedKey] as string) || (item[fallbackKey] as string) || (item[legacyKey] as string) || '';
}

function GallerySection({ item, marqueeText, locale }: { item: GalleryItem; marqueeText: string; locale: Locale }) {
  const galleryRef = useRef<HTMLDivElement>(null);

  const titleItalic = getLocalizedValue(item, 'title_italic', locale);
  const titleRegular = getLocalizedValue(item, 'title_regular', locale);
  const location = getLocalizedValue(item, 'location', locale);

  useEffect(() => {
    if (!galleryRef.current) return;

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const images = galleryRef.current.querySelectorAll('img');

    images.forEach((img) => {
      gsap.set(img, { rotate: -15, y: 5 * rem, opacity: 0 });
    });

    const ctx = gsap.context(() => {
      const galleryHeight = galleryRef.current?.offsetHeight || 500;

      ScrollTrigger.create({
        trigger: galleryRef.current,
        start: `top-=${galleryHeight / 2} 30%`,
        end: `+=${galleryHeight * 0.7}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          images.forEach((img) => {
            gsap.to(img, {
              rotate: -15 * (1 - progress),
              y: 5 * rem - 5 * rem * progress,
              opacity: progress,
              duration: 0.1
            });
          });
        }
      });

      ScrollTrigger.create({
        trigger: galleryRef.current,
        start: `top+=${galleryHeight / 2} 30%`,
        end: `+=${galleryHeight}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          images.forEach((img) => {
            gsap.to(img, {
              rotate: 15 * progress,
              y: -10 * rem * progress,
              opacity: 1 - progress,
              duration: 0.1
            });
          });
        }
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  const images = item.images || [];

  return (
    <section className="section home-gallery-section">
      <div className="container">
        <Atropos
          className="gallery-card-atropos"
          activeOffset={50}
          shadowScale={1.05}
          shadow={true}
          highlight={true}
          rotateXMax={8}
          rotateYMax={8}
          rotateTouch="scroll-y"
        >
          <div className={`home-gallery home-gallery--${item.type}`} ref={galleryRef} data-atropos-offset="0">
            {images[0] && (
              <div className="home-gallery__img home-gallery__img--1" data-atropos-offset="5">
                <Image
                  src={images[0]}
                  alt={`${titleItalic} ${titleRegular}`}
                  fill
                  sizes="(max-width: 1280px) 80vw, 60rem"
                />
              </div>
            )}
            {images[1] && (
              <div className="home-gallery__img home-gallery__img--2" data-atropos-offset="10">
                <Image
                  src={images[1]}
                  alt={`${titleItalic} ${titleRegular}`}
                  fill
                  sizes="(max-width: 1280px) 75vw, 63rem"
                />
              </div>
            )}
            <Link href={item.href} className="title-link" data-atropos-offset="15">
              <div className="title-link__name">
                <i>{titleItalic}</i> {titleRegular}
              </div>
              <div className="title-link__dateplace">
                <span>{location} / {item.year}</span>
                <svg viewBox="0 0 80 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5H78M78 5L73 0M78 5L73 10" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
              </div>
            </Link>
          </div>
        </Atropos>
      </div>
      {item.show_marquee && <ZebraMarquee text={marqueeText} />}
    </section>
  );
}

export function GalleryClient({ items }: GalleryClientProps) {
  const t = useTranslations('gallery');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  return (
    <div className="home-galleries">
      {items.map((item) => (
        <GallerySection key={item.id} item={item} marqueeText={t('marqueeText')} locale={locale} />
      ))}
      <div className="container">
        <Link href="/portfolio" className="btn btn--default btn--borderdraw">
          {tCommon('moreProjects')}
        </Link>
      </div>
    </div>
  );
}
