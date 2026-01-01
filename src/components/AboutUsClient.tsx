'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Atropos from 'atropos/react';
import 'atropos/css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamInfo {
  years_experience: number;
  projects_count: number;
  countries_count: number;
  image_url: string;
}

interface AboutUsClientProps {
  teamInfo: TeamInfo;
}

const values = [
  { key: 'value1', icon: 'mdi:star' },
  { key: 'value2', icon: 'mdi:lightbulb' },
  { key: 'value3', icon: 'mdi:leaf' },
  { key: 'value4', icon: 'mdi:account-group' },
];

function ValueCard({
  title,
  description,
  icon,
  index
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
        y: 50,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.1,
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
    <div className="values-grid__item" ref={cardRef}>
      <div className="value-card">
        <div className="value-card__icon">
          <Icon icon={icon} width={40} height={40} />
        </div>
        <h3 className="value-card__title">{title}</h3>
        <p className="value-card__desc">{description}</p>
      </div>
    </div>
  );
}

function StatItem({
  value,
  label,
  index
}: {
  value: number;
  label: string;
  index: number;
}) {
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(statRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.15,
        scrollTrigger: {
          trigger: statRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, statRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div className="stats-grid__item" ref={statRef}>
      <div className="stat-item">
        <span className="stat-item__value">{value}+</span>
        <span className="stat-item__label">{label}</span>
      </div>
    </div>
  );
}

export function AboutUsClient({ teamInfo }: AboutUsClientProps) {
  const t = useTranslations('aboutUs');
  const storyRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!storyRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-story__content p', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.about-story',
          start: 'top 70%',
        },
      });
    }, storyRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!imageRef.current) return;

    const ctx = gsap.context(() => {
      const img = imageRef.current?.querySelector('img');
      if (img) {
        gsap.from(img, {
          rotate: 15,
          y: 100,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
          },
        });
      }
    }, imageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="section about-section about-story" ref={storyRef}>
        <div className="container">
          <div className="about-story__grid">
            <div className="about-story__content">
              <h2 className="section-title">{t('ourStory')}</h2>
              <p>{t('storyP1')}</p>
              <p>{t('storyP2')}</p>
              <p>{t('storyP3')}</p>
            </div>
            <div className="about-story__image" ref={imageRef}>
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
                  src={teamInfo.image_url}
                  alt="NKEY Architects Team"
                  width={600}
                  height={800}
                  style={{ width: '100%', height: 'auto' }}
                  data-atropos-offset="0"
                />
              </Atropos>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section about-stats">
        <div className="container">
          <h2 className="section-title">{t('stats')}</h2>
          <div className="stats-grid">
            <StatItem
              value={teamInfo.years_experience}
              label={t('yearsExperience')}
              index={0}
            />
            <StatItem
              value={teamInfo.projects_count}
              label={t('projectsCompleted')}
              index={1}
            />
            <StatItem
              value={teamInfo.countries_count}
              label={t('countriesServed')}
              index={2}
            />
          </div>
        </div>
      </section>

      <section className="section about-section about-values">
        <div className="container">
          <h2 className="section-title">{t('ourValues')}</h2>
          <div className="values-grid">
            {values.map((value, index) => (
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
    </>
  );
}
