'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useHeroAnimations() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !heroContentRef.current) return;

    const isDesk = window.innerWidth >= 1280;
    const ctx = gsap.context(() => {
      // Hero leave animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(heroContentRef.current, {
            autoAlpha: 1 - progress,
            y: -window.innerHeight / 2 * progress,
            duration: 0
          });
          if (isDesk && heroSliderRef.current) {
            gsap.to(heroSliderRef.current, {
              scale: 1 + progress * 0.5,
              duration: 0
            });
          }
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return { heroRef, heroContentRef, heroSliderRef };
}

export function useGalleryAnimations() {
  useEffect(() => {
    const galleries = document.querySelectorAll('.home-gallery');
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const ctx = gsap.context(() => {
      galleries.forEach((gallery) => {
        const images = gallery.querySelectorAll('img');

        // Enter animation
        ScrollTrigger.create({
          trigger: gallery,
          start: 'top 70%',
          end: 'center center',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            images.forEach((img) => {
              gsap.to(img, {
                rotate: -15 * (1 - progress),
                y: 5 * rem - 5 * rem * progress,
                opacity: progress,
                duration: 0
              });
            });
          }
        });

        // Leave animation
        ScrollTrigger.create({
          trigger: gallery,
          start: 'center center',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            images.forEach((img) => {
              gsap.to(img, {
                rotate: 15 * progress,
                y: -10 * rem * progress,
                opacity: 1 - progress,
                duration: 0
              });
            });
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);
}

export function useQuoteAnimations() {
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

      ScrollTrigger.create({
        trigger: quoteRef.current,
        start: 'top 50%',
        end: 'center center',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          oddItems?.forEach((elem, i) => {
            gsap.to(elem, {
              x: (1 - progress) * (i + 1) * (isDesk ? 100 : window.innerWidth * 0.5),
              duration: 0
            });
          });

          evenItems?.forEach((elem, i) => {
            gsap.to(elem, {
              x: (1 - progress) * (i + 1) * (isDesk ? -100 : -window.innerWidth * 0.5),
              duration: 0
            });
          });

          if (vertical1) {
            gsap.to(vertical1, { y: -5 * rem * progress, duration: 0 });
          }
          if (vertical2) {
            gsap.to(vertical2, { y: -10 * rem * progress, duration: 0 });
          }
        }
      });
    }, quoteRef);

    return () => ctx.revert();
  }, []);

  return { quoteRef };
}

export function useFormTitleAnimations() {
  useEffect(() => {
    const forms = document.querySelectorAll('.form');
    const isDesk = window.innerWidth >= 1280;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const titleMoveLength = isDesk ? 15 * rem : window.innerWidth / 2;

    const ctx = gsap.context(() => {
      forms.forEach((form) => {
        const titleItems = form.querySelectorAll('.title__item');

        ScrollTrigger.create({
          trigger: form,
          start: 'top 70%',
          end: 'center center',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            titleItems.forEach((title, index) => {
              const direction = index % 2 ? 1 : -1;
              gsap.to(title, {
                x: (1 - progress) * titleMoveLength * direction,
                duration: 0
              });
            });
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);
}

export function useWorkStagesAnimations() {
  useEffect(() => {
    const isDesk = window.innerWidth >= 1280;
    if (!isDesk) return;

    const workStages = document.querySelector('.work-stages');
    const stageItems = document.querySelectorAll('.work-stages__item');
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const ctx = gsap.context(() => {
      stageItems.forEach((stage, index) => {
        if (index < 2) {
          ScrollTrigger.create({
            trigger: workStages,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true,
            onUpdate: (self) => {
              gsap.to(stage, {
                y: 15 * rem - self.progress * 15 * rem,
                duration: 0
              });
            }
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);
}

export function useHeaderScroll() {
  useEffect(() => {
    const header = document.querySelector('.header');
    const heroTrack = document.querySelector('.hero__track');
    const heroHeight = heroTrack ? heroTrack.getBoundingClientRect().height - window.innerHeight : 0;

    const handleScroll = () => {
      if (window.scrollY > heroHeight) {
        header?.classList.add('header--scrolled');
      } else {
        header?.classList.remove('header--scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
