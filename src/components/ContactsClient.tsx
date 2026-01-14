'use client';

import { useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale, Office } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactsClientProps {
  offices: Office[];
}

function OfficeCard({ office, locale, index }: { office: Office; locale: Locale; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const city = locale === 'ar' && office.city_ar ? office.city_ar : (office.city_en || office.city);
  const country = locale === 'ar' && office.country_ar ? office.country_ar : (office.country_en || office.country);

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
    <div className="offices-grid__item" ref={cardRef}>
      <div className="office-card">
        <h3 className="office-card__city">{city}</h3>
        <p className="office-card__country">{country}</p>
        <div className="office-card__contacts">
          <a href={office.phone_href} className="office-card__phone">
            {office.phone}
          </a>
          {office.email && (
            <a href={`mailto:${office.email}`} className="office-card__email">
              {office.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactsClient({ offices }: ContactsClientProps) {
  const t = useTranslations('contacts');
  const locale = useLocale() as Locale;
  const sectionRef = useRef<HTMLElement>(null);

  // Fallback offices if none in DB
  const fallbackOffices: Office[] = [
    {
      id: '1',
      city: 'Riyadh',
      city_en: 'Riyadh',
      city_ar: 'الرياض',
      country: 'Saudi Arabia',
      country_en: 'Saudi Arabia',
      country_ar: 'المملكة العربية السعودية',
      phone: '+966 595 594 686',
      phone_href: 'tel:+966595594686',
      email: 'Info@innowave-me.com',
      email_href: 'mailto:Info@innowave-me.com',
      display_order: 1,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
    {
      id: '2',
      city: 'Cairo',
      city_en: 'Cairo',
      city_ar: 'القاهرة',
      country: 'Egypt',
      country_en: 'Egypt',
      country_ar: 'مصر',
      phone: '+20 111 227 6768',
      phone_href: 'tel:+201112276768',
      email: null,
      email_href: null,
      display_order: 2,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
    {
      id: '3',
      city: 'Amman',
      city_en: 'Amman',
      city_ar: 'عمّان',
      country: 'Jordan',
      country_en: 'Jordan',
      country_ar: 'الأردن',
      phone: '+962 79 300 7888',
      phone_href: 'tel:+962793007888',
      email: null,
      email_href: null,
      display_order: 3,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
  ];

  const displayOffices = offices.length > 0 ? offices : fallbackOffices;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.contacts-info .section-title', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.contacts-info',
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section contacts-section contacts-info" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">{t('ourOffices')}</h2>
        <div className="offices-grid">
          {displayOffices.map((office, index) => (
            <OfficeCard
              key={office.id}
              office={office}
              locale={locale}
              index={index}
            />
          ))}
        </div>

        <div className="contacts-hours">
          <h3 className="contacts-hours__title">{t('workingHours')}</h3>
          <p className="contacts-hours__value">{t('workingHoursValue')}</p>
        </div>
      </div>
    </section>
  );
}
