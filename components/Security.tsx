'use client';

import { useEffect, useRef, useState } from 'react';
import { security } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import Scramble from './Scramble';

const HEX = '0123456789abcdef';
const hex = (n: number) => Array.from({ length: n }, () => HEX[(Math.random() * 16) | 0]).join('');
const INITIAL = ['9f3a2c7d1e8b4a60', 'c41d0e9a7f2b3856', '7e8b21fa0c4d9e13', '2a6f0b9c8d7e1f45', 'e03c7a1b9f2d6e84', '5b9d2e0f7a3c1e68'];

function Ring({ r, ticks, className }: { r: number; ticks: number; className: string }) {
  return (
    <g className={className}>
      <circle r={r} />
      {Array.from({ length: ticks }, (_, i) => {
        const a = (i / ticks) * Math.PI * 2;
        const l = i % 5 === 0 ? 10 : 5;
        return (
          <line
            key={i}
            x1={(Math.cos(a) * r).toFixed(2)}
            y1={(Math.sin(a) * r).toFixed(2)}
            x2={(Math.cos(a) * (r - l)).toFixed(2)}
            y2={(Math.sin(a) * (r - l)).toFixed(2)}
          />
        );
      })}
    </g>
  );
}

/** 05 — Security. Vault dial rings counter-rotate with scroll; key material scrambles beside it. */
export default function Security() {
  const root = useRef<HTMLElement>(null);
  const [keys, setKeys] = useState(INITIAL);

  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    const id = window.setInterval(() => setKeys((k) => k.map((x, i) => (Math.random() < 0.5 ? hex(16) : x))), 180);
    return () => window.clearInterval(id);
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 };
      gsap.to('.vault__r1', { rotate: 180, svgOrigin: '0 0', ease: 'none', scrollTrigger: st });
      gsap.to('.vault__r2', { rotate: -240, svgOrigin: '0 0', ease: 'none', scrollTrigger: st });
      gsap.to('.vault__r3', { rotate: 120, svgOrigin: '0 0', ease: 'none', scrollTrigger: st });
      gsap.from('.sec__point', { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1, scrollTrigger: { trigger: '.sec__points', start: 'top 85%', once: true } });
      gsap.fromTo('.vault__lock', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '.vault', start: 'top 80%', end: 'center center', scrub: true } });
    });
  });

  return (
    <section id="security" ref={root} className="sec" aria-labelledby="sec-title">
      <div className="wrap sec__grid">
        <div className="sec__text">
          <p className="label mono">
            <span>(05)</span> {security.label}
          </p>
          <h2 id="sec-title" className="h2">
            <Scramble text={security.title} /> <em className="hl">{security.em}</em>
          </h2>
          <p className="sec__lede">{security.text}</p>
          <dl className="sec__points">
            {security.points.map((p) => (
              <div key={p.k} className="sec__point">
                <dt className="mono">{p.k}</dt>
                <dd>{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="vault" aria-hidden="true">
          <svg viewBox="-220 -220 440 440">
            <Ring r={210} ticks={120} className="vault__r1" />
            <Ring r={165} ticks={72} className="vault__r2" />
            <Ring r={120} ticks={40} className="vault__r3" />
            <g className="vault__lock">
              <rect x="-34" y="-8" width="68" height="56" rx="2" />
              <path d="M-20 -8 V-30 a20 20 0 0 1 40 0 V-8" />
              <circle cx="0" cy="16" r="6" />
              <line x1="0" y1="22" x2="0" y2="34" />
            </g>
          </svg>
          <ul className="vault__keys mono">
            {keys.map((k, i) => (
              <li key={i}>
                <span>0x</span>
                {k}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
