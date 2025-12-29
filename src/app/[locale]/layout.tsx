import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import CustomCursor from '@/components/CustomCursor';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  // Determine text direction and font
  const isArabic = locale === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  return (
    <div
      dir={dir}
      lang={locale}
      style={isArabic ? { fontFamily: "'Cairo', sans-serif" } : undefined}
      className={isArabic ? 'arabic-locale' : 'english-locale'}
    >
      <CustomCursor />
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
