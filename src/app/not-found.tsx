'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate floating architectural blocks
      blocksRef.current.forEach((block, i) => {
        if (!block) return;

        gsap.set(block, {
          y: Math.random() * 100 - 50,
          x: Math.random() * 60 - 30,
          rotation: Math.random() * 20 - 10,
          opacity: 0,
        });

        gsap.to(block, {
          y: 0,
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.1 * i,
          ease: 'elastic.out(1, 0.5)',
        });

        // Continuous floating animation
        gsap.to(block, {
          y: `+=${10 + Math.random() * 15}`,
          rotation: `+=${5 - Math.random() * 10}`,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });

      // Animate the 404 number with glitch effect
      if (numberRef.current) {
        gsap.fromTo(numberRef.current,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)' }
        );

        // Subtle glitch effect
        const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
        glitchTimeline
          .to(numberRef.current, { x: -5, duration: 0.05 })
          .to(numberRef.current, { x: 5, duration: 0.05 })
          .to(numberRef.current, { x: -3, duration: 0.05 })
          .to(numberRef.current, { x: 0, duration: 0.05 });
      }

      // Animate blueprint lines
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.fromTo(line,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.3, duration: 0.8, delay: 0.5 + i * 0.1, ease: 'power2.out' }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <CustomCursor />
      <div className="error-page error-page--404" ref={containerRef}>
        {/* Blueprint grid background */}
      <div className="error-page__grid">
        {[...Array(20)].map((_, i) => (
          <div
            key={`line-${i}`}
            ref={(el) => { lineRefs.current[i] = el; }}
            className="error-page__grid-line"
            style={{
              top: `${(i + 1) * 5}%`,
              transform: `rotate(${i % 2 === 0 ? 0 : 90}deg)`,
            }}
          />
        ))}
      </div>

      {/* Floating architectural blocks */}
      <div className="error-page__blocks">
        {[...Array(8)].map((_, i) => (
          <div
            key={`block-${i}`}
            ref={(el) => { blocksRef.current[i] = el; }}
            className={`error-page__block error-page__block--${i + 1}`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="error-page__content">
        <div className="error-page__card">
          {/* Decorative corner brackets */}
          <div className="error-page__corner error-page__corner--tl" />
          <div className="error-page__corner error-page__corner--tr" />
          <div className="error-page__corner error-page__corner--bl" />
          <div className="error-page__corner error-page__corner--br" />

          {/* 404 Number */}
          <div className="error-page__number" ref={numberRef}>
            <span className="error-page__number-digit">4</span>
            <span className="error-page__number-zero">
              <svg viewBox="0 0 100 100" className="error-page__compass">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="5" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="80" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
                <line x1="5" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="2" />
                <line x1="80" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="5" fill="currentColor" />
              </svg>
            </span>
            <span className="error-page__number-digit">4</span>
          </div>

          {/* Message */}
          <h1 className="error-page__title">
            <span className="error-page__title-line">BLUEPRINT</span>
            <span className="error-page__title-line"><i>Not Found</i></span>
          </h1>

          <p className="error-page__message">
            The architectural design you&apos;re looking for has been relocated or doesn&apos;t exist in our portfolio.
          </p>

          {/* Action buttons */}
          <div className="error-page__actions">
            <Link href="/" className="error-page__btn error-page__btn--primary">
              <span>Return Home</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link href="/#home-form" className="error-page__btn error-page__btn--secondary">
              <span>Contact Us</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decorative measurement lines */}
        <div className="error-page__measurements">
          <div className="error-page__measure error-page__measure--h">
            <span>404px</span>
          </div>
          <div className="error-page__measure error-page__measure--v">
            <span>ERR</span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="error-page__particles">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <div
            key={`particle-${i}`}
            className="error-page__particle"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          />
        ))}
        </div>
      </div>
    </>
  );
}

// Pre-defined particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 5, top: 10, delay: 0, duration: 4 },
  { left: 15, top: 80, delay: 1.2, duration: 5 },
  { left: 25, top: 30, delay: 0.5, duration: 3.5 },
  { left: 35, top: 60, delay: 2, duration: 6 },
  { left: 45, top: 15, delay: 0.8, duration: 4.5 },
  { left: 55, top: 85, delay: 1.5, duration: 5.5 },
  { left: 65, top: 40, delay: 0.3, duration: 3.8 },
  { left: 75, top: 70, delay: 2.5, duration: 4.2 },
  { left: 85, top: 25, delay: 1, duration: 5.2 },
  { left: 92, top: 55, delay: 1.8, duration: 3.2 },
  { left: 10, top: 45, delay: 2.2, duration: 6.5 },
  { left: 30, top: 90, delay: 0.7, duration: 4.8 },
  { left: 50, top: 5, delay: 1.3, duration: 5.8 },
  { left: 70, top: 50, delay: 2.8, duration: 3.5 },
  { left: 88, top: 75, delay: 0.2, duration: 4.3 },
];
