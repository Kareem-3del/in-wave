'use client';

import { useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SimpleMarquee } from './Marquee';
import type { Locale } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkStage {
  id: string;
  stage_number: string;
  title: string;
  description: string;
  // Bilingual fields
  title_en?: string | null;
  title_ar?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
}

interface WorkStagesClientProps {
  stages: WorkStage[];
}

function getLocalizedValue(item: WorkStage, field: 'title' | 'description', locale: Locale): string {
  const localizedKey = `${field}_${locale}` as keyof WorkStage;
  const fallbackKey = `${field}_en` as keyof WorkStage;
  const legacyKey = field as keyof WorkStage;

  return (item[localizedKey] as string) || (item[fallbackKey] as string) || (item[legacyKey] as string) || '';
}

export function WorkStagesClient({ stages }: WorkStagesClientProps) {
  const t = useTranslations('workStages');
  const locale = useLocale() as Locale;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const isDesk = window.innerWidth >= 1280;
    if (!isDesk) return;

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const stageItems = sectionRef.current.querySelectorAll('.work-stages__item');
    const rectBtn = sectionRef.current.querySelector('.btn-rect');

    const ctx = gsap.context(() => {
      stageItems.forEach((stage, index) => {
        if (index < 2) {
          gsap.set(stage, { y: 15 * rem });
        }
      });
      if (rectBtn) {
        gsap.set(rectBtn, { y: 15 * rem });
      }

      stageItems.forEach((stage, index) => {
        if (index < 2) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: `top-=${window.innerHeight / 2} 30%`,
            end: `+=${window.innerHeight / 2}`,
            scrub: 1,
            onUpdate: (self) => {
              gsap.to(stage, {
                y: 15 * rem - self.progress * 15 * rem,
                duration: 0.1
              });
              if (index === 0 && rectBtn) {
                gsap.to(rectBtn, {
                  y: 15 * rem - self.progress * 15 * rem,
                  duration: 0.1
                });
              }
            }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section work-stages-section" ref={sectionRef}>
      <div className="container">
        <div className="work-stages">
          {stages.map((stage) => (
            <div key={stage.id} className="work-stages__item">
              <span className="work-stages__item__title">{getLocalizedValue(stage, 'title', locale)}</span>
              <i className="work-stages__item__num">{stage.stage_number}</i>
              <div className="work-stages__item__desc">{getLocalizedValue(stage, 'description', locale)}</div>
            </div>
          ))}
        </div>

      </div>

      <SimpleMarquee text={t('marqueeText')} italicPart={t('marqueeItalic')} >
        <Link href="/portfolio"
          className='hero-contact d3-btn'
        //  className="btn-rect"
        >
          <div>
            <div className='hero-send'>
              {t('free3dTour').split(' ').slice(0, 1)}
              <svg
                style={{
                  ...(locale === "ar" && {
                    transform: "scale(-1)"
                  })
                }}
                width="25" height="8" viewBox="0 0 25 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3536 4.35356C24.5488 4.15829 24.5488 3.84171 24.3536 3.64645L21.1716 0.464468C20.9763 0.269206 20.6597 0.269206 20.4645 0.464468C20.2692 0.65973 20.2692 0.976313 20.4645 1.17157L23.2929 4L20.4645 6.82843C20.2692 7.02369 20.2692 7.34027 20.4645 7.53554C20.6597 7.7308 20.9763 7.7308 21.1716 7.53554L24.3536 4.35356ZM-4.37114e-08 4.5L24 4.5L24 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z" fill="url(#paint0_linear_1107_87)" />
                <defs>
                  <linearGradient id="paint0_linear_1107_87" x1="-8.74228e-08" y1="5" x2="0.083189" y2="3.00347" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" />
                    <stop offset="1" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className='hero-contact-text'>
              {t('free3dTour').split(' ').slice(1).join(' ')}
            </div>
          </div>
          {/* <span>{t('free3dTour').split(' ').slice(0, 1)}<br /> {t('free3dTour').split(' ').slice(1).join(' ')}</span> */}
        </Link>
      </SimpleMarquee>
    </section>
  );
}
