'use client';

import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

const phoneNumbers = [
    {
        label: '+962 79 300 7888',
        value: '+962793007888',
    },
    {
        label: '+966 595 594 686',
        value: '+966595594686',
    },
    {
        label: '+20 111 227 6768',
        value: '+201112276768',
    }
];

export function PhoneDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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
        <div className="lang-dropdown phone-dropdown" ref={ref}>
            <button
                className="lang-trigger"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span style={{
                    color: '#1a1a1a',
                    background: "linear-gradient(135deg, #E5CCA8 0%, #c9a87a 100%)",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"

                }}>
                    <Icon icon="mdi:call" width={12} height={12} />
                </span>
                <span className={`arrow ${open ? 'open' : ''}`}>▾</span>
            </button>

            {open && (
                <div className="lang-menu" role="listbox">
                    {phoneNumbers.map((phone) => (

                        <a
                            style={{ direction: "ltr" }}
                            key={phone.value}
                            href={`tel:${phone.value}`}
                            className="lang-item"
                            role="option"
                            onClick={() => setOpen(false)}
                        >
                            {phone.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
