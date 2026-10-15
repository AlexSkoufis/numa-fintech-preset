'use client';

import { useEffect, useState } from 'react';
import { brand, nav } from '@/lib/content';
import { scrollToTarget, getLenis } from './SmoothScroll';

/** Brand mark: three rising bars — a chart reduced to a logo. */
export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <rect x="1" y="11" width="4.5" height="8" />
      <rect x="7.75" y="6" width="4.5" height="13" />
      <rect x="14.5" y="1" width="4.5" height="18" className="mark__hi" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(href), open ? 200 : 0);
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav__bar">
        <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} aria-label={`${brand.name} — home`}>
          <Mark />
          <span>{brand.name}</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} data-cursor="OPEN">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="nav__aux">
          <a href="#developers" className="nav__signin" onClick={(e) => go(e, '#developers')}>
            Docs
          </a>
          <a href="#access" className="nav__cta" onClick={(e) => go(e, '#access')} data-cursor="OPEN">
            Request access
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        {nav.map((n, i) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} style={{ '--i': i } as React.CSSProperties}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            {n.label}
          </a>
        ))}
        <a href="#access" className="nav__sheet-cta" onClick={(e) => go(e, '#access')}>
          Request access →
        </a>
      </div>
    </header>
  );
}
