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
        <Link href="/portfolio" className="btn-rect">
          <span>{t('free3dTour').split(' ').slice(0, 1)}<br /> {t('free3dTour').split(' ').slice(1).join(' ')}</span>
        </Link>
      </div>

      <SimpleMarquee text={t('marqueeText')} italicPart={t('marqueeItalic')} />
    </section>
  );
}
