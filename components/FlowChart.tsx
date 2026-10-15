'use client';

import { useEffect, useRef } from 'react';
import { fitCanvas, useInView, MQ } from '@/lib/motion';

type P = { x: number; y: number; v: number; off: number; hi: boolean };

const BG = '8, 9, 11';
const HI = '198, 255, 61';

/**
 * A price chart made of liquidity: particles stream left→right and settle into a band
 * around a live random-walk series. New prices arrive every ~0.9s and the whole curve
 * glides left. The cursor parts the stream. Paused off-screen; static for reduced motion.
 */
export default function FlowChart({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const state = useRef<{ running: boolean }>({ running: false });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia(MQ.reduced).matches;
    let { ctx, w, h } = fitCanvas(canvas);
    const N = 140;
    // Series state (random walk with momentum)
    let m = 0;
    let v = 0.5;
    const next = () => {
      m = m * 0.86 + (Math.random() - 0.5) * 0.05 + (0.5 - v) * 0.004;
      v = Math.min(0.95, Math.max(0.05, v + m));
      return v;
    };
    const series: number[] = [];
    for (let i = 0; i < N; i++) series.push(next());
    let phase = 0; // 0..1 progress towards the next shift
    const SHIFT_MS = 900;

    const top = () => h * (w < 700 ? 0.18 : 0.36);
    const bottom = () => h * (w < 700 ? 0.86 : 0.84);
    const yAt = (x: number) => {
      const f = (x / w) * (N - 2) + phase;
      const i = Math.max(0, Math.min(N - 2, Math.floor(f)));
      const t = f - i;
      const a = series[i];
      const b = series[i + 1];
      const s = a + (b - a) * (t * t * (3 - 2 * t));
      return bottom() - s * (bottom() - top());
    };

    const count = w < 700 ? 520 : 1500;
    // On wide screens the stream fades in from the left so it never competes with the copy.
    const wide = w >= 1024;
    const fade = (x: number) => {
      if (!wide) return 1;
      const t = Math.min(1, Math.max(0, (x - w * 0.22) / (w * 0.4)));
      return 0.12 + 0.88 * t * t * (3 - 2 * t);
    };
    const rand = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; // ~gaussian
    const ps: P[] = Array.from({ length: count }, () => spawn(Math.random() * w));
    function spawn(x = -Math.random() * 40): P {
      const off = rand() * (Math.random() < 0.8 ? 16 : 70);
      return { x, y: yAt(Math.max(0, x)) + off, v: 0.6 + Math.random() * 1.6, off, hi: Math.abs(off) < 7 };
    }

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const onResize = () => {
      ({ ctx, w, h } = fitCanvas(canvas));
      ctx.fillStyle = `rgb(${BG})`;
      ctx.fillRect(0, 0, w, h);
    };
    window.addEventListener('resize', onResize);
    ctx.fillStyle = `rgb(${BG})`;
    ctx.fillRect(0, 0, w, h);

    let last = performance.now();
    const step = (now: number, draw = true) => {
      const dt = Math.min(48, now - last);
      last = now;
      phase += dt / SHIFT_MS;
      while (phase >= 1) {
        phase -= 1;
        series.shift();
        series.push(next());
      }
      if (!draw) {
        for (const p of ps) advance(p, dt);
        return;
      }
      ctx.fillStyle = `rgba(${BG}, 0.2)`;
      ctx.fillRect(0, 0, w, h);
      for (const p of ps) {
        advance(p, dt);
        const alpha = (p.hi ? 0.9 : Math.max(0.08, 0.5 - Math.abs(p.off) / 140)) * fade(p.x);
        ctx.fillStyle = p.hi ? `rgba(${HI}, ${alpha})` : `rgba(236, 238, 233, ${alpha})`;
        ctx.fillRect(p.x, p.y, p.hi ? 1.6 : 1.2, p.hi ? 1.6 : 1.2);
      }
      // Precise line on top, with the "last price" marker at the live edge.
      const edge = w * (w < 700 ? 0.74 : 0.8);
      ctx.beginPath();
      for (let x = 0; x <= edge; x += 6) {
        const y = yAt(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(0, 0, edge, 0);
      grad.addColorStop(0, `rgba(${HI}, 0)`);
      grad.addColorStop(wide ? 0.55 : 0.1, `rgba(${HI}, 0.12)`);
      grad.addColorStop(1, `rgba(${HI}, 0.6)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
      const ey = yAt(edge);
      ctx.fillStyle = `rgb(${HI})`;
      ctx.beginPath();
      ctx.arc(edge, ey, 3.2, 0, Math.PI * 2);
      ctx.fill();
      if (tag.current) {
        tag.current.style.transform = `translate(${edge + 14}px, ${ey - 11}px)`;
        const val = 100 + (1 - (ey - top()) / (bottom() - top())) * 28;
        tag.current.firstElementChild!.textContent = val.toFixed(2);
      }
    };
    function advance(p: P, dt: number) {
      const k = dt / 16.7;
      p.x += p.v * k * 1.4;
      const target = yAt(p.x) + p.off;
      p.y += (target - p.y) * 0.06 * k + (Math.random() - 0.5) * 0.6;
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 130 * 130) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / 130) * 6 * k;
        p.x += (dx / d) * f * 0.4;
        p.y += (dy / d) * f;
      }
      if (p.x > w + 4) Object.assign(p, spawn());
    }

    let raf = 0;
    const loop = (now: number) => {
      step(now);
      raf = requestAnimationFrame(loop);
    };
    state.current.running = false;

    if (reduced) {
      // Settle the simulation, then paint a single still frame.
      let t = performance.now();
      last = t;
      for (let i = 0; i < 240; i++) step((t += 16), i > 200);
    } else if (inView) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
      state.current.running = true;
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [inView]);

  return (
    <div className={`flow ${className}`} aria-hidden="true">
      <canvas ref={ref} className="flow__canvas" />
      <div ref={tag} className="flow__tag mono">
        <b>118.42</b>
        <span>NUMA LIQ</span>
      </div>
    </div>
  );
}
