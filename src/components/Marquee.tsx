'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Marquee({ children, className = '' }: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const MARQUEE_AMOUNT_REPEAT = 20;

  useEffect(() => {
    // Add ready class after delay to start animation
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Create repeated items
  const repeatedItems = Array.from({ length: MARQUEE_AMOUNT_REPEAT }, (_, i) => (
    <div key={i} className="marquee-title__item">
      {children}
    </div>
  ));

  return (
    <div className={`marquee-title ${className}`}>
      <div
        ref={marqueeRef}
        className={`marquee-title__inner js-marquee ${isReady ? 'ready' : ''}`}
      >
        {repeatedItems}
      </div>
      <div className="marquee-title__overlay"></div>
    </div>
  );
}

// Simple marquee for "work stages" and "about us" sections
export function SimpleMarquee({ text, italicPart }: { text: string; italicPart?: string }) {
  const [isReady, setIsReady] = useState(false);
  const MARQUEE_AMOUNT_REPEAT = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const repeatedItems = Array.from({ length: MARQUEE_AMOUNT_REPEAT }, (_, i) => (
    <div key={i} className="marquee-title__item">
      {italicPart && <i>{italicPart}</i>} {text}
    </div>
  ));

  return (
    <div className="marquee-title simple">
      <div className={`marquee-title__inner js-marquee ${isReady ? 'ready' : ''}`}>
        {repeatedItems}
      </div>
      <div className="marquee-title__overlay"></div>
    </div>
  );
}

// Zebra marquee for gallery sections
export function ZebraMarquee({ text }: { text: string }) {
  const [isReady, setIsReady] = useState(false);
  const MARQUEE_AMOUNT_REPEAT = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const repeatedItems = Array.from({ length: MARQUEE_AMOUNT_REPEAT }, (_, i) => (
    <div key={i} className="marquee-title__item">
      {text}
    </div>
  ));

  return (
    <div className="marquee-title zebra">
      <div className={`marquee-title__inner js-marquee ${isReady ? 'ready' : ''}`}>
        {repeatedItems}
      </div>
      <div className="marquee-title__overlay"></div>
    </div>
  );
}
