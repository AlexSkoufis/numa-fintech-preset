'use client';

import { useEffect, useRef } from 'react';
import { hero } from '@/lib/content';
import { gsap, useGsap, MQ, fmt } from '@/lib/motion';
import FlowChart from './FlowChart';
import Scramble from './Scramble';
import Magnetic from './Magnetic';
import Ticker from './Ticker';

/** Live counter written straight to the DOM (no re-renders); ticks ~12×/s. */
function Counter() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    let v = hero.counterStart;
    const id = window.setInterval(() => {
      v += Math.random() * 38_000 + 4_000;
      if (ref.current) ref.current.textContent = fmt(v, undefined, 0);
    }, 85);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span ref={ref} className="hero__count-v">
      {fmt(hero.counterStart, undefined, 0)}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.timeline({ delay: 0.2 })
        .from('.hero__eyebrow', { autoAlpha: 0, y: 12, duration: 0.9 })
        .from('.hero__lede, .hero__ctas', { autoAlpha: 0, y: 24, stagger: 0.1, duration: 1.2 }, 0.55)
        .from('.hero__count, .hero__stat', { autoAlpha: 0, y: 18, stagger: 0.06, duration: 1 }, 0.8)
        .from('.hero .tape', { autoAlpha: 0, duration: 1 }, 1);
      // Leaving the hero: copy lifts and fades while the chart keeps running underneath.
      gsap.to('.hero__inner', {
        yPercent: -12,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
  });

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <FlowChart className="hero__flow" />
      <div className="hero__inner wrap">
        <p className="hero__eyebrow mono">
          <span className="live" aria-hidden="true" /> {hero.eyebrow}
        </p>
        <h1 id="hero-title" className="hero__title">
          <Scramble text={hero.title[0]} trigger="mount" delay={0.1} className="hero__l1" />
          <Scramble text={hero.title[1]} trigger="mount" delay={0.35} className="hero__l2" />
        </h1>
        <p className="hero__lede">{hero.lede}</p>
        <div className="hero__ctas">
          <Magnetic href="#access">{hero.primary}</Magnetic>
          <Magnetic href="#developers" variant="ghost">
            {hero.secondary}
          </Magnetic>
        </div>
      </div>

      <div className="hero__foot wrap">
        <p className="hero__count">
          <span className="mono hero__count-k">{hero.counterLabel}</span>
          <span className="hero__count-row">
            <span className="hero__ccy">€</span>
            <Counter />
          </span>
        </p>
        <dl className="hero__stats">
          {hero.stats.map((s) => (
            <div key={s.k} className="hero__stat">
              <dt className="mono">{s.k}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Ticker />
    </section>
  );
}
