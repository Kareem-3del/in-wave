'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';

type MenuItem = {
  href: string;
  label: string;
  children?: MenuItem[];
};

export default function Header() {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: MenuItem[] = [
    { href: '/portfolio', label: t('projects') },
    { href: '/services', label: t('services') },
    { href: '/careers', label: t('careers') },
    {
      href: '#',
      label: t('aboutUs'),
      children: [
        { href: '/about-us', label: t('team') },
        { href: '/articles', label: t('blog') },
      ],
    },
    { href: '/contacts', label: t('contacts') },
  ];

  const headerClasses = [
    'header',
    isScrolled && 'header--scrolled',
    isMenuOpen && 'fullmenu-open',
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <div className="container header__cont">
        <div className="header__logo">
          <Link href="/">
            <img src="/images/logo.svg" alt="NKEY Architects" />
          </Link>
        </div>

        <nav className="header__nav">
          <div className="header__nav__inner">
            <ul className="menu">
              {menuItems.map((item) => (
                <li
                  key={item.href + item.label}
                  className={`menu-item ${item.children ? 'menu-item-has-children' : ''}`}
                >
                  <Link href={item.href}>{item.label}</Link>
                  {item.children && (
                    <ul className="sub-menu">
                      {item.children.map((child) => (
                        <li key={child.href} className="menu-item">
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="header__nav__tel">
              <a href="tel:+966595594686" className="num">+966 595 594 686</a>
            </div>
            <div className="header__nav__lang">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>

        <div className="header__right">
          <div className="header__lang-desktop">
            <LanguageSwitcher />
          </div>
          <div className="header__burger" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </div>
    </header>
  );
}
