'use client';

import { useRef } from 'react';
import { statement } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';

/** Manifesto sentence; words brighten one by one as the reader scrolls through it. */
export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const words = statement.split(' ');

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        '.st-word',
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '.statement__text', start: 'top 78%', end: 'bottom 45%', scrub: true } },
      );
      gsap.from('.statement__rule', { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
    });
  });

  return (
    <section ref={root} className="statement wrap" aria-label="Why Numa">
      <span className="statement__rule" aria-hidden="true" />
      <p className="statement__meta mono">
        <span>(01)</span>
        <span>Why real time</span>
      </p>
      <p className="statement__text">
        {words.map((w, i) => (
          <span key={i} className={`st-word${/millisecond|idle,|stranded,|unaccounted/.test(w) ? ' hl' : ''}`}>
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
