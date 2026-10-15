'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, MQ } from '@/lib/motion';

/**
 * Chart crosshair: two short hairlines, a centre point and a live coordinate readout,
 * like hovering a price chart. Over `[data-cursor]` elements the readout becomes a label.
 * Fine pointers only.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const mq = window.matchMedia(`${MQ.fine} and ${MQ.motion}`);
    const set = () => setEnabled(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    document.documentElement.classList.add('has-cursor');
    const x = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-visible');
      }
      x(e.clientX);
      y(e.clientY);
      if (readout.current) {
        const px = (e.clientX / window.innerWidth).toFixed(3);
        const py = (1 - e.clientY / window.innerHeight).toFixed(3);
        readout.current.textContent = `${px} · ${py}`;
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>('[data-cursor]');
      setLabel(t?.dataset.cursor ?? '');
    };
    const leave = () => {
      shown = false;
      el.classList.remove('is-visible');
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className={`xh${label ? ' has-label' : ''}`} aria-hidden="true">
      <i className="xh__h" />
      <i className="xh__v" />
      <i className="xh__dot" />
      <span className="xh__read mono" ref={readout} />
      <span className="xh__label mono">{label}</span>
    </div>
  );
}
