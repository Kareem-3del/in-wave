'use client';

import { useTranslations } from 'next-intl';

export default function MapSection() {
  const t = useTranslations('map');

  return (
    <section className="section section-map">
      <span className="quote__item__inner">{t('title')}</span>
      <svg width="100%" height="auto" viewBox="0 0 3553 2110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '1200px', margin: '0 auto', display: 'block' }}>
        {/* Simplified world map representation */}
        <rect x="100" y="200" width="600" height="400" fill="#515151" opacity="0.3" rx="20"/>
        <rect x="800" y="150" width="800" height="500" fill="#515151" opacity="0.3" rx="20"/>
        <rect x="1700" y="200" width="700" height="400" fill="#515151" opacity="0.3" rx="20"/>
        <rect x="2500" y="300" width="400" height="300" fill="#515151" opacity="0.3" rx="20"/>
        <rect x="900" y="700" width="500" height="600" fill="#515151" opacity="0.3" rx="20"/>
        <rect x="2400" y="800" width="600" height="600" fill="#515151" opacity="0.3" rx="20"/>

        {/* Location markers */}
        <circle cx="600" cy="400" r="15" fill="#E5CCA8"/>
        <circle cx="1200" cy="350" r="15" fill="#E5CCA8"/>
        <circle cx="1900" cy="400" r="15" fill="#E5CCA8"/>
        <circle cx="2100" cy="450" r="15" fill="#E5CCA8"/>
        <circle cx="1100" cy="900" r="15" fill="#E5CCA8"/>
        <circle cx="2700" cy="1000" r="15" fill="#E5CCA8"/>

        <text x="1776" y="1900" fill="#A5A5A5" fontSize="40" textAnchor="middle" fontFamily="'Tussilago El'">
          {t('stats')}
        </text>
      </svg>
    </section>
  );
}
