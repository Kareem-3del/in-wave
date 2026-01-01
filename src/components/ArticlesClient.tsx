'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

interface ArticlesClientProps {
  articles: Article[];
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('articles');

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
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div className="articles-grid__item" ref={cardRef}>
      <Link href={`/articles/${article.slug}`} className="article-card">
        <div className="article-card__image">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          <span className="article-card__category">{article.category}</span>
        </div>
        <div className="article-card__content">
          <span className="article-card__date">{article.date}</span>
          <h3 className="article-card__title">{article.title}</h3>
          <p className="article-card__excerpt">{article.excerpt}</p>
          <span className="article-card__link">
            {t('readMore')}
            <svg viewBox="0 0 80 10" xmlns="http://www.w3.org/2000/svg" width="30">
              <path d="M0 5H78M78 5L73 0M78 5L73 10" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </span>
        </div>
      </Link>
    </div>
  );
}

export function ArticlesClient({ articles }: ArticlesClientProps) {
  const t = useTranslations('articles');
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { key: 'all', label: t('allPosts') },
    { key: 'architecture', label: t('architecture') },
    { key: 'interiorDesign', label: t('interiorDesign') },
    { key: 'trends', label: t('trends') },
    { key: 'behindTheScenes', label: t('behindTheScenes') },
  ];

  const filteredArticles = filter === 'all'
    ? articles
    : articles.filter((article) => article.category === filter);

  return (
    <section className="section articles-section">
      <div className="container">
        <div className="articles-filters">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`articles-filter ${filter === cat.key ? 'active' : ''}`}
              onClick={() => setFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="articles-grid">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="articles-empty">
            <p>{t('noArticles')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
