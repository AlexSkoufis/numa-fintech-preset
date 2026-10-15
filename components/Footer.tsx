'use client';

import { useEffect, useRef, useState } from 'react';
import { brand, exchanges, footerLinks } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Mark } from './Nav';
import { scrollToTarget } from './SmoothScroll';

type Status = { time: string; open: boolean };

function statusOf(ex: (typeof exchanges)[number]): Status {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: ex.tz, hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const h = Number(get('hour')) % 24;
  const m = Number(get('minute'));
  const mins = h * 60 + m;
  const weekday = !['Sat', 'Sun'].includes(get('weekday'));
  const open = weekday && mins >= ex.open[0] * 60 + ex.open[1] && mins < ex.close[0] * 60 + ex.close[1];
  return { time: `${get('hour')}:${get('minute')}`, open };
}

/** Footer: live exchange status (holidays ignored), links, disclaimer, cropped wordmark. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [st, setSt] = useState<Status[]>(() => exchanges.map(() => ({ time: '--:--', open: false })));

  useEffect(() => {
    const tick = () => setSt(exchanges.map(statusOf));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo('.ft__mark', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'bottom bottom', scrub: 0.6 } });
    });
  });

  return (
    <footer ref={root} className="ft">
      <div className="wrap">
        <ul className="ft__markets mono" aria-label="Exchange status (weekday hours, holidays not included)">
          {exchanges.map((e, i) => (
            <li key={e.name} className={st[i].open ? 'open' : ''}>
              <span className="ft__state" aria-hidden="true" />
              <b>{e.name}</b>
              <span>{st[i].time}</span>
              <em>{st[i].open ? 'Open' : 'Closed'}</em>
            </li>
          ))}
        </ul>

        <div className="ft__grid">
          <div className="ft__brand">
            <a href="#top" className="nav__logo" onClick={(e) => (e.preventDefault(), scrollToTarget(0))}>
              <Mark />
              <span>{brand.name}</span>
            </a>
            <p>{brand.tagline}.</p>
            <a className="ft__mail" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
          </div>
          {footerLinks.map((col) => (
            <nav key={col.title} className="ft__col" aria-label={col.title}>
              <p className="mono">{col.title}</p>
              {col.links.map((l) => (
                <a key={l} href="#top">
                  {l}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="ft__base mono">
          <p>{brand.disclaimer}</p>
          <p>
            © {new Date().getFullYear()} {brand.name} · Concept by{' '}
            <a href={brand.credit.href} target="_blank" rel="noreferrer">
              {brand.credit.label}
            </a>
          </p>
        </div>
      </div>
      <p className="ft__mark" aria-hidden="true">
        {brand.wordmark}
      </p>
    </footer>
  );
}
