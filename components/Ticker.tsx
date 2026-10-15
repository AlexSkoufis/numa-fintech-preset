'use client';

import { useEffect, useState } from 'react';
import { tape } from '@/lib/content';

type Quote = { pair: string; price: number; chg: number; dir: 1 | -1 | 0 };

const decimals = (base: number) => (base > 50 ? 2 : base > 5 ? 3 : 4);

/** Simulated FX tape. Starts at deterministic values, then drifts every ~1.2s. */
export default function Ticker() {
  const [quotes, setQuotes] = useState<Quote[]>(() => tape.map((t) => ({ pair: t.pair, price: t.base, chg: 0, dir: 0 })));

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuotes((qs) =>
        qs.map((q, i) => {
          if (Math.random() > 0.45) return { ...q, dir: 0 };
          const base = tape[i].base;
          const step = (Math.random() - 0.5) * base * 0.0006;
          const price = q.price + step;
          return { ...q, price, chg: ((price - base) / base) * 100, dir: step >= 0 ? 1 : -1 };
        }),
      );
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  const row = (hidden: boolean) => (
    <ul className="tape__row" aria-hidden={hidden || undefined}>
      {quotes.map((q) => (
        <li key={q.pair} className={q.dir > 0 ? 'up' : q.dir < 0 ? 'down' : ''}>
          <b>{q.pair}</b>
          <span className="tape__px">{q.price.toFixed(decimals(tape.find((t) => t.pair === q.pair)!.base))}</span>
          <span className={`tape__chg ${q.chg >= 0 ? 'pos' : 'neg'}`}>
            {q.chg >= 0 ? '▲' : '▼'} {Math.abs(q.chg).toFixed(2)}%
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="tape mono" role="region" aria-label="Simulated FX rates">
      <div className="tape__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
