import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllSocialLinks } from '@/lib/data/social-links';
import { getAllOffices } from '@/lib/data/offices';
import { FooterClient } from './FooterClient';

export default async function Footer() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  const [socialLinks, offices] = await Promise.all([
    getAllSocialLinks(),
    getAllOffices()
  ]);

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
                  <a href="#">{office.city}, {office.country}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__contacts__item">
            <span className="footer__contacts__title">{t('phones')}</span>
            <ul>
              <li>
                <a href="tel:+966595594686">KSA: +966 595 594 686</a>
              </li>
              <li>
                <a href="tel:+201112276768">Egypt: +20 111 227 6768</a>
              </li>
              <li>
                <a href="tel:+962793007888">Jordan: +962 79 300 7888</a>
              </li>
            </ul>
          </div>

          <div className="footer__contacts__item">
            <span className="footer__contacts__title">{t('emailLabel')}</span>
            <ul>
              {offices.filter(o => o.email).slice(0, 1).map((office) => (
                <li key={office.id}>
                  <a href={`mailto:${office.email}`}>{office.email}</a>
                </li>
              ))}
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
