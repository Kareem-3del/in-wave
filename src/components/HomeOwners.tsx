'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Atropos from 'atropos/react';
import 'atropos/css';
import { SimpleMarquee } from './Marquee';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeOwners() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const titleItems = sectionRef.current.querySelectorAll('.home-owners__info .title__item span');
    const photo = sectionRef.current.querySelector('.home-owners__photo img');

    const ctx = gsap.context(() => {
      titleItems.forEach((item) => {
        gsap.set(item, { y: 50, rotate: 15 });
      });
      if (photo) {
        gsap.set(photo, { rotate: 45, y: 15 * rem, autoAlpha: 0 });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top-=200 50%',
        end: `+=${window.innerHeight / 2}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          titleItems.forEach((item) => {
            gsap.to(item, {
              y: (1 - progress) * 50,
              rotate: (1 - progress) * 15,
              duration: 0.1
            });
          });

          if (photo) {
            gsap.to(photo, {
              rotate: (1 - progress) * 45,
              y: 15 * rem - 15 * rem * progress,
              autoAlpha: progress,
              duration: 0.1
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section home-owners-section" ref={sectionRef}>
      <div className="container">
        <div className="home-owners">
          <div className="home-owners__info">
            <span className="title">
              <span className="title__item">
                <span><i>{t('title1Italic')} </i></span>
              </span>
              <span className="title__item">
                <span>{t('title2')} </span>
              </span>
              <span className="title__item">
                <span><i>{t('title3Italic')}</i></span>
              </span>
            </span>

            <div className="home-owners__desc">
              <p>{t('desc1')}</p>
              <p>{t('desc2')}</p>
              <p>{t('desc3')}</p>
            </div>
          </div>
          <div className="home-owners__photo">
            <Atropos
              activeOffset={40}
              shadowScale={1.05}
              shadow={true}
              highlight={true}
              rotateXMax={8}
              rotateYMax={8}
              rotateTouch="scroll-y"
            >
              <Image
                src="/images/img_7397-1-683x1024.jpg.webp"
                alt="NKEY Architects Team"
                width={683}
                height={1024}
                style={{ width: '100%', height: 'auto' }}
                data-atropos-offset="0"
              />
            </Atropos>
          </div>
        </div>
      </div>

      <SimpleMarquee text={t('marqueeText')} italicPart={t('marqueeItalic')} />
    </section>
  );
}
