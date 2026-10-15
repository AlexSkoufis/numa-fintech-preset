# Numa — Fintech Concept Preset

An ultra-modern homepage concept for a **fictional** real-time treasury platform. Data is the imagery: there are no photos, and every visual is generated in code.

Next.js 15 (static export) · GSAP 3 + ScrollTrigger · Lenis · Canvas 2D · plain CSS. No UI libraries.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
npm run map      # regenerate lib/map-dots.json (only if you change the map grid)
```

## Signature pieces

| Section | What it does |
|---|---|
| Hero | Particle "liquidity" chart: ~1,500 particles settle around a live random-walk price series that glides left; the cursor parts the stream. Decoding headline, live "settled today" counter, simulated FX tape. |
| Statement | Manifesto sentence brightens word by word with scroll. |
| Product | A pinned stage where scroll moves a camera across a live dashboard built in code — consolidate → convert → automate — dimming everything outside the focus. Transactions stream in. |
| Global rails | Dot-matrix world map sampled from Natural Earth land (world-atlas), with animated payment routes and local hub clocks. |
| Platform | Pinned horizontal strip of four engines, each with its own live visual (FX quote, rule graph, yield curve, reconciliation ticks). |
| Security | Vault-dial rings counter-rotate with scroll; key material scrambles. |
| Developers | Tabbed SDK snippet (Node / Python / cURL) types itself out, then the JSON response streams back. Copy button. |
| Numbers | Bento grid with count-ups, latency histogram, 90-day uptime strip, testimonial. |
| Access / Footer | Oversized CTA with demo form; live open/closed status for five exchanges; outlined wordmark. |

Cursor: a chart crosshair with a live coordinate readout; turns into a label over interactive elements (fine pointers only).

## Re-skin

- **Copy & data** — `lib/content.ts` (brand, nav, tape pairs, hero stats, product accounts/transactions, cities/routes, features, security, API snippets, metrics, exchanges, footer).
- **Colour** — tokens at the top of `app/globals.css`; `--hi` is the single accent. The canvases use the same lime (`HI` in `FlowChart.tsx`, `#c6ff3d` in `Rails.tsx`).
- **Type** — Geist + Geist Mono in `app/layout.tsx`.

## Behaviour notes

- Canvases pause when off-screen and render a single still frame under `prefers-reduced-motion`; pinning, scrubbing, counters and typing are disabled there too.
- Numbers start from fixed values (identical on server and client) and only start moving after load.
- Exchange status uses weekday trading hours in each exchange's time zone; holidays are ignored.

## Demo content

Numa, its customers, figures, prices and the testimonial are fictional; FX rates and counters are simulated.

## Testing with Reel Studio

This project is the test site for [Reel Studio](https://github.com/CoreConceptsDesign/reel-studio).

1. Clone this repository next to `reel-studio` and run `npm install` here once.
2. Start Reel Studio (`Reel Studio.cmd` on Windows, `Reel Studio.command` on Mac), choose this folder and click **Prepare**.
3. Try **Preview frames** / **Render video** for a reel, and **Make brand kit** at the bottom of the page for the brand guide.

Reel Studio writes its output next to this folder (`numa-preset-reel`, `numa-preset-brand-kit`), never into it.
