'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales } from '@/i18n/config';

const languageLabels: Record<string, string> = {
  en: 'EN',
  ar: 'ع',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
    setOpen(false);
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        className="lang-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {languageLabels[locale]}
        <span className={`arrow ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="lang-menu" role="listbox">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`lang-item ${loc === locale ? 'active' : ''}`}
              role="option"
              aria-selected={loc === locale}
            >
              {languageLabels[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
