'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import 'swiper/css';
import 'swiper/css/effect-fade';
import { Icon } from '@iconify/react';
import { scale } from 'motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSlide {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface HeroClientProps {
  slides: HeroSlide[];
}

export function HeroClient({ slides }: HeroClientProps) {
  const t = useTranslations('hero');
  const locale = useLocale()
  const tContact = useTranslations('contact');
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const heroStickyRef = useRef<HTMLDivElement>(null);
  const heroContRef = useRef<HTMLDivElement>(null);
  const heroSliderRef = useRef<HTMLDivElement>(null);
  const titleFirstRef = useRef<HTMLDivElement>(null);
  const titleSecondRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {

    console.log('isDesk:', window.innerWidth >= 1280);

    if (!heroTrackRef.current || !heroStickyRef.current || !heroContRef.current) return;

    const isDesk = window.innerWidth >= 1280;
    const firstStrokeMoveDistance = window.innerWidth * 0.1;
    const secondStrokeMoveDistance = -window.innerWidth * 0.1;
    const heroSection = document.querySelector('.hero-section') as HTMLElement | null;
    const heroTrackHeight = heroTrackRef.current?.offsetHeight || window.innerHeight * 2;
    const duration = window.innerHeight * (isDesk ? 0.7 : 1);
    // Match original ScrollTrigger: start when (top + heroTrackHeight - viewportHeight) reaches viewport bottom
    // This equals: scrollY = heroTrackHeight - 2 * viewportHeight
    // const triggerStart = Math.max(0, heroTrackHeight - 2 * window.innerHeight);
    const triggerStart = Math.max(0, heroTrackHeight - 2 * window.innerHeight);

    const triggerEnd = triggerStart + duration;

    if (!isDesk) {
      gsap.set(heroStickyRef.current, { opacity: 1 });
      gsap.set(heroContRef.current, { y: 0 });
      gsap.set(heroSliderRef.current, { scale: 1 });
    }


    // Helper function to apply hero state based on scroll position
    const updateHeroState = () => {
      if (!isDesk) return;

      const currentScroll = window.scrollY;
      let progress = 0;

      if (currentScroll <= triggerStart) {
        // Before trigger zone - fully visible
        progress = 0;
      } else if (currentScroll >= triggerEnd) {
        // After trigger zone - fully hidden
        progress = 1;
      } else {
        // Within trigger zone - calculate progress
        progress = (currentScroll - triggerStart) / duration;
      }

      // Apply opacity
      gsap.set(heroStickyRef.current, { opacity: 1 - progress });

      if (titleFirstRef.current) {
        gsap.set(titleFirstRef.current, { x: firstStrokeMoveDistance * progress });
      }

      if (titleSecondRef.current) {
        gsap.set(titleSecondRef.current, { x: secondStrokeMoveDistance * progress });
      }

      gsap.set(heroContRef.current, { y: -window.innerHeight / 2 * progress });

      if (heroSliderRef.current) {
        gsap.set(heroSliderRef.current, { scale: 1 + progress * 0.5 });
      }

      // Handle visibility
      if (heroSection && isDesk) {
        if (progress >= 1) {
          heroSection.style.pointerEvents = 'none';
          heroSection.style.visibility = 'hidden';
        } else {
          heroSection.style.pointerEvents = 'auto';
          heroSection.style.visibility = 'visible';
        }
      }

    };

    // Apply initial state immediately
    updateHeroState();

    // Listen to scroll events for reliable updates
    const handleScroll = () => {
      if (isDesk) {
        updateHeroState();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      // Keep ScrollTrigger for non-desktop or as fallback
      if (!isDesk) {
        ScrollTrigger.create({
          trigger: heroTrackRef.current,
          start: () => `top+=${triggerStart} bottom`,
          end: () => `+=${duration}`,
          scrub: true,
          onUpdate: (self) => {
            if (!isDesk) return;
            const progress = self.progress;

            gsap.to(heroStickyRef.current, {
              opacity: 1 - progress,
              duration: 0
            });

            if (titleFirstRef.current) {
              gsap.to(titleFirstRef.current, {
                x: firstStrokeMoveDistance * progress,
                duration: 0
              });
            }

            if (titleSecondRef.current) {
              gsap.to(titleSecondRef.current, {
                x: secondStrokeMoveDistance * progress,
                duration: 0
              });
            }

            gsap.to(heroContRef.current, {
              y: -window.innerHeight / 2 * progress,
              duration: 0
            });

            if (heroSliderRef.current) {
              gsap.to(heroSliderRef.current, {
                scale: 1 + progress * 0.5,
                duration: 0
              });
            }
          }
        });
      }

      ScrollTrigger.create({
        trigger: heroTrackRef.current,
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          if (swiperRef.current) {
            swiperRef.current.autoplay.stop();
          }
        },
        onEnterBack: () => {
          if (swiperRef.current) {
            swiperRef.current.autoplay.start();
          }
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const heroSection = document.querySelector('.hero-section');
      heroSection?.classList.add('opening-anim-ended');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section hero-section">
      <a href="#home-form" className="order-a-call">
        {tContact('orderCall')}
      </a>
      <div className="hero__track" ref={heroTrackRef}>
        <div className="hero__sticky" ref={heroStickyRef}>
          <div className="hero__slider" ref={heroSliderRef}>
            <div className="swiper-container">
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1000}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                className="swiper-wrapper-container"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id} className="hero__slider__item">
                    <div className="hero__slider__item__top">
                      <picture>
                        <img src={slide.image_url} alt={slide.alt_text || ''} />
                      </picture>
                    </div>
                    <div className="hero__slider__item__bot">
                      <picture>
                        <img src={slide.image_url} alt={slide.alt_text || ''} />
                      </picture>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="hero__cont" ref={heroContRef}>
            <a href="#home-form" className="hero__cta js-anchor-scroll">
              {/* <span>{tContact('send')}<br />{tContact('title1Italic')}</span> */}

              {/* <svg width="25" height="8" viewBox="0 0 25 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3536 4.35356C24.5488 4.15829 24.5488 3.84171 24.3536 3.64645L21.1716 0.464468C20.9763 0.269206 20.6597 0.269206 20.4645 0.464468C20.2692 0.65973 20.2692 0.976313 20.4645 1.17157L23.2929 4L20.4645 6.82843C20.2692 7.02369 20.2692 7.34027 20.4645 7.53554C20.6597 7.7308 20.9763 7.7308 21.1716 7.53554L24.3536 4.35356ZM-4.37114e-08 4.5L24 4.5L24 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z" fill="url(#paint0_linear_1107_87)" />
                <defs>
                  <linearGradient id="paint0_linear_1107_87" x1="-8.74228e-08" y1="5" x2="0.083189" y2="3.00347" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E5CCA8" />
                    <stop offset="1" stopColor="#88704E" />
                  </linearGradient>
                </defs>
              </svg> */}

              {/* <div className="hero__cta__circle">
                <div className="hero__cta__circle__inner"></div>
              </div> */}
              <div className='hero-contact'>
                <div className='hero-send'>
                  {t("send")}
                  <svg
                    style={{
                      ...(locale === "ar" && {
                        transform: "scale(-1)"
                      })
                    }}
                    width="25" height="8" viewBox="0 0 25 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.3536 4.35356C24.5488 4.15829 24.5488 3.84171 24.3536 3.64645L21.1716 0.464468C20.9763 0.269206 20.6597 0.269206 20.4645 0.464468C20.2692 0.65973 20.2692 0.976313 20.4645 1.17157L23.2929 4L20.4645 6.82843C20.2692 7.02369 20.2692 7.34027 20.4645 7.53554C20.6597 7.7308 20.9763 7.7308 21.1716 7.53554L24.3536 4.35356ZM-4.37114e-08 4.5L24 4.5L24 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z" fill="url(#paint0_linear_1107_87)" />
                    <defs>
                      <linearGradient id="paint0_linear_1107_87" x1="-8.74228e-08" y1="5" x2="0.083189" y2="3.00347" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fff" />
                        <stop offset="1" stopColor="#fff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className='hero-contact-text'>
                  {tContact("title1Italic")}
                </div>
              </div>
            </a>

            <h1 className="hero__cont__title">
              <div className="hero__cont__title__item" ref={titleFirstRef}>
                <span>{t('title1')}</span>
              </div>
              <div className="hero__cont__title__item" ref={titleSecondRef}>
                <span>{t('title2')}</span>
              </div>
            </h1>
          </div>

          <div className="hero__scroller">
            <div className='hero__scroller-top'></div>
            <div className='hero__scroller-bottom'></div>
          </div>
        </div>
      </div>
    </section>
  );
}
