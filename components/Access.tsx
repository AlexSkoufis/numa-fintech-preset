'use client';

import { useRef, useState } from 'react';
import { cta } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';

/** 08 — Request access. Oversized type sweeps in from both sides; the form is a demo. */
export default function Access() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const st = { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 0.8 };
      gsap.fromTo('.access__l1', { xPercent: -18 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.access__l2', { xPercent: 18 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
      gsap.from('.access__line', { scaleX: 0, transformOrigin: 'left', ease: 'none', scrollTrigger: st });
    });
  });

  return (
    <section id="access" ref={root} className="access" aria-labelledby="access-title">
      <div className="wrap">
        <h2 id="access-title" className="access__title">
          <span className="access__l1">{cta.title[0]}</span>
          <span className="access__l2">
            <em className="hl">{cta.title[1]}</em>
          </span>
        </h2>
        <span className="access__line" aria-hidden="true" />
        <div className="access__row">
          <p className="access__text">{cta.text}</p>
          {sent ? (
            <p className="access__thanks mono" role="status">
              {cta.thanks}
            </p>
          ) : (
            <form
              className="access__form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label htmlFor="access-email" className="sr-only">
                {cta.placeholder}
              </label>
              <input id="access-email" type="email" required placeholder={cta.placeholder} autoComplete="email" />
              <button type="submit" className="btn btn--solid" data-cursor="SEND">
                <span className="btn__label">{cta.button}</span>
                <span className="btn__arrow" aria-hidden="true">
                  <i>→</i>
                  <i>→</i>
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
