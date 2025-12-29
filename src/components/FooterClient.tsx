'use client';

import { Icon } from '@iconify/react';

interface SocialLink {
  id: string;
  platform: string;
  icon_url: string;
  href: string;
}

interface FooterClientProps {
  socialLinks: SocialLink[];
}

export function FooterClient({ socialLinks }: FooterClientProps) {
  // Check if icon_url is an Iconify icon (contains ':') or a URL
  const isIconify = (icon: string) => icon.includes(':') && !icon.startsWith('http');

  return (
    <div className="footer__socials">
      <div className="footer__socials__list">
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.href}
            title={social.platform}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isIconify(social.icon_url) ? (
              <Icon icon={social.icon_url} width={30} height={30} />
            ) : (
              <img
                src={social.icon_url}
                alt={social.platform}
                width={30}
                height={30}
                style={{ display: 'block' }}
              />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
