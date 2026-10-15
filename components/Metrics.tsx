'use client';

import { useRef } from 'react';
import { metrics } from '@/lib/content';
import { gsap, useGsap, MQ, rng } from '@/lib/motion';

const r = rng(42);
const LATENCY = Array.from({ length: 28 }, (_, i) => Math.round(Math.exp(-((i - 7) ** 2) / 26) * 90 + r() * 8 + 4));
const UPTIME = Array.from({ length: 90 }, (_, i) => (i === 57 ? 0.6 : i === 23 ? 0.85 : 1));

function Chart({ kind }: { kind?: string }) {
  if (kind === 'latency')
    return (
      <div className="bars" aria-hidden="true">
        {LATENCY.map((v, i) => (
          <i key={i} style={{ '--h': `${v}%` } as React.CSSProperties} className={i === 7 ? 'hi' : ''} />
        ))}
      </div>
    );
  if (kind === 'uptime')
    return (
      <div className="uptime" aria-hidden="true">
        {UPTIME.map((v, i) => (
          <i key={i} className={v < 1 ? (v < 0.7 ? 'bad' : 'warn') : ''} />
        ))}
      </div>
    );
  return null;
}

/** 07 — Numbers bento. Values count up on entry; charts draw in. */
export default function Metrics() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>('.tile__v', root.current).forEach((el) => {
        const end = Number(el.dataset.v);
        const dec = Number(el.dataset.d);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => (el.textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })),
        });
      });
      gsap.from('.tile', { autoAlpha: 0, y: 30, stagger: 0.06, duration: 1.1, scrollTrigger: { trigger: '.bento', start: 'top 85%', once: true } });
      gsap.from('.bars i', { scaleY: 0, transformOrigin: 'bottom', stagger: 0.02, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.bars', start: 'top 90%', once: true } });
      gsap.from('.uptime i', { autoAlpha: 0, stagger: 0.008, duration: 0.3, scrollTrigger: { trigger: '.uptime', start: 'top 92%', once: true } });
    });
  });

  return (
    <section ref={root} className="metrics wrap" aria-labelledby="metrics-title">
      <p className="label mono">
        <span>(07)</span> <span id="metrics-title">{metrics.label}</span>
      </p>
      <div className="bento">
        {metrics.items.map((m) => (
          <div key={m.label} className={`tile tile--${m.size}`}>
            <p className="tile__num">
              <span className="tile__v" data-v={m.value} data-d={m.decimals ?? 0}>
                {m.value.toLocaleString('en-US', { minimumFractionDigits: m.decimals ?? 0, maximumFractionDigits: m.decimals ?? 0 })}
              </span>
              <span className="tile__s">{m.suffix}</span>
            </p>
            <p className="tile__l mono">{m.label}</p>
            <Chart kind={m.chart} />
          </div>
        ))}
        <figure className="tile tile--quote">
          <blockquote>“{metrics.quote.text}”</blockquote>
          <figcaption className="mono">
            <b>{metrics.quote.who}</b> — {metrics.quote.role}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
