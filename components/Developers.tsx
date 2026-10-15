'use client';

import { useEffect, useRef, useState } from 'react';
import { developers } from '@/lib/content';
import { MQ, useInView } from '@/lib/motion';
import Scramble from './Scramble';

type Lang = keyof typeof developers.snippets;
const LANGS = Object.keys(developers.snippets) as Lang[];

// Tiny highlighter: strings, keywords, numbers, flags/keys. Enough for a showcase.
const TOKEN = /("[^"]*"|'[^']*'|`[^`]*`|\b(?:import|from|const|await|new|process|curl|def|os)\b|\b\d+(?:\.\d+)?\b|-[dH]\b|[{}()[\]]|\w+(?=\s*[:=]\s)|\w+(?=\())/g;
function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of src.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(src.slice(last, i));
    const t = m[0];
    const cls = /^["'`]/.test(t) ? 's' : /^\d/.test(t) ? 'n' : /^[{}()[\]]$/.test(t) ? 'p' : /^(import|from|const|await|new|def|curl)$/.test(t) ? 'k' : /^-[dH]$/.test(t) ? 'f' : 'a';
    out.push(
      <span key={k++} className={`tk-${cls}`}>
        {t}
      </span>,
    );
    last = i + t.length;
  }
  out.push(src.slice(last));
  return out;
}

/** 06 — Developers. The request types itself out, then the response streams back line by line. */
export default function Developers() {
  const [lang, setLang] = useState<Lang>('Node');
  const [n, setN] = useState(Infinity);
  const [resp, setResp] = useState(Infinity);
  const [copied, setCopied] = useState(false);
  const win = useRef<HTMLDivElement>(null);
  const inView = useInView(win, '-15% 0px');
  const started = useRef(false);
  const code = developers.snippets[lang];
  const respLines = developers.response.split('\n');

  const run = () => {
    if (!window.matchMedia(MQ.motion).matches) {
      setN(Infinity);
      setResp(Infinity);
      return;
    }
    setN(0);
    setResp(0);
  };

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (n === Infinity) return;
    if (n < code.length) {
      const id = window.setTimeout(() => setN((x) => Math.min(code.length, x + 3)), 14);
      return () => window.clearTimeout(id);
    }
    if (resp < respLines.length) {
      const id = window.setTimeout(() => setResp((x) => x + 1), resp === 0 ? 420 : 90);
      return () => window.clearTimeout(id);
    }
  }, [n, resp, code.length, respLines.length]);

  const shown = n === Infinity ? code : code.slice(0, n);
  const typing = n !== Infinity && n < code.length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="developers" className="dev" aria-labelledby="dev-title">
      <div className="wrap dev__grid">
        <div className="dev__text">
          <p className="label mono">
            <span>(06)</span> {developers.label}
          </p>
          <h2 id="dev-title" className="h2">
            <Scramble text={developers.title} /> <em className="hl">{developers.em}</em>
          </h2>
          <p className="dev__lede">{developers.text}</p>
          <ul className="dev__endpoints mono">
            {developers.endpoints.map((e) => {
              const [m, p] = e.split(' ');
              return (
                <li key={e}>
                  <b className={m === 'GET' ? 'get' : 'post'}>{m}</b> {p}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="code" ref={win}>
          <div className="code__bar">
            <span className="code__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div className="code__tabs" role="tablist" aria-label="Language">
              {LANGS.map((l) => (
                <button
                  key={l}
                  role="tab"
                  aria-selected={l === lang}
                  className={l === lang ? 'on' : ''}
                  onClick={() => {
                    setLang(l);
                    started.current = true;
                    run();
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <button className="code__copy mono" onClick={copy} data-cursor="COPY">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="code__body mono" aria-label={`${lang} example`}>
            <code>
              {highlight(shown)}
              {typing && <span className="code__caret" aria-hidden="true" />}
            </code>
          </pre>
          <div className={`code__resp mono${resp > 0 ? ' is-on' : ''}`}>
            <p className="code__status">
              <span className="ok">200 OK</span> · 212 ms
            </p>
            <pre>
              <code>{highlight(respLines.slice(0, resp === Infinity ? undefined : resp).join('\n'))}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
