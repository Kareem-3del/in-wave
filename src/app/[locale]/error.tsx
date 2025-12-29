'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CustomCursor from '@/components/CustomCursor';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const crackRefs = useRef<(SVGPathElement | null)[]>([]);
  const debrisRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate cracks appearing
      crackRefs.current.forEach((crack, i) => {
        if (!crack) return;
        const length = crack.getTotalLength();

        gsap.set(crack, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(crack, {
          strokeDashoffset: 0,
          duration: 0.8,
          delay: 0.3 + i * 0.15,
          ease: 'power2.inOut',
        });
      });

      // Animate falling debris
      debrisRefs.current.forEach((debris, i) => {
        if (!debris) return;

        gsap.set(debris, {
          y: -100,
          x: Math.random() * 40 - 20,
          rotation: Math.random() * 360,
          opacity: 0,
        });

        gsap.to(debris, {
          y: 0,
          opacity: 1,
          rotation: `+=${Math.random() * 180}`,
          duration: 1 + Math.random() * 0.5,
          delay: 0.5 + i * 0.1,
          ease: 'bounce.out',
        });

        // Continuous subtle movement
        gsap.to(debris, {
          y: `+=${5 + Math.random() * 10}`,
          rotation: `+=${10 - Math.random() * 20}`,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5 + i * 0.2,
        });
      });

      // Glitch effect on number
      if (numberRef.current) {
        gsap.fromTo(numberRef.current,
          { opacity: 0, scale: 1.5 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );

        // Continuous glitch
        const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        glitchTimeline
          .to(numberRef.current, { skewX: 5, duration: 0.05 })
          .to(numberRef.current, { skewX: -5, duration: 0.05 })
          .to(numberRef.current, { skewX: 3, x: -3, duration: 0.05 })
          .to(numberRef.current, { skewX: 0, x: 3, duration: 0.05 })
          .to(numberRef.current, { x: 0, duration: 0.05 });
      }

      // Screen shake effect
      gsap.to(containerRef.current, {
        x: 3,
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        delay: 0.3,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <CustomCursor />
      <div className="error-page error-page--500" ref={containerRef}>
        {/* Cracked overlay */}
      <svg className="error-page__cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          ref={(el) => { crackRefs.current[0] = el; }}
          d="M50,0 L48,20 L52,35 L45,50 L55,65 L48,80 L50,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
        />
        <path
          ref={(el) => { crackRefs.current[1] = el; }}
          d="M52,35 L65,40 L80,38"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
        />
        <path
          ref={(el) => { crackRefs.current[2] = el; }}
          d="M45,50 L30,55 L15,52"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
        />
        <path
          ref={(el) => { crackRefs.current[3] = el; }}
          d="M55,65 L70,70 L85,68"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
        />
        <path
          ref={(el) => { crackRefs.current[4] = el; }}
          d="M0,30 L20,32 L35,28 L48,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
        />
      </svg>

      {/* Falling debris */}
      <div className="error-page__debris">
        {DEBRIS_POSITIONS.map((pos, i) => (
          <div
            key={`debris-${i}`}
            ref={(el) => { debrisRefs.current[i] = el; }}
            className={`error-page__debris-piece error-page__debris-piece--${(i % 4) + 1}`}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
          />
        ))}
      </div>

      {/* Warning stripes */}
      <div className="error-page__warning-stripe error-page__warning-stripe--top" />
      <div className="error-page__warning-stripe error-page__warning-stripe--bottom" />

      {/* Main content */}
      <div className="error-page__content">
        <div className="error-page__card error-page__card--danger">
          {/* Alert icon */}
          <div className="error-page__alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* 500 Number with glitch */}
          <div className="error-page__number error-page__number--glitch" ref={numberRef}>
            <span className="error-page__number-text" data-text="500">500</span>
          </div>

          {/* Message */}
          <h1 className="error-page__title">
            <span className="error-page__title-line">STRUCTURAL</span>
            <span className="error-page__title-line"><i>Failure</i></span>
          </h1>

          <p className="error-page__message">
            Our system encountered an unexpected error. Our engineers are working to restore stability.
          </p>

          {error.digest && (
            <p className="error-page__code">
              Error Code: {error.digest}
            </p>
          )}

          {/* Action buttons */}
          <div className="error-page__actions">
            <button onClick={reset} className="error-page__btn error-page__btn--primary">
              <span>Try Again</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </button>
            <a href="/" className="error-page__btn error-page__btn--secondary">
              <span>Go Home</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Status indicator */}
        <div className="error-page__status">
          <div className="error-page__status-dot" />
          <span>System Status: Error</span>
        </div>
      </div>

      {/* Scan lines effect */}
      <div className="error-page__scanlines" />

        {/* Glitch overlay */}
        <div className="error-page__glitch-overlay" />
      </div>
    </>
  );
}

// Pre-defined debris positions to avoid hydration mismatch
const DEBRIS_POSITIONS = [
  { left: 10, top: 35 },
  { left: 17, top: 55 },
  { left: 24, top: 28 },
  { left: 31, top: 65 },
  { left: 38, top: 42 },
  { left: 45, top: 72 },
  { left: 52, top: 30 },
  { left: 59, top: 58 },
  { left: 66, top: 45 },
  { left: 73, top: 68 },
  { left: 80, top: 38 },
  { left: 87, top: 52 },
];
