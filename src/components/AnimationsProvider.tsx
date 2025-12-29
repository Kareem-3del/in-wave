'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useGalleryAnimations,
  useFormTitleAnimations,
  useWorkStagesAnimations,
  useHeaderScroll
} from '@/hooks/useAnimations';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimationsProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShown, setIsShown] = useState(false);

  // Initialize scroll-based animations
  useGalleryAnimations();
  useFormTitleAnimations();
  useWorkStagesAnimations();
  useHeaderScroll();

  useEffect(() => {
    // Wait for fonts and resources to load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setIsLoaded(true);
        setTimeout(() => {
          setIsShown(true);
        }, 1000);
      });
    } else {
      // Fallback for browsers without document.fonts
      setIsLoaded(true);
      setTimeout(() => {
        setIsShown(true);
      }, 1000);
    }

    // Refresh ScrollTrigger after everything loads
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.add('loaded');
    }
    if (isShown) {
      document.body.classList.add('show');
    }
  }, [isLoaded, isShown]);

  return <>{children}</>;
}
