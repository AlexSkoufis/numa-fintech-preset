'use client';

import { useEffect, useRef, useState } from 'react';
import { product } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import Dashboard from './Dashboard';
import Scramble from './Scramble';

const DESIGN_W = 1120;
const DESIGN_H = 700;
const REGIONS = ['consolidate', 'convert', 'automate'] as const;

type Rect = { x: number; y: number; w: number; h: number };

/**
 * 02 — Product. Desktop: a pinned stage where scrolling moves a "camera" across the live
 * dashboard — consolidate → convert → automate — dimming everything outside the focus.
 * Smaller screens / reduced motion: the whole dashboard, scaled to fit, with the steps listed.
 */
export default function Product() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  // Region rectangles in unscaled dashboard coordinates (layout is fixed-px, so measure once).
  const measure = (): Record<string, Rect> => {
    const dash = frame.current!.querySelector<HTMLElement>('.dash')!;
    const prev = dash.style.transform;
    dash.style.transform = 'none';
    const base = dash.getBoundingClientRect();
    const out: Record<string, Rect> = {};
    for (const r of REGIONS) {
      const els = [...dash.querySelectorAll<HTMLElement>(`[data-region="${r}"]`)].map((e) => e.getBoundingClientRect());
      const x0 = Math.min(...els.map((e) => e.left)) - base.left;
      const y0 = Math.min(...els.map((e) => e.top)) - base.top;
      const x1 = Math.max(...els.map((e) => e.right)) - base.left;
      const y1 = Math.max(...els.map((e) => e.bottom)) - base.top;
      out[r] = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }
    dash.style.transform = prev;
    return out;
  };

  const overview = () => {
    const f = frame.current!;
    const s = Math.min(f.clientWidth / DESIGN_W, f.clientHeight / DESIGN_H) * 0.96;
    return { scale: s, x: (f.clientWidth - DESIGN_W * s) / 2, y: (f.clientHeight - DESIGN_H * s) / 2 };
  };
  const focus = (r: Rect) => {
    const f = frame.current!;
    const s = Math.min((f.clientWidth * 0.9) / r.w, (f.clientHeight * 0.82) / r.h, 1.9);
    return { scale: s, x: f.clientWidth / 2 - (r.x + r.w / 2) * s, y: f.clientHeight / 2 - (r.y + r.h / 2) * s };
  };

  // Static fit for non-pinned layouts; kept in sync with the frame size.
  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    const dash = f.querySelector<HTMLElement>('.dash')!;
    const ro = new ResizeObserver(() => {
      if (root.current?.classList.contains('is-pinned')) return;
      gsap.set(dash, { transformOrigin: '0 0', ...overview() });
    });
    ro.observe(f);
    return () => ro.disconnect();
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      root.current!.classList.add('is-pinned');
      const dash = frame.current!.querySelector<HTMLElement>('.dash')!;
      const R = measure();
      // Function values so every refresh (resize) recomputes the camera for the new frame size.
      const cam = (fn: () => { scale: number; x: number; y: number }) => ({ scale: () => fn().scale, x: () => fn().x, y: () => fn().y });
      gsap.set(dash, { transformOrigin: '0 0', ...overview() });
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        // Runs as the smoothed scrub advances (not only on scroll events), so labels never lag.
        onUpdate: () => {
          const t = tl.time();
          const s = t < 1.3 ? 0 : t < 2.9 ? 1 : 2;
          dash.dataset.focus = t < 0.4 || t > 5.2 ? '' : REGIONS[s];
          if (s !== stepRef.current) {
            stepRef.current = s;
            setStep(s);
          }
        },
      });
      tl.to(dash, { ...cam(() => focus(R.consolidate)), duration: 1 })
        .to({}, { duration: 0.6 })
        .to(dash, { ...cam(() => focus(R.convert)), duration: 1 })
        .to({}, { duration: 0.6 })
        .to(dash, { ...cam(() => focus(R.automate)), duration: 1 })
        .to({}, { duration: 0.6 })
        .to(dash, { ...cam(overview), duration: 0.8 });
      gsap.from('.product__frame', { clipPath: 'inset(12% 12% 12% 12% round 18px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
      return () => {
        root.current?.classList.remove('is-pinned');
        dash.dataset.focus = '';
        gsap.set(dash, overview());
      };
    });
  });

  return (
    <section id="product" ref={root} className="product" aria-labelledby="product-title">
      <div className="product__stage wrap">
        <div className="product__text">
          <p className="label mono">
            <span>(02)</span> {product.label}
          </p>
          <h2 id="product-title" className="h2">
            <Scramble text={product.title} />
            <em className="hl">{product.em}</em>
          </h2>
          <ol className="product__steps">
            {product.steps.map((s, i) => (
              <li key={s.no} className={i === step ? 'is-active' : ''}>
                <span className="mono">{s.no}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
                <i className="product__bar" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
        <div className="product__frame" ref={frame} data-cursor="LIVE">
          <Dashboard />
          <span className="product__corner mono" aria-hidden="true">
            app.numa.example / overview
          </span>
        </div>
      </div>
    </section>
  );
}
