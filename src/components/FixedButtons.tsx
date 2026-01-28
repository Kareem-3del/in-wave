'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

function phoneNumbers(locale: string) {
  return [
    {
      label: locale === "en" ? "Jordan" : "الأردن",
      value: '962793007888',
    },
    {
      label: locale === "en" ? "KSA" : "السعودية",
      value: '966595594686',
    },
    {
      label: locale === "en" ? "Egypt" : "مصر",
      value: '201112276768',
    }
  ]
};
export default function FixedButtons() {

  const { locale } = useParams();

  const t = useTranslations('contact');
  const tContact = useTranslations('contact');

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* <div className="fixed-connect">
        <span>{t('contactUs')}</span>
      </div> */}

      {/* <a href="#home-form" className="order-a-call-overlay">
        {tContact('orderCall')}
      </a> */}

      <a
        className="wa-block"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          backgroundColor: "#222326",
          borderRadius: "30px"
        }}
      >
        {/* <svg viewBox="0 0 32 32" fill="url(#goldGradient)" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5CCA8" />
              <stop offset="100%" stopColor="#c9a87a" />
            </linearGradient>
          </defs>
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.837.74 5.496 2.034 7.808L.105 31.895l8.204-1.897A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.165 22.583c-.347.976-1.713 1.787-2.806 2.023-.746.159-1.72.285-5.002-1.074-4.2-1.737-6.9-5.987-7.109-6.264-.201-.277-1.693-2.255-1.693-4.3s1.072-3.055 1.453-3.472c.381-.417.833-.521 1.11-.521h.8c.256 0 .601-.097.939.716.347.833 1.18 2.873 1.282 3.082.104.208.174.452.035.729-.139.277-.208.451-.417.694-.208.243-.437.542-.625.729-.208.208-.424.434-.182.85.243.417 1.08 1.783 2.32 2.888 1.591 1.419 2.933 1.858 3.35 2.066.417.208.66.174.903-.104.243-.277 1.04-1.214 1.318-1.631.277-.417.555-.347.937-.208.382.139 2.42 1.142 2.836 1.35.417.208.694.312.798.486.104.173.104 1.006-.243 1.982z" />
        </svg> */}

        <img alt="wa-img" src="/images/wa-icon.png" />
        {/* <p
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 8px",
            fontSize: "12px",
            textWrap: "wrap",
            whiteSpace: "pre-wrap",
            maxWidth: "100px"
          }}
        >
          {t("whatsapp")}
        </p> */}

        {open && (
          <div className="lang-menu" role="listbox">
            {phoneNumbers(locale?.toString() || "en").map((phone) => (
              <a
                style={{ direction: "ltr" }}
                key={phone.value}
                href={`https://wa.me/${phone.value}`}
                className="lang-item"
                role="option"
                onClick={() => setOpen(false)}
                target="_blank"
              >
                {phone.label}
              </a>
            ))}
          </div>
        )}
      </a>



    </>
  );
}
