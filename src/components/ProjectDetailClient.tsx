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

function getLocalizedValue(item: Project, field: string, locale: Locale): string {
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  // Get localized content
  const titleItalic = getLocalizedValue(project, 'title_italic', locale);
  const titleRegular = getLocalizedValue(project, 'title_regular', locale);
  const location = getLocalizedValue(project, 'location', locale);
  const category = getLocalizedValue(project, 'category', locale);
  const client = getLocalizedValue(project, 'client', locale);
  const scope = getLocalizedValue(project, 'scope', locale);
  const description = getLocalizedValue(project, 'description', locale);
  const challenge = getLocalizedValue(project, 'challenge', locale);
  const solution = getLocalizedValue(project, 'solution', locale);

  // Combine gallery images with main images for the detail page
  const allGalleryImages = project.gallery_images?.length > 0
    ? project.gallery_images
    : project.images;

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

      gsap.from('.project-meta__item', {
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
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.project-content__section', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.project-content',
          start: 'top 70%',
        },
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!galleryRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.project-gallery__item', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.project-gallery',
          start: 'top 70%',
        },
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % allGalleryImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section project-hero-section" ref={heroRef}>
        <div className="container">
          <Link href="/portfolio" className="project-hero__back">
            <svg viewBox="0 0 80 10" xmlns="http://www.w3.org/2000/svg" width="30" style={{ transform: 'rotate(180deg)' }}>
              <path d="M0 5H78M78 5L73 0M78 5L73 10" stroke="currentColor" strokeWidth="1" fill="none" />
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

          {/* Project Meta Info */}
          <div className="project-meta">
            <div className="project-meta__item">
              <span className="project-meta__label">{t('location')}</span>
              <span className="project-meta__value">{location}</span>
            </div>
            <div className="project-meta__item">
              <span className="project-meta__label">{t('year')}</span>
              <span className="project-meta__value">{project.year}</span>
            </div>
            {category && (
              <div className="project-meta__item">
                <span className="project-meta__label">{t('type')}</span>
                <span className="project-meta__value">{category}</span>
              </div>
            )}
            {client && (
              <div className="project-meta__item">
                <span className="project-meta__label">{t('client') || 'Client'}</span>
                <span className="project-meta__value">{client}</span>
              </div>
            )}
            {project.area && (
              <div className="project-meta__item">
                <span className="project-meta__label">{t('area') || 'Area'}</span>
                <span className="project-meta__value">{project.area}</span>
              </div>
            )}
            {scope && (
              <div className="project-meta__item project-meta__item--full">
                <span className="project-meta__label">{t('scope') || 'Scope'}</span>
                <span className="project-meta__value">{scope}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Content Section */}
      {(description || challenge || solution) && (
        <section className="section project-content-section" ref={contentRef}>
          <div className="container">
            <div className="project-content">
              {description && (
                <div className="project-content__section project-content__description">
                  <h2 className="project-content__title">{t('aboutProject') || 'About the Project'}</h2>
                  <div className="project-content__text">
                    {description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {(challenge || solution) && (
                <div className="project-content__grid">
                  {challenge && (
                    <div className="project-content__section project-content__challenge">
                      <h3 className="project-content__subtitle">
                        <span className="project-content__icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                          </svg>
                        </span>
                        {t('theChallenge') || 'The Challenge'}
                      </h3>
                      <div className="project-content__text">
                        {challenge.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {solution && (
                    <div className="project-content__section project-content__solution">
                      <h3 className="project-content__subtitle">
                        <span className="project-content__icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </span>
                        {t('ourSolution') || 'Our Solution'}
                      </h3>
                      <div className="project-content__text">
                        {solution.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Project Gallery Section */}
      {allGalleryImages.length > 0 && (
        <section
          className="section project-gallery-section"
        // ref={galleryRef}
        >
          <div className="container">
            <h2 className="section-title">{t('projectGallery')}</h2>
            <div className="project-gallery">
              {allGalleryImages.map((image, index) => (
                <div
                  key={index}
                  className="project-gallery__item"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image}
                    alt={`${titleItalic} ${titleRegular} - ${index + 1}`}
                    fill

                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* <div className="project-gallery__overlay">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <path d="M11 8v6M8 11h6"/>
                    </svg>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects Section */}
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="project-lightbox" onClick={closeLightbox}>
          <button className="project-lightbox__close" onClick={closeLightbox}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            className="project-lightbox__nav project-lightbox__prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="project-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <Image
              src={allGalleryImages[lightboxIndex]}
              alt={`${titleItalic} ${titleRegular} - ${lightboxIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <button
            className="project-lightbox__nav project-lightbox__next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="project-lightbox__counter">
            {lightboxIndex + 1} / {allGalleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}
