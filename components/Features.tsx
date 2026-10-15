'use client';

import { useEffect, useRef, useState } from 'react';
import { features } from '@/lib/content';
import { gsap, useGsap, MQ, walk } from '@/lib/motion';

const YIELD = walk(40, 5, 0.03).map((v, i) => 0.15 + (i / 39) * 0.6 + v * 0.2);

function FxVisual() {
  const [r, setR] = useState(1.0864);
  const [dir, setDir] = useState(0);
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    const id = window.setInterval(() => {
      const d = (Math.random() - 0.5) * 0.0006;
      setR((x) => x + d);
      setDir(d >= 0 ? 1 : -1);
    }, 1100);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="fv fv--fx">
      <span className="mono">EUR → USD · mid</span>
      <b className={dir > 0 ? 'up' : dir < 0 ? 'down' : ''}>{r.toFixed(4)}</b>
      <div className="fv__lps">
        {['LP-A', 'LP-B', 'LP-C', 'LP-D', 'LP-E'].map((l, i) => (
          <span key={l} className={i === 2 ? 'best' : ''} style={{ '--w': `${[62, 78, 96, 70, 55][i]}%` } as React.CSSProperties}>
            <em className="mono">{l}</em>
          </span>
        ))}
      </div>
    </div>
  );
}

function RulesVisual() {
  return (
    <svg className="fv fv--rules" viewBox="0 0 420 220" aria-hidden="true">
      <path className="fv__wire" d="M120 60 C 170 60, 170 110, 210 110" />
      <path className="fv__wire" d="M120 160 C 170 160, 170 110, 210 110" />
      <path className="fv__wire fv__wire--hi" d="M300 110 L 340 110" />
      <g className="fv__node">
        <rect x="10" y="40" width="110" height="40" />
        <text x="22" y="65">balance &gt; €5M</text>
      </g>
      <g className="fv__node">
        <rect x="10" y="140" width="110" height="40" />
        <text x="22" y="165">after 17:00 CET</text>
      </g>
      <g className="fv__node fv__node--hi">
        <rect x="210" y="90" width="90" height="40" />
        <text x="228" y="115">sweep</text>
      </g>
      <g className="fv__node">
        <rect x="340" y="90" width="72" height="40" />
        <text x="352" y="115">MMF</text>
      </g>
    </svg>
  );
}

function YieldVisual() {
  const d = YIELD.map((v, i) => `${i ? 'L' : 'M'}${(i / (YIELD.length - 1)) * 400},${(1 - v) * 200}`).join('');
  return (
    <svg className="fv fv--yield" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d}L400,200L0,200Z`} className="fv__area" />
      <path d={d} className="fv__line" pathLength={1} />
    </svg>
  );
}

function ReconVisual() {
  const rows = [
    ['INV-4471', 'Aster Logistics', '€84,210.00'],
    ['INV-4480', 'Kiln Studio', '£41,950.55'],
    ['PO-2231', 'Tessel Retail', '$318,400.00'],
    ['INV-9120', 'Harbor Freight', '¥6,400,000'],
  ];
  return (
    <ul className="fv fv--recon mono" aria-hidden="true">
      {rows.map((r, i) => (
        <li key={r[0]} style={{ '--i': i } as React.CSSProperties}>
          <span>{r[0]}</span>
          <span>{r[1]}</span>
          <span>{r[2]}</span>
          <i>✓</i>
        </li>
      ))}
    </ul>
  );
}

const VISUAL: Record<string, () => React.ReactElement> = { fx: FxVisual, rules: RulesVisual, yield: YieldVisual, recon: ReconVisual };

/** 04 — Platform. Desktop: a pinned horizontal strip driven by vertical scroll. Mobile: stacked. */
export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      const track = root.current!.querySelector<HTMLElement>('.hz__track')!;
      root.current!.classList.add('is-js'); // visuals animate only while their panel is centred
      const dist = () => track.scrollWidth - window.innerWidth;
      root.current!.style.height = `${dist() + window.innerHeight}px`;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => (root.current!.style.height = `${dist() + window.innerHeight}px`),
        },
      });
      gsap.utils.toArray<HTMLElement>('.hz__panel').forEach((p) => {
        gsap.from(p.querySelectorAll('.hz__reveal'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 80%', toggleActions: 'play none none reverse' },
        });
        markActive(p, tween);
      });
      return () => {
        root.current!.style.height = '';
        root.current!.classList.remove('is-js');
      };
    });
  });

  return (
    <section id="platform" ref={root} className="hz" aria-labelledby="hz-title">
      <div className="hz__sticky">
        <div className="hz__track">
          <header className="hz__intro">
            <p className="label mono">
              <span>(04)</span> {features.label}
            </p>
            <h2 id="hz-title" className="h2">
              Four engines,
              <br />
              <em className="hl">one ledger.</em>
            </h2>
            <p className="hz__hint mono" aria-hidden="true">
              Scroll <i>→</i>
            </p>
          </header>
          {features.items.map((f) => {
            const V = VISUAL[f.kind];
            return (
              <article key={f.no} className="hz__panel">
                <div className="hz__top hz__reveal">
                  <span className="mono">{f.no}</span>
                  <h3>{f.title}</h3>
                </div>
                <div className="hz__visual hz__reveal">
                  <V />
                </div>
                <div className="hz__bottom">
                  <p className="hz__reveal">{f.text}</p>
                  <p className="hz__stat hz__reveal">
                    <b>{f.stat}</b>
                    <span className="mono">{f.statLabel}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Marks a panel "active" while it is centred, so its CSS animations run only then.
function markActive(panel: HTMLElement, containerAnimation: gsap.core.Tween) {
  gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      containerAnimation,
      start: 'left 70%',
      end: 'right 30%',
      toggleClass: 'is-active',
    },
  });
}
