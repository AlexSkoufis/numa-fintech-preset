'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import { MQ } from '@/lib/motion';

const GLYPHS = '01<>/#%$€£¥+=_·ABCDEFXYZ';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** 'view' decodes when scrolled into view, 'mount' immediately. */
  trigger?: 'view' | 'mount';
  delay?: number; // seconds
  speed?: number; // seconds per character of stagger
};

/**
 * Decodes text from random glyphs into the final string. Screen readers get the final
 * text via aria-label; reduced-motion users just see the text.
 */
export default function Scramble({ text, as: Tag = 'span', className = '', trigger = 'view', delay = 0, speed = 0.028 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(MQ.motion).matches) {
      setOn(true);
      return;
    }
    let raf = 0;
    const start = () => {
      setOn(true);
      const t0 = performance.now() + delay * 1000;
      const chars = [...text];
      const tick = (now: number) => {
        const t = (now - t0) / 1000;
        let done = true;
        const s = chars
          .map((c, i) => {
            if (c === ' ') return ' ';
            const resolveAt = i * speed + 0.25;
            if (t >= resolveAt) return c;
            done = false;
            return t < 0 && i > 0 ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join('');
        setOut(s);
        if (!done) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (trigger === 'mount') {
      start();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, trigger, delay, speed]);

  return (
    <Tag ref={ref} className={`scramble${on ? ' is-on' : ''} ${className}`} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
