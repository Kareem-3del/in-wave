'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Philosophy cards data
const philosophyCards = [
  { key: 'philosophy1', icon: 'mdi:vector-square' },
  { key: 'philosophy2', icon: 'mdi:account-heart-outline' },
  { key: 'philosophy3', icon: 'mdi:diamond-stone' },
];

// Timeline milestones data
const milestones = [
  { key: 'journey1', year: '2016' },
  { key: 'journey2', year: '2018' },
  { key: 'journey3', year: '2021' },
  { key: 'journey4', year: '2024' },
];

// Core values data
const coreValues = [
  { key: 'value1', icon: 'mdi:star-shooting' },
  { key: 'value2', icon: 'mdi:lightbulb-on-outline' },
  { key: 'value3', icon: 'mdi:leaf' },
  { key: 'value4', icon: 'mdi:account-group-outline' },
];

// Stats data
const stats = [
  { value: '8', suffix: '+', labelKey: 'yearsExperience' },
  { value: '90', suffix: '+', labelKey: 'projectsCompleted' },
  { value: '10', suffix: '+', labelKey: 'countriesServed' },
];

// Floating shapes component
function FloatingShapes() {
  return (
    <div className="about-floating-shapes">
      <div className="about-floating-shape about-floating-shape--1"></div>
      <div className="about-floating-shape about-floating-shape--2"></div>
      <div className="about-floating-shape about-floating-shape--3"></div>
    </div>
  );
}

// Hero Section Component
function AboutHero() {
  const t = useTranslations('aboutUs');
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const diagonalsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Initial load timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Diagonal lines sweep in
      diagonalsRef.current.forEach((diag, i) => {
        if (diag) {
          gsap.set(diag, { scaleY: 0 });
          tl.to(diag, {
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out',
          }, i * 0.1);
        }
      });

      // Title words cascade with blur-to-focus
      titleWordsRef.current.forEach((word, i) => {
        if (word) {
          gsap.set(word, { y: 120, opacity: 0, filter: 'blur(20px)' });
          tl.to(word, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
          }, 0.3 + i * 0.12);
        }
      });

      // Description and scroll indicator
      tl.from('.about-hero__desc', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.4');

      tl.from('.about-hero__scroll', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
      }, '-=0.2');

      // Scroll-triggered parallax exit
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (contentRef.current) {
            gsap.to(contentRef.current, {
              y: -progress * 150,
              opacity: 1 - progress * 1.5,
              duration: 0.1,
            });
          }
          diagonalsRef.current.forEach((diag, i) => {
            if (diag) {
              gsap.to(diag, {
                y: progress * (i + 1) * 50,
                opacity: 1 - progress,
                duration: 0.1,
              });
            }
          });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-hero-section" ref={heroRef}>
      <div className="about-hero__bg">
        <div className="about-hero__gradient"></div>
        <div className="about-hero__noise"></div>
      </div>

      <div
        className="about-hero__diagonal about-hero__diagonal--1"
        ref={(el) => { diagonalsRef.current[0] = el; }}
      ></div>
      <div
        className="about-hero__diagonal about-hero__diagonal--2"
        ref={(el) => { diagonalsRef.current[1] = el; }}
      ></div>
      <div
        className="about-hero__diagonal about-hero__diagonal--3"
        ref={(el) => { diagonalsRef.current[2] = el; }}
      ></div>

      <div className="container">
        <div className="about-hero__content" ref={contentRef}>
          <span className="about-hero__label">{t('welcomeLabel')}</span>
          <h1 className="about-hero__title">
            <span
              className="about-hero__word about-hero__word--italic"
              ref={(el) => { titleWordsRef.current[0] = el; }}
            >
              {t('heroTitleItalic')}
            </span>
            <span
              className="about-hero__word"
              ref={(el) => { titleWordsRef.current[1] = el; }}
            >
              {t('heroTitle')}
            </span>
          </h1>
          <p className="about-hero__desc">{t('heroDescription')}</p>

          <div className="about-hero__scroll">
            <span>{t('scrollDown')}</span>
            <div className="about-hero__scroll-line">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Vision Quote Component with Kinetic Typography
function VisionQuote() {
  const t = useTranslations('aboutUs');
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isDesk = window.innerWidth >= 1024;

      // Set initial positions
      wordsRef.current.forEach((word, i) => {
        if (word) {
          const direction = i % 2 === 0 ? 1 : -1;
          const distance = isDesk ? 15 * rem : 10 * rem;
          gsap.set(word, { x: direction * distance, opacity: 0 });
        }
      });

      // Animate on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'center center',
        scrub: 1,
        onUpdate: (self) => {
          wordsRef.current.forEach((word, i) => {
            if (word) {
              const direction = i % 2 === 0 ? 1 : -1;
              const distance = isDesk ? 15 * rem : 10 * rem;
              gsap.to(word, {
                x: (1 - self.progress) * direction * distance,
                opacity: self.progress,
                duration: 0.1,
              });
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-vision-section" ref={sectionRef}>
      <div className="container">
        <div className="about-vision__quote">
          <span
            className="about-vision__word about-vision__word--italic"
            ref={(el) => { wordsRef.current[0] = el; }}
          >
            {t('visionQuote1')}
          </span>
          <span
            className="about-vision__word"
            ref={(el) => { wordsRef.current[1] = el; }}
          >
            {t('visionQuote2')}
          </span>
          <span
            className="about-vision__word about-vision__word--italic"
            ref={(el) => { wordsRef.current[2] = el; }}
          >
            {t('visionQuote3')}
          </span>
        </div>
      </div>
    </section>
  );
}

// Story Section with Scroll Storytelling
function StorySection() {
  const t = useTranslations('aboutUs');
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      paragraphsRef.current.forEach((p) => {
        if (p) {
          gsap.set(p, { y: 60, opacity: 0 });
        }
      });

      // Staggered reveal on scroll
      paragraphsRef.current.forEach((p, i) => {
        if (p) {
          ScrollTrigger.create({
            trigger: p,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
            onUpdate: (self) => {
              gsap.to(p, {
                y: 60 * (1 - self.progress),
                opacity: self.progress,
                duration: 0.1,
              });
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-story-section" ref={sectionRef}>
      <div className="container">
        <div className="about-story__header">
          <span className="about-story__label">{t('ourStoryLabel')}</span>
          <h2 className="about-story__title">{t('ourStory')}</h2>
        </div>
        <div className="about-story__content">
          <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[0] = el; }}
          >
            {t('storyP1')}
          </p>
          <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[1] = el; }}
          >
            {t('storyP2')}
          </p>
          {/* <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[2] = el; }}
          >
            {t('storyP3')}
          </p> */}
        </div>
      </div>
      <FloatingShapes />
    </section>
  );
}

function MessionSection() {
  const t = useTranslations('aboutUs');
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      paragraphsRef.current.forEach((p) => {
        if (p) {
          gsap.set(p, { y: 60, opacity: 0 });
        }
      });

      // Staggered reveal on scroll
      paragraphsRef.current.forEach((p, i) => {
        if (p) {
          ScrollTrigger.create({
            trigger: p,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
            onUpdate: (self) => {
              gsap.to(p, {
                y: 60 * (1 - self.progress),
                opacity: self.progress,
                duration: 0.1,
              });
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-story-section" ref={sectionRef}>
      <div className="container">
        <div className="about-story__header">
          <span className="about-story__label">{t('ourMissionLabel')}</span>
        </div>
        <div className="about-story__content">
          <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[0] = el; }}
          >
            {t('missionP1')}
          </p>
          <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[1] = el; }}
          >
            {t('missionP2')}
          </p>
          {/* <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[2] = el; }}
          >
            {t('storyP3')}
          </p> */}
        </div>
      </div>
      <FloatingShapes />
    </section>
  );
}

function VisionSection() {
  const t = useTranslations('aboutUs');
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      paragraphsRef.current.forEach((p) => {
        if (p) {
          gsap.set(p, { y: 60, opacity: 0 });
        }
      });

      // Staggered reveal on scroll
      paragraphsRef.current.forEach((p, i) => {
        if (p) {
          ScrollTrigger.create({
            trigger: p,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
            onUpdate: (self) => {
              gsap.to(p, {
                y: 60 * (1 - self.progress),
                opacity: self.progress,
                duration: 0.1,
              });
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-story-section" ref={sectionRef}>
      <div className="container">
        <div className="about-story__header">
          <span className="about-story__label">{t('ourVisionLabel')}</span>
        </div>
        <div className="about-story__content">
          <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[0] = el; }}
          >
            {t('visionP1')}
          </p>
          <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[1] = el; }}
          >
            {t('visionP2')}
          </p>
          {/* <p
            className="about-story__paragraph"
            ref={(el) => { paragraphsRef.current[2] = el; }}
          >
            {t('storyP3')}
          </p> */}
        </div>
      </div>
      <FloatingShapes />
    </section>
  );
}


// Animated Counter Component
function AnimatedCounter({
  value,
  suffix,
  label,
  index
}: {
  value: string;
  suffix: string;
  label: string;
  index: number;
}) {
  const counterRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!counterRef.current) return;

    const ctx = gsap.context(() => {
      const numericValue = parseInt(value);

      gsap.from(counterRef.current, {
        y: 80,
        opacity: 0,
        duration: 0.9,
        delay: index * 0.15,
        scrollTrigger: {
          trigger: counterRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          onEnter: () => {
            gsap.to({ val: 0 }, {
              val: numericValue,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: function () {
                setDisplayValue(Math.round(this.targets()[0].val).toString());
              },
            });
          },
        },
      });
    }, counterRef);

    return () => ctx.revert();
  }, [value, index]);

  return (
    <div className="about-stat" ref={counterRef}>
      <span className="about-stat__value">{displayValue}{suffix}</span>
      <span className="about-stat__label">{label}</span>
    </div>
  );
}

// Stats Section
function StatsSection() {
  const t = useTranslations('aboutUs');

  return (
    <section className="section about-stats-section">
      <div className="container">
        <div className="about-stats__header">
          <span className="about-stats__label">{t('statsLabel')}</span>
          <h2 className="about-stats__title">{t('stats')}</h2>
        </div>
        <div className="about-stats__grid">
          {stats.map((stat, index) => (
            <AnimatedCounter
              key={stat.labelKey}
              value={stat.value}
              suffix={stat.suffix}
              label={t(stat.labelKey)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Philosophy Card with 3D Tilt
function PhilosophyCard({
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
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Entry animation
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        rotateY: 15,
        duration: 0.9,
        delay: index * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
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
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

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
    <div
      className="philosophy-card-wrapper"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <div className="philosophy-card">
        <div className="philosophy-card__glow"></div>
        <div className="philosophy-card__icon" ref={iconRef}>
          <Icon icon={icon} width={40} height={40} />
        </div>
        <h3 className="philosophy-card__title">{title}</h3>
        <p className="philosophy-card__desc">{description}</p>
        <span className="philosophy-card__number">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

// Philosophy Section
function PhilosophySection() {
  const t = useTranslations('aboutUs');

  return (
    <section className="section about-philosophy-section">
      <div className="container">
        <div className="about-philosophy__header">
          <span className="about-philosophy__label">{t('philosophyLabel')}</span>
          <h2 className="about-philosophy__title">{t('ourPhilosophy')}</h2>
        </div>
        <div className="about-philosophy__grid">
          {philosophyCards.map((card, index) => (
            <PhilosophyCard
              key={card.key}
              title={t(`${card.key}Title`)}
              description={t(`${card.key}Desc`)}
              icon={card.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Timeline Item Component
function TimelineItem({
  title,
  description,
  year,
  index,
}: {
  title: string;
  description: string;
  year: string;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    const ctx = gsap.context(() => {
      const direction = index % 2 === 0 ? -100 : 100;

      gsap.from(itemRef.current, {
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div className={`timeline-item timeline-item--${index % 2 === 0 ? 'left' : 'right'}`} ref={itemRef}>
      <div className="timeline-item__dot"></div>
      <div className="timeline-item__content">
        <span className="timeline-item__year">{year}</span>
        <h3 className="timeline-item__title">{title}</h3>
        <p className="timeline-item__desc">{description}</p>
      </div>
    </div>
  );
}

// Timeline Section
function TimelineSection() {
  const t = useTranslations('aboutUs');
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleY: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(lineRef.current, {
            scaleY: self.progress,
            duration: 0.1,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-timeline-section" ref={sectionRef}>
      <div className="container">
        <div className="about-timeline__header">
          <span className="about-timeline__label">{t('journeyLabel')}</span>
          <h2 className="about-timeline__title">{t('ourJourney')}</h2>
        </div>
        <div className="about-timeline">
          <div className="about-timeline__line">
            <div className="about-timeline__line-fill" ref={lineRef}></div>
          </div>
          <div className="about-timeline__items">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.key}
                title={t(`${milestone.key}Title`)}
                description={t(`${milestone.key}Desc`)}
                year={milestone.year}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Value Card Component
function ValueCard({
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
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div className="value-card" ref={cardRef}>
      <div className="value-card__icon">
        <Icon icon={icon} width={32} height={32} />
      </div>
      <h3 className="value-card__title">{title}</h3>
      <p className="value-card__desc">{description}</p>
    </div>
  );
}

// Values Section
function ValuesSection() {
  const t = useTranslations('aboutUs');

  return (
    <section className="section about-values-section">
      <div className="container">
        <div className="about-values__header">
          <span className="about-values__label">{t('valuesLabel')}</span>
          <h2 className="about-values__title">{t('ourValues')}</h2>
        </div>
        <div className="about-values__grid">
          {coreValues.map((value, index) => (
            <ValueCard
              key={value.key}
              title={t(`${value.key}Title`)}
              description={t(`${value.key}Desc`)}
              icon={value.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const t = useTranslations('aboutUs');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
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

      // Floating shapes parallax
      gsap.to('.about-cta .about-floating-shape', {
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
    <section className="section about-cta-section about-cta" ref={sectionRef}>
      <div className="container">
        <div className="about-cta__content">
          <h2 className="about-cta__title" ref={titleRef}>
            {t('ctaTitle1')} <span>{t('ctaTitle2')}</span>
          </h2>
          <p className="about-cta__desc">{t('ctaDesc')}</p>
          <Link
            style={{
              marginBottom: "4rem"
            }}
            href="/contacts"
            className="btn btn--default about-cta__btn"
          >
            <span>{t('ctaButton')}</span>
          </Link>
          <p
            style={{
              marginTop: "4rem",
              paddingTop: "3rem"
            }}
            className="about-cta__desc">
            {t('storyP3')}
          </p>
        </div>
      </div>
      <FloatingShapes />
    </section>
  );
}

// Main AboutUsClient Component
export function AboutUsClient() {
  return (
    <div className="about-us-page">
      <AboutHero />
      <CTASection />
      {/* <VisionQuote /> */}
      <StorySection />
      <MessionSection />
      <VisionSection />
      {/* <StatsSection />
      <PhilosophySection />
      <TimelineSection />
      <ValuesSection /> */}
    </div>
  );
}
