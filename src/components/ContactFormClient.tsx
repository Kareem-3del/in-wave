'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Service {
  id: string;
  name: string;
  // Bilingual fields
  name_en?: string | null;
  name_ar?: string | null;
}

interface ContactFormClientProps {
  services: Service[];
}

function getLocalizedServiceName(service: Service, locale: Locale): string {
  if (locale === 'ar' && service.name_ar) return service.name_ar;
  return service.name_en || service.name;
}

export function ContactFormClient({ services }: ContactFormClientProps) {
  const t = useTranslations('contact');
  const tErrors = useTranslations('errors');
  const locale = useLocale() as Locale;
  const formRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    objectLocation: '',
    service: services[0]?.name || '',
    userName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (!formRef.current) return;

    const isDesk = window.innerWidth >= 1280;
    const isRTL = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl';
    const titleMoveLength = (isDesk ? window.innerWidth / 4 : window.innerWidth / 2) * (isRTL ? -1 : 1);
    const titleItems = formRef.current.querySelectorAll('.title__item');

    titleItems.forEach((title, index) => {
      const direction = index % 2 ? 1 : -1;
      gsap.set(title, { x: titleMoveLength * direction });
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: formRef.current,
        start: `top-=${window.innerHeight / 4} 70%`,
        end: `+=${window.innerHeight / 2}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          titleItems.forEach((title, index) => {
            const direction = index % 2 ? 1 : -1;
            gsap.to(title, {
              x: (1 - progress) * titleMoveLength * direction,
              duration: 0.1
            });
          });
        }
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_location: formData.objectLocation,
          service: formData.service,
          user_name: formData.userName,
          phone: formData.phone,
          email: formData.email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || tErrors('submissionFailed'));
      }

      setSubmitted(true);
      setFormData({
        objectLocation: '',
        service: services[0]?.name || '',
        userName: '',
        phone: '',
        email: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : tErrors('somethingWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section home-form-section" id="home-form">
      <div className="container">
        <div className="form" ref={formRef}>
          <div className="title title--inline form__title">
            <span className="title__item">
              <span>{t('title1')} <i>{t('title1Italic')}</i></span>
            </span>
            <span className="title__item">
              <span>{t('title2')}</span>
            </span>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h3 style={{ color: '#E5CCA8', marginBottom: 16 }}>{t('thankYou')}</h3>
              <p style={{ color: '#fff' }}>{t('messageSent')}</p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: 24,
                  padding: '12px 32px',
                  background: 'transparent',
                  border: '1px solid #E5CCA8',
                  color: '#E5CCA8',
                  cursor: 'pointer'
                }}
              >
                {t('sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>{t('formLegend')}</legend>

                {error && (
                  <div style={{ color: '#dc2626', marginBottom: 16, textAlign: 'center' }}>
                    {error}
                  </div>
                )}

                <div className="form-item">
                  <input
                    type="text"
                    name="objectLocation"
                    placeholder={t('objectLocation')}
                    value={formData.objectLocation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-item">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {getLocalizedServiceName(service, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-item">
                  <input
                    type="text"
                    name="userName"
                    placeholder={t('yourName')}
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-item">
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t('phone')}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-item form-item--fullwidth">
                  <input
                    type="email"
                    name="email"
                    placeholder={t('email')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-submit">
                  <input
                    type="submit"
                    value={submitting ? t('sending') : t('send')}
                    disabled={submitting}
                  />
                </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
