'use client';

import { useEffect, useRef } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple animation without GSAP for global error (minimal dependencies)
    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      containerRef.current.style.transform = 'scale(0.95)';

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          containerRef.current.style.opacity = '1';
          containerRef.current.style.transform = 'scale(1)';
        }
      });
    }
  }, []);

  return (
    <html>
      <body>
        <div ref={containerRef} style={styles.container}>
          {/* Background pattern */}
          <div style={styles.pattern} />

          {/* Main content */}
          <div style={styles.content}>
            <div style={styles.card}>
              {/* Warning icon */}
              <div style={styles.iconWrapper}>
                <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              {/* Error number */}
              <div style={styles.number}>500</div>

              {/* Title */}
              <h1 style={styles.title}>
                <span style={styles.titleLine}>CRITICAL</span>
                <span style={styles.titleLineItalic}>System Error</span>
              </h1>

              {/* Message */}
              <p style={styles.message}>
                A critical error has occurred. Please try refreshing the page or contact support if the problem persists.
              </p>

              {error.digest && (
                <p style={styles.code}>
                  Reference: {error.digest}
                </p>
              )}

              {/* Actions */}
              <div style={styles.actions}>
                <button onClick={reset} style={styles.btnPrimary}>
                  <span>Retry</span>
                </button>
                <a href="/" style={styles.btnSecondary}>
                  <span>Home</span>
                </a>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div style={styles.cornerTL} />
          <div style={styles.cornerBR} />
        </div>
      </body>
    </html>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Tussilago El', 'Helvetica Neue', sans-serif",
    color: '#E5CCA8',
    position: 'relative',
    overflow: 'hidden',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(229, 204, 168, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(229, 204, 168, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
  },
  card: {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(229, 204, 168, 0.2)',
    borderRadius: '4px',
    padding: '3rem 2rem',
    textAlign: 'center' as const,
    backdropFilter: 'blur(10px)',
  },
  iconWrapper: {
    marginBottom: '1.5rem',
  },
  icon: {
    width: '60px',
    height: '60px',
    color: '#E5CCA8',
    animation: 'pulse 2s ease-in-out infinite',
  },
  number: {
    fontSize: '6rem',
    fontWeight: 'bold',
    lineHeight: 1,
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #E5CCA8 0%, #88704E 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  title: {
    fontSize: '1.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.2em',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  titleLine: {
    display: 'block',
  },
  titleLineItalic: {
    fontStyle: 'italic',
    fontFamily: "'Tussilago Rg', serif",
  },
  message: {
    color: 'rgba(229, 204, 168, 0.7)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: 'rgba(229, 204, 168, 0.5)',
    marginBottom: '1.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #E5CCA8 0%, #88704E 100%)',
    color: '#000',
    border: 'none',
    padding: '0.75rem 2rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#E5CCA8',
    border: '1px solid rgba(229, 204, 168, 0.3)',
    padding: '0.75rem 2rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'border-color 0.2s ease',
  },
  cornerTL: {
    position: 'absolute' as const,
    top: '2rem',
    left: '2rem',
    width: '60px',
    height: '60px',
    borderTop: '2px solid rgba(229, 204, 168, 0.2)',
    borderLeft: '2px solid rgba(229, 204, 168, 0.2)',
  },
  cornerBR: {
    position: 'absolute' as const,
    bottom: '2rem',
    right: '2rem',
    width: '60px',
    height: '60px',
    borderBottom: '2px solid rgba(229, 204, 168, 0.2)',
    borderRight: '2px solid rgba(229, 204, 168, 0.2)',
  },
};
