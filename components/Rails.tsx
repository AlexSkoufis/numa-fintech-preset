'use client';

import { useEffect, useRef, useState } from 'react';
import { rails } from '@/lib/content';
import dots from '@/lib/map-dots.json';
import { fitCanvas, useInView, MQ, gsap, useGsap } from '@/lib/motion';
import Scramble from './Scramble';

const LON0 = -168;
const LON_SPAN = 358;
const LAT0 = 78;
const LAT_SPAN = 134;

/** 03 — Global rails: dot-matrix world (Natural Earth land) with live payment routes. */
export default function Rails() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvas);
  const [clock, setClock] = useState<string[]>(() => rails.cities.slice(0, 8).map(() => '--:--'));

  useEffect(() => {
    const tick = () =>
      setClock(
        rails.cities.slice(0, 8).map((c) =>
          new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: c.tz }).format(new Date()),
        ),
      );
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduced = window.matchMedia(MQ.reduced).matches;
    let { ctx, w, h } = fitCanvas(el);
    const px = (lon: number) => ((lon - LON0) / LON_SPAN) * w;
    const py = (lat: number) => ((LAT0 - lat) / LAT_SPAN) * h;
    const nodes = rails.cities.map((c) => ({ ...c, x: 0, y: 0 }));
    const routes = rails.routes.map(([a, b], i) => ({ a, b, speed: 0.00018 + (i % 5) * 0.00005, off: (i * 0.137) % 1 }));
    const place = () => nodes.forEach((n) => ((n.x = px(n.lon)), (n.y = py(n.lat))));
    place();

    const ctrl = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      return { x: mx, y: my - d * 0.28 };
    };
    const bez = (a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
      x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
      y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
    });

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const r = Math.max(0.9, (w / LON_SPAN) * 0.62);
      ctx.fillStyle = 'rgba(236, 238, 233, 0.22)';
      for (const [lon, lat] of dots as [number, number][]) {
        ctx.fillRect(px(lon) - r / 2, py(lat) - r / 2, r, r);
      }
      for (const rt of routes) {
        const a = nodes[rt.a];
        const b = nodes[rt.b];
        const c = ctrl(a, b);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(c.x, c.y, b.x, b.y);
        ctx.strokeStyle = 'rgba(198, 255, 61, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();
        if (reduced) continue;
        const t = (now * rt.speed + rt.off) % 1;
        for (let k = 0; k < 14; k++) {
          const tt = t - k * 0.012;
          if (tt < 0) break;
          const p = bez(a, c, b, tt);
          ctx.fillStyle = `rgba(198, 255, 61, ${(1 - k / 14) * 0.95})`;
          const s = k === 0 ? 2.6 : 1.8;
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        }
      }
      for (const n of nodes) {
        const pulse = reduced ? 0 : ((now / 1600 + n.lon / 90) % 1 + 1) % 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3 + pulse * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(198, 255, 61, ${0.5 * (1 - pulse)})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = '#c6ff3d';
        ctx.fill();
        if (w > 700) {
          ctx.font = '10px "Geist Mono", monospace';
          ctx.fillStyle = 'rgba(236, 238, 233, 0.6)';
          ctx.fillText(n.name.toUpperCase(), n.x + 7, n.y + 3);
        }
      }
    };

    const onResize = () => {
      ({ ctx, w, h } = fitCanvas(el));
      place();
      draw(performance.now());
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    if (reduced || !inView) draw(performance.now());
    else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [inView]);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.rails__map', { autoAlpha: 0, scale: 1.04, duration: 1.8, scrollTrigger: { trigger: '.rails__map', start: 'top 80%', once: true } });
      gsap.from('.rails__hub', { autoAlpha: 0, x: -12, stagger: 0.05, duration: 0.9, scrollTrigger: { trigger: '.rails__hubs', start: 'top 85%', once: true } });
    });
  });

  return (
    <section id="rails" ref={root} className="rails" aria-labelledby="rails-title">
      <div className="wrap rails__head">
        <p className="label mono">
          <span>(03)</span> {rails.label}
        </p>
        <h2 id="rails-title" className="h2">
          <Scramble text={rails.title} /> <em className="hl">{rails.em}</em>
        </h2>
        <p className="rails__text">{rails.text}</p>
      </div>
      <div className="rails__body wrap">
        <div className="rails__map" aria-hidden="true">
          <canvas ref={canvas} />
        </div>
        <ul className="rails__hubs mono" aria-label="Local time at settlement hubs">
          {rails.cities.slice(0, 8).map((c, i) => (
            <li key={c.name} className="rails__hub">
              <span className="dotlive" aria-hidden="true" />
              <span>{c.name}</span>
              <time>{clock[i]}</time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
