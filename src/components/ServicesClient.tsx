'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SimpleMarquee } from '@/components/Marquee';
import type { Service } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Fallback services data if database is empty
const fallbackServices = [
  { key: 'architecturalDesign', icon: 'mdi:home-city-outline' },
  { key: 'interiorDesign', icon: 'mdi:sofa-outline' },
  { key: 'visualization', icon: 'mdi:cube-scan' },
  { key: 'supervision', icon: 'mdi:clipboard-check-outline' },
  { key: 'consultation', icon: 'mdi:comment-question-outline' },
  { key: 'landscaping', icon: 'mdi:tree-outline' },
];

interface ServicesClientProps {
  services?: Service[];
  locale?: 'en' | 'ar';
}

// Process steps data
const processSteps = [
  { key: 'process1', number: '01', icon: 'mdi:chat-outline' },
  { key: 'process2', number: '02', icon: 'mdi:lightbulb-outline' },
  { key: 'process3', number: '03', icon: 'mdi:pencil-ruler' },
  { key: 'process4', number: '04', icon: 'mdi:hammer-wrench' },
  { key: 'process5', number: '05', icon: 'mdi:key-outline' },
];

// Floating shapes component
function FloatingShapes() {
  return (
    <div className="services-floating-shapes">
      <div className="services-floating-shape services-floating-shape--1"></div>
      <div className="services-floating-shape services-floating-shape--2"></div>
      <div className="services-floating-shape services-floating-shape--3"></div>
    </div>
  );
}

// Services Hero Component
function ServicesHero() {
  const t = useTranslations('services');
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatIconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const gridLinesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Grid lines draw in
      gridLinesRef.current.forEach((line, i) => {
        if (line) {
          gsap.set(line, { scaleX: 0 });
          tl.to(line, {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
          }, i * 0.05);
        }
      });

      // Title and description reveal
      tl.from('.services-hero__title-wrap', {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, 0.3);

      tl.from('.services-hero__desc', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5');

      // Floating service icons appear
      floatIconsRef.current.forEach((icon, i) => {
        if (icon) {
          gsap.set(icon, { scale: 0, opacity: 0 });
          tl.to(icon, {
            scale: 1,
            opacity: 0.6,
            duration: 0.6,
            ease: 'back.out(2)',
          }, 0.5 + i * 0.1);

          // Continuous float animation
          gsap.to(icon, {
            y: -15,
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          });
        }
      });

      // Scroll parallax exit
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (contentRef.current) {
            gsap.to(contentRef.current, {
              y: -progress * 100,
              opacity: 1 - progress * 1.2,
              duration: 0.1,
            });
          }
          floatIconsRef.current.forEach((icon, i) => {
            if (icon) {
              gsap.to(icon, {
                y: progress * (i + 1) * 30,
                opacity: 0.6 - progress * 0.6,
                duration: 0.1,
              });
            }
          });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Icon positions for floating icons (positioned around the hero)
  const iconPositions = [
    { top: '15%', left: '10%' },
    { top: '20%', right: '15%' },
    { top: '45%', left: '5%' },
    { top: '50%', right: '8%' },
    { bottom: '25%', left: '12%' },
    { bottom: '20%', right: '12%' },
  ];

  return (
    <section className="section services-hero-section" ref={heroRef}>
      <div className="services-hero__bg">
        <div className="services-hero__gradient"></div>
        <div className="services-hero__grid">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="services-hero__grid-line"
              ref={(el) => { gridLinesRef.current[i] = el; }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating service icons */}
      {fallbackServices.map((service, i) => (
        <div
          key={service.key}
          className="services-hero__float-icon"
          ref={(el) => { floatIconsRef.current[i] = el; }}
          style={iconPositions[i]}
        >
          <Icon icon={service.icon} width={32} height={32} />
        </div>
      ))}

      <div className="container">
        <div className="services-hero__content" ref={contentRef}>
          <div className="services-hero__title-wrap">
            <h1 className="services-hero__title">
              <span className="services-hero__title--italic">{t('heroTitleItalic')}</span>
              <span>{t('heroTitle')}</span>
            </h1>
          </div>
          <p className="services-hero__desc">{t('heroDescription')}</p>
        </div>
      </div>
    </section>
  );
}

// Service Card Component with 3D Tilt
function ServiceCard({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) {
  const t = useTranslations('services');
  const cardRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Entry animation with stagger
      gsap.from(cardRef.current, {
        y: 80,
        opacity: 0,
        rotateX: 15,
        duration: 0.9,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });

      // Floating icon animation
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          y: -8,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  // 3D tilt effect on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <Link
      href="/contacts"
      className="service-card-wrapper"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px', textDecoration: 'none' }}
    >
      <div className="service-card">
        <div className="service-card__glow"></div>
        <div className="service-card__icon" ref={iconRef}>
          <Icon icon={icon} width={48} height={48} />
        </div>
        <h3 className="service-card__title">{title}</h3>
        <p className="service-card__desc">{description}</p>
        <span className="service-card__link">
          {t('learnMore')}
          <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
            <path d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z" fill="currentColor"/>
          </svg>
        </span>
        <span className="service-card__number">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </Link>
  );
}

// Services Grid Section
function ServicesGrid({ services, locale }: { services?: Service[]; locale?: 'en' | 'ar' }) {
  const t = useTranslations('services');

  // Use database services if available, otherwise fallback to translation keys
  const displayServices = services && services.length > 0
    ? services.map((service) => ({
        id: service.id,
        title: locale === 'ar' ? (service.name_ar || service.name_en || service.name) : (service.name_en || service.name),
        description: locale === 'ar' ? (service.description_ar || service.description_en || '') : (service.description_en || ''),
        icon: service.icon || 'mdi:home-city-outline',
      }))
    : fallbackServices.map((service) => ({
        id: service.key,
        title: t(service.key),
        description: t(`${service.key}Desc`),
        icon: service.icon,
      }));

  return (
    <section className="section services-grid-section">
      <div className="container">
        <div className="services-grid__header">
          <span className="services-grid__label">{t('sectionLabel')}</span>
        </div>
        <div className="services-grid">
          {displayServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Process Step Component
function ProcessStep({
  title,
  description,
  number,
  icon,
  index,
  isLast,
}: {
  title: string;
  description: string;
  number: string;
  icon: string;
  index: number;
  isLast: boolean;
}) {
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(stepRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stepRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, stepRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div className={`process-step ${isLast ? 'process-step--last' : ''}`} ref={stepRef}>
      <div className="process-step__dot"></div>
      <div className="process-step__icon">
        <Icon icon={icon} width={24} height={24} />
      </div>
      <span className="process-step__num">{number}</span>
      <h3 className="process-step__title">{title}</h3>
      <p className="process-step__desc">{description}</p>
    </div>
  );
}

// Process Section
function ProcessSection() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      const isDesk = window.innerWidth >= 768;

      gsap.set(lineRef.current, { scaleX: isDesk ? 0 : 1, scaleY: isDesk ? 1 : 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1,
        onUpdate: (self) => {
          if (isDesk) {
            gsap.to(lineRef.current, {
              scaleX: self.progress,
              duration: 0.1,
            });
          } else {
            gsap.to(lineRef.current, {
              scaleY: self.progress,
              duration: 0.1,
            });
          }

          // Activate dots based on progress
          const dots = sectionRef.current?.querySelectorAll('.process-step__dot');
          dots?.forEach((dot, i) => {
            const stepProgress = (i + 1) / dots.length;
            if (self.progress >= stepProgress - 0.1) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section services-process-section" ref={sectionRef}>
      <div className="container">
        <div className="services-process__header">
          <span className="services-process__label">{t('processLabel')}</span>
          <h2 className="services-process__title">{t('ourProcess')}</h2>
        </div>
        <div className="services-process">
          <div className="services-process__line">
            <div className="services-process__line-fill" ref={lineRef}></div>
          </div>
          <div className="services-process__steps">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.key}
                title={t(`${step.key}Title`)}
                description={t(`${step.key}Desc`)}
                number={step.number}
                icon={step.icon}
                index={index}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Marquee Section
function MarqueeSection() {
  const t = useTranslations('services');

  return (
    <section className="section services-marquee-section">
      <SimpleMarquee text="architecture / interior / design / visualization / " />
    </section>
  );
}

// CTA Section
function CTASection() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      gsap.to('.services-cta .services-floating-shape', {
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section services-cta-section services-cta" ref={sectionRef}>
      <div className="container">
        <div className="services-cta__content">
          <h2 className="services-cta__title" ref={titleRef}>
            {t('ctaTitle1')} <span>{t('ctaTitle2')}</span>
          </h2>
          <p className="services-cta__desc">{t('ctaDesc')}</p>
          <Link href="/contacts" className="btn btn--default services-cta__btn">
            <span>{t('ctaButton')}</span>
          </Link>
        </div>
      </div>
      <FloatingShapes />
    </section>
  );
}

// Main ServicesClient Component
export function ServicesClient({ services, locale }: ServicesClientProps) {
  return (
    <div className="services-page-content">
      <ServicesHero />
      <ServicesGrid services={services} locale={locale} />
      <ProcessSection />
      <MarqueeSection />
      <CTASection />
    </div>
  );
}
