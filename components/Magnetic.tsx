'use client';

import { useEffect, useRef } from 'react';
import { gsap, MQ } from '@/lib/motion';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { strength?: number; variant?: 'solid' | 'ghost' };

/** Pill-free button that leans toward the cursor (fine pointers only). */
export default function Magnetic({ strength = 0.35, variant = 'solid', className = '', children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(`${MQ.fine} and ${MQ.motion}`).matches) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  return (
    <a ref={ref} className={`btn btn--${variant} ${className}`} data-cursor="OPEN" {...rest}>
      <span className="btn__label">{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        <i>→</i>
        <i>→</i>
      </span>
    </a>
  );
}
