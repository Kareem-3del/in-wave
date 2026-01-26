/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllSocialLinks } from '@/lib/data/social-links';
import { getAllOffices } from '@/lib/data/offices';
import { FooterClient } from './FooterClient';
import { useLocale } from 'next-intl';

export default async function Footer() {


  const t = await getTranslations('footer');
  const locale = await getLocale()
  const tNav = await getTranslations('nav');

  const [socialLinks] = await Promise.all([
    getAllSocialLinks(),
    // getAllOffices()
  ]);

  const offices = [
    {
      id: "am",
      city_ar: "عمّان",
      country_ar: "الأردن",
      city_en: "Amman",
      country_en: "Jordan",
      href: "https://www.google.com/maps/place//@31.955197,35.8854479,651m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      id: "ry",
      city_ar: "الرياض",
      country_ar: "المملكة العربية السعودية",
      city_en: "Riyadh",
      country_en: "Saudi Arabia",
      href: "https://www.google.com/maps/place//@31.955197,35.8854479,651m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      id: "alex",
      city_ar: "الإسكندرية",
      country_ar: "مصر",
      city_en: "Alexandria",
      country_en: "Egypt",
      href: "https://www.google.com/maps?q=31.2564195,29.9807359&z=17&hl=en"
    }
  ];


  const footerMenu = [
    { label: tNav('projects'), href: '/portfolio' },
    { label: tNav('services'), href: '/services' },
    { label: tNav('aboutUs'), href: '/about-us' },
    { label: tNav('careers'), href: '/careers' },
    { label: tNav('contacts'), href: '/contacts' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__title">
          <span className="title">
            <span className="title__item">
              <span>{t('title1')} </span>
            </span>
            <span className="title__item">
              <span><i>{t('title2Italic')}</i></span>
            </span>
          </span>
        </div>

        <div className="footer__contacts">
          <div className="footer__contacts__item">
            <span className="footer__contacts__title">{t('offices')}</span>
            <ul>
              {offices.map((office) => (
                <li key={office.id}>
                  <a href={office.href}>{office?.[`city_${locale as "ar" | "en"}`]}, {office?.[`country_${locale as "ar" | "en"}`]}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__contacts__item">
            <span className="footer__contacts__title">{t('phones')}</span>
            <ul>
              <li>
                <a href="tel:+962793007888">Jordan: +962 79 300 7888</a>
              </li>
              <li>
                <a href="tel:+966595594686">KSA: +966 595 594 686</a>
              </li>
              <li>
                <a href="tel:+201112276768">Egypt: +20 111 227 6768</a>
              </li>
            </ul>
          </div>

          <div className="footer__contacts__item">
            <span className="footer__contacts__title">{t('emailLabel')}</span>
            <ul>
              {/* {offices.filter(o => o.email).slice(0, 1).map((office) => (
                <li key={office.id}>
                  <a href={`mailto:${office.email}`}>{office.email}</a>
                </li>
              ))} */}
              <li >
                <a href="mailto:Info@iwarchitects.com ">
                  Info@iwarchitects.com
                </a>
              </li>

            </ul>
          </div>
        </div>

        <div className="footer__menu">
          <ul className="menu">
            {footerMenu.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <FooterClient socialLinks={socialLinks} />
      </div>
    </footer>
  );
}
