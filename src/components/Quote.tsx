'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Quote() {
  const t = useTranslations('quote');
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quoteRef.current) return;

    const isDesk = window.innerWidth >= 1280;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const ctx = gsap.context(() => {
      const oddItems = quoteRef.current?.querySelectorAll('.quote__item:nth-child(odd)');
      const evenItems = quoteRef.current?.querySelectorAll('.quote__item:nth-child(even)');
      const vertical1 = quoteRef.current?.querySelector('.quote__vertical--1');
      const vertical2 = quoteRef.current?.querySelector('.quote__vertical--2');

      /* =======================
         📱 MOBILE FIX
      ======================= */
      if (!isDesk) {
        // 1️⃣ امسح أي transforms قديمة
        gsap.set('.quote__item', {
          clearProps: 'x,y,rotate'
        });

        // 2️⃣ حركة X خفيفة
        const mobileOffset = window.innerWidth * 0.35;

        oddItems?.forEach((elem) => {
          gsap.set(elem, { x: mobileOffset });
        });

        evenItems?.forEach((elem) => {
          gsap.set(elem, { x: -mobileOffset });
        });

        ScrollTrigger.create({
          trigger: quoteRef.current,
          start: 'top 60%',
          end: `+=${window.innerHeight / 2}`,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            oddItems?.forEach((elem) => {
              gsap.to(elem, {
                x: (1 - progress) * mobileOffset,
                duration: 0.1
              });
            });

            evenItems?.forEach((elem) => {
              gsap.to(elem, {
                x: (1 - progress) * -mobileOffset,
                duration: 0.1
              });
            });

            if (vertical1) {
              gsap.to(vertical1, { y: -4 * rem * progress, duration: 0.1 });
            }

            if (vertical2) {
              gsap.to(vertical2, { y: -7 * rem * progress, duration: 0.1 });
            }
          }
        });

        return;
      }

      /* =======================
         🖥️ DESKTOP (زي ما هو)
      ======================= */

      const item2Inner = quoteRef.current?.querySelector(
        '.quote__item:nth-child(2) .quote__item__inner'
      );
      const item3 = quoteRef.current?.querySelector('.quote__item:nth-child(3)');
      const item4 = quoteRef.current?.querySelector('.quote__item:nth-child(4)');
      const horizontalLine = quoteRef.current?.querySelector('.quote__horizontal');
      const coverTop = quoteRef.current?.querySelector('.quote__cover--top');
      const coverTopLine = coverTop?.querySelector('div');
      const coverBot = quoteRef.current?.querySelector('.quote__cover--bot');
      const quoteItems = quoteRef.current?.querySelectorAll('.quote__item');

      const horizontalLineWidth = horizontalLine
        ? (horizontalLine as HTMLElement).offsetWidth / 2
        : 0;

      const coverTopWidth = window.innerWidth * 0.2;
      const coverTopLineMovementWidth = window.innerWidth * 0.08;

      if (item2Inner) gsap.set(item2Inner, { rotate: 25, y: 3 * rem });
      if (item3) gsap.set(item3, { x: 15 * rem });
      if (item4) gsap.set(item4, { x: 5 * rem });
      if (coverTop) gsap.set(coverTop, { width: coverTopWidth, marginLeft: window.innerWidth * 0.2 });
      if (coverTopLine) gsap.set(coverTopLine, { right: coverTopLineMovementWidth });

      ScrollTrigger.create({
        trigger: quoteRef.current,
        start: `top-=${10 * rem} 50%`,
        end: `+=${window.innerHeight / 2}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (item2Inner) {
            gsap.to(item2Inner, {
              rotate: (1 - progress) * 25,
              y: (1 - progress) * 3 * rem,
              duration: 0.1
            });
          }

          if (item3) {
            gsap.to(item3, { x: (1 - progress) * 15 * rem, duration: 0.1 });
          }

          if (item4) {
            gsap.to(item4, { x: (1 - progress) * 5 * rem, duration: 0.1 });
          }

          if (vertical1) {
            gsap.to(vertical1, { y: -5 * rem * progress, duration: 0.1 });
          }

          if (vertical2) {
            gsap.to(vertical2, { y: -20 * rem * progress, duration: 0.1 });
          }

          if (horizontalLine) {
            gsap.to(horizontalLine, { x: progress * horizontalLineWidth, duration: 0.1 });
          }

          if (coverBot) {
            gsap.to(coverBot, { marginRight: progress * -27 * rem, duration: 0.1 });
          }

          if (coverTop) {
            gsap.to(coverTop, {
              width: coverTopWidth * (1 - progress),
              marginLeft: (1 - progress) * window.innerWidth * 0.2,
              duration: 0.1
            });
          }

          if (coverTopLine) {
            gsap.to(coverTopLine, {
              right: coverTopLineMovementWidth * (1 - progress),
              duration: 0.1
            });
          }
        }
      });

      const quoteHeight = quoteRef.current?.offsetHeight || 500;

      ScrollTrigger.create({
        trigger: quoteRef.current,
        start: `top+=${quoteHeight / 2} 40%`,
        end: `+=${window.innerHeight / 2}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const itemCount = quoteItems?.length || 0;

          quoteItems?.forEach((elem, i) => {
            gsap.to(elem, {
              y: progress * (itemCount - i) * -5 * rem,
              duration: 0.1
            });
          });
        }
      });
    }, quoteRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section quote-section">
      <div className="container">
        <div className="quote" ref={quoteRef}>
          <div className="quote__item">
            <span className="quote__item__inner">{t('line1')}</span>
          </div>
          <div className="quote__item">
            <span className="quote__item__inner">
              {t('line2')} <i>{t('line2Italic')}</i>
            </span>
          </div>
          <div className="quote__item">
            <span className="quote__item__inner">
              <i>{t('line3Italic')}</i>
              {t('line3')}
            </span>
          </div>
          <div className="quote__item">
            <span className="quote__item__inner">
              <i>{t('line4Italic')}</i>
            </span>
          </div>

          <div className="quote__vertical quote__vertical--1"></div>
          <div className="quote__vertical quote__vertical--2"></div>

          <div className="quote__cover quote__cover--top">
            <div></div>
          </div>
          <div className="quote__cover quote__cover--bot"></div>

          <div className="quote__horizontal"></div>
        </div>
      </div>
    </section>
  );
}
