'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function CareersHero() {
  const t = useTranslations('careers');
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate decorative lines
      tl.from('.careers-hero__line', {
        scaleX: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
      });

      // Animate title words
      tl.from('.careers-hero__word', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      }, '-=0.5');

      // Animate subtitle
      tl.from('.careers-hero__subtitle', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3');

      // Animate description
      tl.from('.careers-hero__desc', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.2');

      // Animate scroll indicator
      tl.from('.careers-hero__scroll', {
        y: 20,
        opacity: 0,
        duration: 0.5,
      }, '-=0.1');

      // Floating animation for decorative elements
      gsap.to('.careers-hero__float', {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5,
      });

      // Parallax effect on scroll
      gsap.to('.careers-hero__bg', {
        y: 150,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section careers-hero-section" ref={heroRef}>
      {/* Background elements */}
      <div className="careers-hero__bg">
        <div className="careers-hero__gradient"></div>
        <div className="careers-hero__grid"></div>
      </div>

      {/* Decorative floating elements */}
      <div className="careers-hero__decor" ref={decorRef}>
        <div className="careers-hero__float careers-hero__float--1"></div>
        <div className="careers-hero__float careers-hero__float--2"></div>
        <div className="careers-hero__float careers-hero__float--3"></div>
      </div>

      <div className="container">
        <div className="careers-hero">
          {/* Decorative lines */}
          <div className="careers-hero__lines">
            <span className="careers-hero__line"></span>
            <span className="careers-hero__line"></span>
          </div>

          {/* Main title */}
          <h1 className="careers-hero__title" ref={titleRef}>
            <span className="careers-hero__word careers-hero__word--italic">
              {t('heroTitleItalic')}
            </span>
            <span className="careers-hero__word">
              {t('heroTitle')}
            </span>
            <span className="careers-hero__subtitle">
              {t('heroSubtitle')}
            </span>
          </h1>

          {/* Description */}
          <p className="careers-hero__desc" ref={descRef}>
            {t('heroDescription')}
          </p>

          {/* Scroll indicator */}
          <div className="careers-hero__scroll">
            <span className="careers-hero__scroll-text">Scroll</span>
            <div className="careers-hero__scroll-line">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
