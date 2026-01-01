'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServicesHeroProps {
  locale: string;
}

export function ServicesHero({ locale }: ServicesHeroProps) {
  const t = useTranslations('services');
  const isRTL = locale === 'ar';
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Gradient orbs */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.1, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Mouse follow gradient */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(245, 158, 11, 0.15), transparent 60%)`,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center"
        style={{ y: springY, opacity }}
      >
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-amber-500/80 text-sm tracking-[0.25em] uppercase font-medium mb-6"
        >
          {isRTL ? 'NKEY للهندسة المعمارية' : 'NKEY ARCHITECTS'}
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]"
        >
          <span className="italic text-amber-500">{t('heroTitleItalic')}</span>
          <br />
          <span>{t('heroTitle')}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-base md:text-lg text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t('heroDescription')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#services-grid"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-500 hover:scale-[1.02]"
          >
            <span>{isRTL ? 'استكشف خدماتنا' : 'Explore Services'}</span>
            <Icon
              icon={isRTL ? 'mdi:arrow-left' : 'mdi:arrow-right'}
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </a>

          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-medium text-sm rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-500"
          >
            <span>{isRTL ? 'تواصل معنا' : 'Get in Touch'}</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase">
            {isRTL ? 'اسحب للأسفل' : 'Scroll'}
          </span>
          <div className="w-5 h-8 border border-neutral-700 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1 bg-amber-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
    </section>
  );
}
