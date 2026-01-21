'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import type { Locale } from '@/lib/types/database';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  image_url?: string | null;
  // Bilingual fields
  name_en?: string | null;
  name_ar?: string | null;
  text_en?: string | null;
  text_ar?: string | null;
}

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

function getLocalizedValue(item: Testimonial, field: 'name' | 'text', locale: Locale): string {
  const localizedKey = `${field}_${locale}` as keyof Testimonial;
  const fallbackKey = `${field}_en` as keyof Testimonial;
  const legacyKey = field as keyof Testimonial;

  return (item[localizedKey] as string) || (item[fallbackKey] as string) || (item[legacyKey] as string) || '';
}

function StarIcon() {
  return (
    <svg
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="#E5CCA8"
      xmlns="http://www.w3.org/2000/svg"
      className="slide-block-star"
    >
      <path d="M11 0L13.4697 7.60081H21.4616L14.996 12.2984L17.4656 19.8992L11 15.2016L4.53436 19.8992L7.00402 12.2984L0.538379 7.60081H8.53035L11 0Z" />
    </svg>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="star-block">
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

function TestimonialCard({ name, rating, text, imageUrl, readMoreText, hideText }: {
  name: string;
  rating: number;
  text: string;
  imageUrl?: string | null;
  readMoreText: string;
  hideText: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const shortText = text.length > 200 ? text.slice(0, 200) + '...' : text;

  return (
    <div className="slide-block">
      <div className="slide-block-title">{name}</div>
      <div className="slide-block-img">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            width={80}
            height={80}
            style={{ objectFit: 'cover', borderRadius: '50%' }}
          />
        )}
      </div>
      <div className="slide-block-cont">
        <div className='t-content-top'></div>
        <p>
          {expanded ? text : shortText}
        </p>
        {text.length > 200 && (
          <a
            className="read-more"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: 'pointer' }}
          >
            {expanded ? hideText : readMoreText}
            <img style={{ width: "60%" }} src="/images/as-3.png" />
          </a>
        )}
        <div className='t-content-bottom'></div>
      </div>
      {/* <StarRating count={rating} /> */}
    </div>
  );
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const t = useTranslations('testimonials');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  // Group testimonials in pairs
  const slides = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    slides.push(testimonials.slice(i, i + 2));
  }

  return (
    <section className="section quote-testimonial">
      <div className="testimonial-cont">
        <div className="test-title"><p>{t('title')}</p></div>
        <div className="n2_clear">
          <div className="n2-section-smartslider">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: '.testimonial-arrow-prev',
                nextEl: '.testimonial-arrow-next',
              }}
              pagination={{
                clickable: true,
                el: '.testimonial-pagination',
              }}
              className="testimonial-swiper"
            >
              {slides.map((pair, slideIndex) => (
                <SwiperSlide key={slideIndex}>
                  <div className="testimonial-slide-content">
                    {pair.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        name={getLocalizedValue(testimonial, 'name', locale)}
                        rating={testimonial.rating}
                        text={getLocalizedValue(testimonial, 'text', locale)}
                        imageUrl={testimonial.image_url}
                        readMoreText={tCommon('readMore')}
                        hideText={tCommon('hide')}
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="testimonial-controls">
              <div className="testimonial-arrow-prev nextend-arrow nextend-arrow-previous">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.433 15.992L22.69 5.712c.393-.39.393-1.03 0-1.42-.393-.39-1.03-.39-1.423 0l-11.98 10.94c-.21.21-.3.49-.285.76-.015.28.075.56.284.77l11.98 10.94c.393.39 1.03.39 1.424 0 .393-.4.393-1.03 0-1.42l-11.257-10.29" fill="#ffffff" opacity="0.8" fillRule="evenodd" />
                </svg>
              </div>
              <div className="testimonial-arrow-next nextend-arrow nextend-arrow-next">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.722 4.293c-.394-.39-1.032-.39-1.427 0-.393.39-.393 1.03 0 1.42l11.283 10.28-11.283 10.29c-.393.39-.393 1.02 0 1.42.395.39 1.033.39 1.427 0l12.007-10.94c.21-.21.3-.49.284-.77.014-.27-.076-.55-.286-.76L10.72 4.293z" fill="#ffffff" opacity="0.8" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="testimonial-pagination"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
