'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PhoneDropdown } from './PhoneDropdown';

type MenuItem = {
  href: string;
  label: string;
  children?: MenuItem[];
};

export default function Header() {
  const t = useTranslations('nav');

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if we're on the home page
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/ar';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show header immediately on non-home pages, with delay on home page
  useEffect(() => {
    if (isHomePage) {
      // On home page, wait for preloader
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    } else {
      // On other pages, show immediately
      setIsVisible(true);
    }
  }, [isHomePage]);

  const menuItems: MenuItem[] = [
    { href: '/portfolio', label: t('projects') },
    { href: '/services', label: t('services') },
    { href: '/about-us', label: t('aboutUs') },
    { href: '/careers', label: t('careers') },
    { href: '/articles', label: t('blog') },
    { href: '/contacts', label: t('contacts') },
  ];

  const headerClasses = [
    'header',
    isScrolled && 'header--scrolled',
    isMenuOpen && 'fullmenu-open',
    isVisible && 'header--visible',
  ].filter(Boolean).join(' ');

  return (
    <header className={`${headerClasses} header-container`}>
      <div className="container header__cont">
        <div className="header__logo">
          <Link href="/">
            <img src="/images/logo.svg" alt="IN-WAVE Architects" />
          </Link>
        </div>

        <nav className={`header__nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="header__nav__inner">
            <ul className="menu">
              {menuItems.map((item) => {
                // Check if current page matches this menu item
                const isActive = pathname.includes(item.href);

                return (
                  <li
                    key={item.href}
                    className={`menu-item ${isActive ? 'current-menu-item' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                );
              })}
              <li className='menu-item'>
                <PhoneDropdown />
              </li>
              <li className='menu-item'>
                <LanguageSwitcher />
              </li>
            </ul>
            {/* <div className="header__nav__tel">
              <a href="tel:+966595594686" className="num">+966 595 594 686</a>
            </div> */}
            {/* <div className="header__nav__lang">
              <LanguageSwitcher />
            </div> */}
          </div>
        </nav>

        <div className="header__right">
          {/* <div className="header__lang-desktop">
            <LanguageSwitcher />
          </div> */}
          <div
            className="header__burger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          />
        </div>
      </div>
    </header>
  );
}
