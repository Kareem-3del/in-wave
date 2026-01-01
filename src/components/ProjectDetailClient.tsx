'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Atropos from 'atropos/react';
import 'atropos/css';
import type { Locale, Project } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectDetailClientProps {
  project: Project;
  relatedProjects: Project[];
}

function getLocalizedValue(item: Project, field: 'title_italic' | 'title_regular' | 'location', locale: Locale): string {
  const localizedKey = `${field}_${locale}` as keyof Project;
  const fallbackKey = `${field}_en` as keyof Project;
  const legacyKey = field as keyof Project;

  return (item[localizedKey] as string) || (item[fallbackKey] as string) || (item[legacyKey] as string) || '';
}

function RelatedProjectCard({ project, locale, index }: { project: Project; locale: Locale; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleItalic = getLocalizedValue(project, 'title_italic', locale);
  const titleRegular = getLocalizedValue(project, 'title_regular', locale);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.15,
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
    <div className="related-projects__item" ref={cardRef}>
      <Link href={project.href} className="related-project-card">
        <div className="related-project-card__image">
          {project.images[0] && (
            <Image
              src={project.images[0]}
              alt={`${titleItalic} ${titleRegular}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
        <h3 className="related-project-card__title">
          <i>{titleItalic}</i> {titleRegular}
        </h3>
      </Link>
    </div>
  );
}

export function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
  const t = useTranslations('projectDetail');
  const locale = useLocale() as Locale;
  const [activeImage, setActiveImage] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  const titleItalic = getLocalizedValue(project, 'title_italic', locale);
  const titleRegular = getLocalizedValue(project, 'title_regular', locale);
  const location = getLocalizedValue(project, 'location', locale);

  const projectTypeLabel = () => {
    switch (project.type) {
      case 1: return t('residential');
      case 2: return t('commercial');
      case 3: return t('interior');
      default: return t('residential');
    }
  };

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.project-hero__title span', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      });

      gsap.from('.project-hero__image', {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
      });

      gsap.from('.project-info__item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!galleryRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.project-gallery__item', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.project-gallery',
          start: 'top 70%',
        },
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="section project-hero-section" ref={heroRef}>
        <div className="container">
          <Link href="/portfolio" className="project-hero__back">
            <svg viewBox="0 0 80 10" xmlns="http://www.w3.org/2000/svg" width="30" style={{ transform: 'rotate(180deg)' }}>
              <path d="M0 5H78M78 5L73 0M78 5L73 10" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
            {t('backToPortfolio')}
          </Link>

          <h1 className="project-hero__title">
            <span className="title">
              <span className="title__item">
                <span><i>{titleItalic}</i> {titleRegular}</span>
              </span>
            </span>
          </h1>

          <div className="project-hero__image">
            <Atropos
              activeOffset={30}
              shadowScale={1.05}
              shadow={true}
              highlight={true}
              rotateXMax={5}
              rotateYMax={5}
              rotateTouch="scroll-y"
            >
              {project.images[activeImage] && (
                <Image
                  src={project.images[activeImage]}
                  alt={`${titleItalic} ${titleRegular}`}
                  width={1200}
                  height={800}
                  style={{ width: '100%', height: 'auto' }}
                  priority
                  data-atropos-offset="0"
                />
              )}
            </Atropos>
          </div>

          <div className="project-info">
            <div className="project-info__item">
              <span className="project-info__label">{t('location')}</span>
              <span className="project-info__value">{location}</span>
            </div>
            <div className="project-info__item">
              <span className="project-info__label">{t('year')}</span>
              <span className="project-info__value">{project.year}</span>
            </div>
            <div className="project-info__item">
              <span className="project-info__label">{t('type')}</span>
              <span className="project-info__value">{projectTypeLabel()}</span>
            </div>
          </div>
        </div>
      </section>

      {project.images.length > 1 && (
        <section className="section project-gallery-section" ref={galleryRef}>
          <div className="container">
            <h2 className="section-title">{t('projectGallery')}</h2>
            <div className="project-gallery">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className={`project-gallery__item ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${titleItalic} ${titleRegular} - ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="section related-projects-section">
          <div className="container">
            <h2 className="section-title">{t('relatedProjects')}</h2>
            <div className="related-projects">
              {relatedProjects.map((relProject, index) => (
                <RelatedProjectCard
                  key={relProject.id}
                  project={relProject}
                  locale={locale}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
