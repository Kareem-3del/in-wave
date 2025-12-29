'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales } from '@/i18n/config';

const languageLabels: Record<string, { label: string; native: string }> = {
  en: { label: 'EN', native: 'English' },
  ar: { label: 'ع', native: 'العربية' },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Sort locales so inactive language comes first (clickable), active comes second
  const sortedLocales = [...locales].sort((a, b) => {
    if (a === locale) return 1;
    if (b === locale) return -1;
    return 0;
  });

  return (
    <div className="language-switcher">
      {sortedLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`language-switcher__btn ${locale === loc ? 'language-switcher__btn--active' : ''}`}
          aria-label={`Switch to ${languageLabels[loc].native}`}
          title={languageLabels[loc].native}
        >
          {languageLabels[loc].label}
        </button>
      ))}
    </div>
  );
}
