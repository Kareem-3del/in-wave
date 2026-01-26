'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/routing';
import { UploadCvModal } from './UploadCvModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  { key: 'benefit1', icon: 'mdi:palette-outline', color: '#E5CCA8' },
  { key: 'benefit2', icon: 'mdi:rocket-launch-outline', color: '#88704E' },
  { key: 'benefit3', icon: 'mdi:earth', color: '#E5CCA8' },
  { key: 'benefit4', icon: 'mdi:account-group-outline', color: '#88704E' },
];

const journeySteps = [
  { key: 'journey1', icon: 'mdi:school-outline', number: '01' },
  { key: 'journey2', icon: 'mdi:account-supervisor-outline', number: '02' },
  { key: 'journey3', icon: 'mdi:briefcase-outline', number: '03' },
  { key: 'journey4', icon: 'mdi:trophy-outline', number: '04' },
];

// Floating geometric shapes component
function FloatingShapes() {
  return (
    <div className="floating-shapes">
      <div className="floating-shape floating-shape--1"></div>
      <div className="floating-shape floating-shape--2"></div>
      <div className="floating-shape floating-shape--3"></div>
      <div className="floating-shape floating-shape--4"></div>
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ value, label, index }: { value: string; label: string; index: number }) {
  const counterRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!counterRef.current) return;

    const ctx = gsap.context(() => {
      // Parse the numeric value
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/[0-9]/g, '');

      gsap.from(counterRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.15,
        scrollTrigger: {
          trigger: counterRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          onEnter: () => {
            // Animate counter
            gsap.to({ val: 0 }, {
              val: numericValue,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                setDisplayValue(Math.round(this.targets()[0].val) + suffix);
              }
            });
          }
        },
      });
    }, counterRef);

    return () => ctx.revert();
  }, [value, index]);

  return (
    <div className="career-stat" ref={counterRef}>
      <span className="career-stat__value">{displayValue}</span>
      <span className="career-stat__label">{label}</span>
    </div>
  );
}

// Benefit card with 3D hover effect
function BenefitCard({
  title,
  description,
  icon,
  color,
  index
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
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
      rotateX: rotateX,
      rotateY: rotateY,
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
      className="benefit-card-wrapper"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <div className="benefit-card-enhanced">
        <div className="benefit-card-enhanced__glow" style={{ background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)` }}></div>
        <div className="benefit-card-enhanced__icon" ref={iconRef}>
          <div className="benefit-card-enhanced__icon-bg" style={{ borderColor: color }}>
            <Icon icon={icon} width={36} height={36} style={{ color }} />
          </div>
        </div>
        <h3 className="benefit-card-enhanced__title">{title}</h3>
        <p className="benefit-card-enhanced__desc">{description}</p>
        <div className="benefit-card-enhanced__number" style={{ color: `${color}30` }}>
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

// Journey step with animated connection line
function JourneyStep({
  title,
  description,
  icon,
  number,
  index,
  isLast
}: {
  title: string;
  description: string;
  icon: string;
  number: string;
  index: number;
  isLast: boolean;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepRef.current) return;

    const ctx = gsap.context(() => {
      // Animate step entry
      gsap.from(stepRef.current, {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stepRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Animate connecting line
      if (lineRef.current && !isLast) {
        gsap.from(lineRef.current, {
          scaleY: 0,
          duration: 0.6,
          delay: index * 0.2 + 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stepRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, stepRef);

    return () => ctx.revert();
  }, [index, isLast]);

  return (
    <div className={`journey-step ${index % 2 === 0 ? 'journey-step--left' : 'journey-step--right'}`} ref={stepRef}>
      <div className="journey-step__content">
        <div className="journey-step__number">{number}</div>
        <div className="journey-step__icon">
          <Icon icon={icon} width={28} height={28} />
        </div>
        <h4 className="journey-step__title">{title}</h4>
        <p className="journey-step__desc">{description}</p>
      </div>
      {!isLast && <div className="journey-step__line" ref={lineRef}></div>}
    </div>
  );
}

// Marquee component
function CareersMarquee({ text, italicText }: { text: string; italicText: string }) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(marqueeRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: 'top 90%',
        },
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="careers-marquee" ref={marqueeRef}>
      <div className="careers-marquee__track">
        {[...Array(8)].map((_, i) => (
          <div className="careers-marquee__item" key={i}>
            <span className="careers-marquee__text">{text}</span>
            <span className="careers-marquee__italic">{italicText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CareersClient() {
  const t = useTranslations('careers');
  const locale = useLocale()
  const benefitsRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!benefitsRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.benefits-section-enhanced .section-title-enhanced', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.benefits-section-enhanced',
          start: 'top 75%',
        },
      });
    }, benefitsRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!journeyRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.journey-section .section-title-enhanced', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.journey-section',
          start: 'top 75%',
        },
      });

      gsap.from('.journey-section .section-subtitle', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: '.journey-section',
          start: 'top 75%',
        },
      });
    }, journeyRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ctaRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect for CTA background shapes
      gsap.to('.cta-section-enhanced .floating-shape', {
        y: -100,
        scrollTrigger: {
          trigger: '.cta-section-enhanced',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Animate CTA content
      gsap.from('.cta-section-enhanced .cta-content', {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.cta-section-enhanced',
          start: 'top 70%',
        },
      });
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Marquee Section */}
      <CareersMarquee text={t('marqueeText')} italicText={t('marqueeItalic')} />

      {/* <section className="section careers-section oppe-section-enhanced" ref={ctaRef}>
        <div className="container">
          <h2 className="oppe-content__title">{t('openPos')}</h2>
        </div>
      </section> */}
      <section
        style={{
          background: "linear-gradient(#0a0a0a 0%, #111 50%, #0a0a0a 100%)"
        }}
        className="section about-story-section"
      >
        <div
          className='cust-container'
        >
          <div className="about-story__header">
            <h2 className="about-story__title">{t('openPos')}</h2>
          </div>
          {/* <div className="about-story__content"> */}
          <div className="story-app-container">
            <a
              style={{ position: "static", flexShrink: 0 }}
              href="#home-form"
              className="order-a-call">
              {t('architect')}
            </a>

            <div>
              <p
                className="about-story__paragraph"
              >
                {t('openPosDesc')}
              </p>

              <p className="about-story__paragraph_sub">
                {t("shareCv")}
              </p>
            </div>

            <div
              className='get-in-touch'
              onClick={() => setOpen(true)}
            >
              <div>{t("get")}</div>
              <div>{t("in")}</div>
              <div style={{ marginBottom: "8px" }}>{t("touch")}</div>
              <svg
                style={{
                  ...(locale === "ar" && {
                    transform: "scale(-1)"
                  })
                }}
                viewBox="0 0 25 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3536 4.35356C24.5488 4.15829 24.5488 3.84171 24.3536 3.64645L21.1716 0.464468C20.9763 0.269206 20.6597 0.269206 20.4645 0.464468C20.2692 0.65973 20.2692 0.976313 20.4645 1.17157L23.2929 4L20.4645 6.82843C20.2692 7.02369 20.2692 7.34027 20.4645 7.53554C20.6597 7.7308 20.9763 7.7308 21.1716 7.53554L24.3536 4.35356ZM-4.37114e-08 4.5L24 4.5L24 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z" fill="url(#paint0_linear_1107_87)" />
                <defs>
                  <linearGradient id="paint0_linear_1107_87" x1="-8.74228e-08" y1="5" x2="0.083189" y2="3.00347" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" />
                    <stop offset="1" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        {/* </div> */}
      </section>
      {/* Benefits Section */}
      {/* <section className="section careers-section benefits-section-enhanced" ref={benefitsRef}>
        <FloatingShapes />
        <div className="container">
          <h2 className="section-title-enhanced">
            <span className="section-title-enhanced__line"></span>
            {t('whyWorkWithUs')}
          </h2>
          <div className="benefits-grid-enhanced">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.key}
                title={t(`${benefit.key}Title`)}
                description={t(`${benefit.key}Desc`)}
                icon={benefit.icon}
                color={benefit.color}
                index={index}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="section careers-section oppe-section-enhanced" ref={ctaRef}>
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-content__title">{t('sendCV')}</h2>
            <p className="cta-content__desc">{t('sendCVDesc')}</p>
            <div className="cta-content__email">
              <span className="cta-content__email-label">{t('emailUs')}</span>
              <a href="mailto:careers@in-wavearchitects.com" className="cta-content__email-link">
                <Icon icon="mdi:email-outline" width={24} height={24} />
                <span>careers@in-wavearchitects.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section careers-section stats-section-enhanced" ref={statsRef}>
        <div className="container">
          <div className="career-stats-grid">
            <AnimatedCounter value={t('stat1Value')} label={t('stat1Label')} index={0} />
            <AnimatedCounter value={t('stat2Value')} label={t('stat2Label')} index={1} />
            <AnimatedCounter value={t('stat3Value')} label={t('stat3Label')} index={2} />
          </div>
        </div>
      </section>

      <UploadCvModal open={open} onClose={() => setOpen(false)} />


      {/* Journey Section */}
      {/* <section className="section careers-section journey-section" ref={journeyRef}>
        <div className="container">
          <h2 className="section-title-enhanced">{t('journeyTitle')}</h2>
          <p className="section-subtitle">{t('journeySubtitle')}</p>
          <div className="journey-timeline">
            <div className="journey-timeline__line"></div>
            {journeySteps.map((step, index) => (
              <JourneyStep
                key={step.key}
                title={t(`${step.key}Title`)}
                description={t(`${step.key}Desc`)}
                icon={step.icon}
                number={step.number}
                index={index}
                isLast={index === journeySteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Culture Section */}
      {/* <section className="section careers-section culture-section">
        <div className="container">
          <div className="culture-content">
            <div className="culture-content__text">
              <h2 className="section-title-enhanced">{t('cultureTitle')}</h2>
              <p className="culture-content__desc">{t('cultureDesc')}</p>
            </div>
            <div className="culture-content__visual">
              <div className="culture-visual">
                <div className="culture-visual__circle culture-visual__circle--1"></div>
                <div className="culture-visual__circle culture-visual__circle--2"></div>
                <div className="culture-visual__circle culture-visual__circle--3"></div>
                <div className="culture-visual__text">IN-WAVE</div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Open Positions Section
      <section className="section careers-section positions-section-enhanced">
        <div className="container">
          <h2 className="section-title-enhanced">{t('openPositions')}</h2>
          <div className="positions-card">
            <div className="positions-card__icon">
              <Icon icon="mdi:briefcase-search-outline" width={48} height={48} />
            </div>
            <p className="positions-card__text">{t('noPositions')}</p>
            <a href="mailto:careers@in-wavearchitects.com" className="positions-card__btn">
              <span>{t('exploreMore')}</span>
              <Icon icon="mdi:arrow-right" width={20} height={20} />
            </a>
          </div>
        </div>
      </section> */}
    </>
  );
}
