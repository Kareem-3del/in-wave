'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  type: number;
  images: string[];
  title_italic: string;
  title_regular: string;
  location: string;
  year: string;
  href: string;
  show_marquee: boolean;
  title_italic_en?: string | null;
  title_italic_ar?: string | null;
  title_regular_en?: string | null;
  title_regular_ar?: string | null;
  location_en?: string | null;
  location_ar?: string | null;
}

interface PortfolioClientProps {
  projects: Project[];
}

function getLocalizedValue(item: Project, field: 'title_italic' | 'title_regular' | 'location', locale: Locale): string {
  const localizedKey = `${field}_${locale}` as keyof Project;
  const fallbackKey = `${field}_en` as keyof Project;
  const legacyKey = field as keyof Project;

  return (item[localizedKey] as string) || (item[fallbackKey] as string) || (item[legacyKey] as string) || '';
}

function ProjectCard({ project, locale, index }: { project: Project; locale: Locale; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const titleItalic = getLocalizedValue(project, 'title_italic', locale);
  const titleRegular = getLocalizedValue(project, 'title_regular', locale);
  const location = getLocalizedValue(project, 'location', locale);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <Link href={project.href} className="article-cont__item" ref={cardRef}>
      <div className="article-cont__item--media">
        {project.images[0] && (
          <Image
            src={project.images[0]}
            alt={`${titleItalic} ${titleRegular}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="article-cont__item--info">
        <h3 className="article-cont__item--title">
          <span className="title-italic">_{titleItalic}_</span> {titleRegular}
        </h3>
        <p className="article-cont__item--meta">
          {location} / {project.year}
        </p>
      </div>
    </Link>
  );
}

export function PortfolioClient({ projects }: PortfolioClientProps) {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<string>('all');
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    { key: 'all', label: t('filterAll') },
    { key: 'villas', label: t('filterVillas') },
    { key: 'apartments', label: t('filterApartments') },
    { key: 'commercial', label: t('filterCommercial') },
    { key: 'offices', label: t('filterOffices') },
    { key: 'hotels', label: t('filterHotels') },
    { key: 'houses', label: t('filterHouses') },
  ];

  const getProjectCategory = (type: number): string => {
    switch (type) {
      case 1: return 'villas';
      case 2: return 'commercial';
      case 3: return 'apartments';
      case 4: return 'offices';
      case 5: return 'hotels';
      case 6: return 'houses';
      default: return 'villas';
    }
  };

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((project) => getProjectCategory(project.type) === filter);

  useEffect(() => {
    if (!gridRef.current) return;

    // Re-animate items when filter changes
    const items = gridRef.current.querySelectorAll('.article-cont__item');
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }
    );
  }, [filter]);

  return (
    <section className="section portfolio-archive-section">
      <div className="container">
        <div className="portfolio-filters">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`portfolio-filter-btn ${filter === cat.key ? 'active' : ''}`}
              onClick={() => setFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="article-cont" ref={gridRef}>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              index={index}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="portfolio-empty">
            <p>{t('noProjects')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
