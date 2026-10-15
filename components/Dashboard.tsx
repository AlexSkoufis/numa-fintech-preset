'use client';

import { useEffect, useRef, useState } from 'react';
import { product } from '@/lib/content';
import { walk, fmt, MQ } from '@/lib/motion';
import { Mark } from './Nav';

// Deterministic chart paths (same on server and client).
const path = (pts: number[], w: number, h: number, pad = 2) =>
  pts.map((v, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * w).toFixed(1)},${(pad + (1 - v) * (h - pad * 2)).toFixed(1)}`).join('');
const MAIN = walk(90, 11, 0.05);
const SPARKS = product.accounts.map((_, i) => walk(32, 20 + i, 0.09));

const time = (d: Date) => d.toLocaleTimeString('en-GB', { hour12: false });

type Tx = (typeof product.transactions)[number] & { id: number; t: string };

/** The product UI, built in code at a fixed 1120px design width and scaled by its parent. */
export default function Dashboard() {
  const total = useRef<HTMLSpanElement>(null);
  const rate = useRef<HTMLSpanElement>(null);
  const [txs, setTxs] = useState<Tx[]>(() =>
    product.transactions.slice(0, 5).map((t, i) => ({ ...t, id: i, t: `09:4${5 - i}:0${i}` })),
  );

  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    let v = 38_910_442.18;
    let r = 1.0864;
    let n = 5;
    const fast = window.setInterval(() => {
      v += (Math.random() - 0.42) * 9000;
      r += (Math.random() - 0.5) * 0.0002;
      if (total.current) total.current.textContent = fmt(v);
      if (rate.current) rate.current.textContent = r.toFixed(4);
    }, 400);
    const slow = window.setInterval(() => {
      // Capture id/time now: the state updater runs later (and twice in Strict Mode),
      // so reading the shared counter inside it produced duplicate keys.
      const id = n++;
      const row = { ...product.transactions[id % product.transactions.length], id, t: time(new Date()) };
      setTxs((prev) => [row, ...prev.filter((t) => t.id !== id)].slice(0, 5));
    }, 2400);
    return () => {
      window.clearInterval(fast);
      window.clearInterval(slow);
    };
  }, []);

  return (
    <div className="dash" aria-hidden="true">
      <aside className="dash__side">
        <div className="dash__brand">
          <Mark size={16} /> Numa
        </div>
        <ul>
          {['Overview', 'Accounts', 'FX', 'Payments', 'Rules', 'Reports'].map((l, i) => (
            <li key={l} className={i === 0 ? 'on' : ''}>
              {l}
            </li>
          ))}
        </ul>
        <div className="dash__entity">
          <span>Entity</span>
          <b>Aster Group · 6</b>
        </div>
      </aside>

      <div className="dash__main">
        <section className="dash__card dash__total" data-region="consolidate">
          <header>
            <span>Total balance · EUR equivalent</span>
            <span className="dash__tabs">
              <i>1D</i>
              <i className="on">1W</i>
              <i>1M</i>
              <i>1Y</i>
            </span>
          </header>
          <p className="dash__big">
            €<span ref={total}>38,910,442.18</span>
            <em className="pos">▲ 1.84%</em>
          </p>
          <svg viewBox="0 0 700 150" preserveAspectRatio="none" className="dash__area">
            <defs>
              <linearGradient id="dash-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="rgb(198,255,61)" stopOpacity="0.28" />
                <stop offset="1" stopColor="rgb(198,255,61)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path(MAIN, 700, 150, 8)}L700,150L0,150Z`} fill="url(#dash-fill)" />
            <path d={path(MAIN, 700, 150, 8)} fill="none" stroke="rgb(198,255,61)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </section>

        <div className="dash__accounts" data-region="consolidate">
          {product.accounts.map((a, i) => (
            <section key={a.ccy} className="dash__card dash__acc">
              <header>
                <span className="dash__ccy">
                  <i>{a.flag}</i>
                  {a.ccy}
                </span>
                <em className={a.change >= 0 ? 'pos' : 'neg'}>
                  {a.change >= 0 ? '+' : ''}
                  {a.change}%
                </em>
              </header>
              <b>{fmt(a.balance, undefined, a.ccy === 'JPY' ? 0 : 2)}</b>
              <svg viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d={path(SPARKS[i], 200, 40)} fill="none" stroke={a.change >= 0 ? 'rgb(198,255,61)' : 'rgb(255,110,84)'} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
              </svg>
            </section>
          ))}
        </div>

        <section className="dash__card dash__fx" data-region="convert">
          <header>
            <span>Convert</span>
            <span className="dash__live">live</span>
          </header>
          <div className="dash__fx-row">
            <span>
              <small>Sell</small>
              <b>250,000.00</b> EUR
            </span>
            <span className="dash__swap">⇄</span>
            <span>
              <small>Buy</small>
              <b>271,600.00</b> USD
            </span>
          </div>
          <p className="dash__rate">
            1 EUR = <span ref={rate}>1.0864</span> USD <em>· best of 11 LPs</em>
          </p>
          <div className="dash__btn">Convert now</div>
        </section>

        <section className="dash__card dash__rules" data-region="automate">
          <header>
            <span>Rules</span>
            <span>3 active</span>
          </header>
          <ul>
            <li>
              <span>Sweep idle EUR &gt; €5M → Yield</span>
              <i className="tgl on" />
            </li>
            <li>
              <span>Hedge USD exposure &gt; 20%</span>
              <i className="tgl on" />
            </li>
            <li>
              <span>Pay approved invoices at 16:00</span>
              <i className="tgl on" />
            </li>
          </ul>
        </section>

        <section className="dash__card dash__tx" data-region="automate">
          <header>
            <span>Transactions</span>
            <span className="dash__live">streaming</span>
          </header>
          <ul>
            {txs.map((t) => (
              <li key={t.id}>
                <span className="dash__t">{t.t}</span>
                <span className="dash__who">
                  {t.who}
                  <small>{t.what}</small>
                </span>
                <b className={t.amount >= 0 ? 'pos' : ''}>
                  {t.amount >= 0 ? '+' : '−'}
                  {fmt(Math.abs(t.amount), t.ccy, t.ccy === 'JPY' ? 0 : 2)}
                </b>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
