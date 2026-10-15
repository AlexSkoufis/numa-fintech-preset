// ─────────────────────────────────────────────────────────────────────────────
//  PRESET CONFIG — Numa, a FICTIONAL real-time treasury platform.
//  All names, figures, quotes and prices are invented / simulated demo content.
//  Colours & type: tokens at the top of app/globals.css.
// ─────────────────────────────────────────────────────────────────────────────

export const brand = {
  name: 'Numa',
  wordmark: 'NUMA',
  tagline: 'The real-time treasury',
  email: 'hello@numa.example',
  credit: { label: 'Core Concepts Design', href: 'https://coreconcepts.design' },
  disclaimer: 'Numa is a fictional company created as a design concept. All figures, prices and quotes are simulated.',
};

export const nav = [
  { label: 'Product', href: '#product' },
  { label: 'Rails', href: '#rails' },
  { label: 'Platform', href: '#platform' },
  { label: 'Security', href: '#security' },
  { label: 'Developers', href: '#developers' },
];

// Ticker tape. Prices are simulated around these bases.
export const tape = [
  { pair: 'EUR/USD', base: 1.0864 },
  { pair: 'GBP/USD', base: 1.2741 },
  { pair: 'USD/JPY', base: 151.42 },
  { pair: 'EUR/GBP', base: 0.8527 },
  { pair: 'USD/CHF', base: 0.9012 },
  { pair: 'AUD/USD', base: 0.6588 },
  { pair: 'USD/SGD', base: 1.3446 },
  { pair: 'EUR/SEK', base: 11.482 },
  { pair: 'USD/BRL', base: 5.0721 },
  { pair: 'USD/AED', base: 3.6725 },
];

export const hero = {
  eyebrow: 'Treasury infrastructure · v4.2',
  title: ['Treasury,', 'in real time.'],
  lede: 'Numa connects every account, currency and payment rail into one programmable balance sheet — updated every millisecond, not every morning.',
  primary: 'Request access',
  secondary: 'Read the docs',
  counterLabel: 'Settled through Numa today',
  counterStart: 2_418_903_112,
  stats: [
    { k: 'Median latency', v: '38 ms' },
    { k: 'Currencies', v: '42' },
    { k: 'Markets', v: '64' },
    { k: 'Uptime, 12 mo.', v: '99.995%' },
  ],
};

export const statement =
  'Finance teams still run on batch files, spreadsheets and end-of-day balances. We built a treasury that updates every millisecond — so cash is never idle, never stranded, and never unaccounted for.';

export const product = {
  label: 'Product',
  title: 'One balance sheet.',
  em: 'Every currency.',
  steps: [
    { no: '01', title: 'Consolidate', text: 'Every bank account, wallet and entity in one live view. Balances stream in as they change — no exports, no reconciliation lag.' },
    { no: '02', title: 'Convert', text: 'Move between 42 currencies at interbank rates, routed across liquidity providers for the best price, settled in seconds.' },
    { no: '03', title: 'Automate', text: 'Write rules once. Sweep surplus cash, hedge exposure and pay suppliers on triggers you define — audited automatically.' },
  ],
  accounts: [
    { ccy: 'EUR', flag: '€', balance: 18_402_551.2, change: 2.4 },
    { ccy: 'USD', flag: '$', balance: 12_955_120.87, change: -0.8 },
    { ccy: 'GBP', flag: '£', balance: 4_310_998.1, change: 1.1 },
    { ccy: 'JPY', flag: '¥', balance: 612_880_400, change: 0.3 },
  ],
  transactions: [
    { who: 'Aster Logistics GmbH', what: 'Invoice 4471', amount: -84_210.0, ccy: 'EUR' },
    { who: 'FX · EUR → USD', what: 'Auto-hedge rule', amount: 250_000.0, ccy: 'USD' },
    { who: 'Kiln Studio Ltd', what: 'Payroll batch', amount: -41_950.55, ccy: 'GBP' },
    { who: 'Sweep → Yield', what: 'Idle cash > €5M', amount: -1_200_000.0, ccy: 'EUR' },
    { who: 'Tessel Retail Inc.', what: 'Settlement', amount: 318_400.0, ccy: 'USD' },
    { who: 'Harbor Freight KK', what: 'Invoice 9120', amount: -6_400_000, ccy: 'JPY' },
    { who: 'Oaken Group', what: 'Card spend', amount: -12_880.4, ccy: 'EUR' },
    { who: 'Fjell Capital AS', what: 'Capital call', amount: 2_000_000, ccy: 'EUR' },
  ],
};

export const rails = {
  label: 'Global rails',
  title: 'Settle across',
  em: '64 markets.',
  text: 'Local rails where they exist, correspondent networks where they don’t — chosen per payment by cost and speed.',
  cities: [
    { name: 'London', lat: 51.5, lon: -0.12, tz: 'Europe/London' },
    { name: 'New York', lat: 40.71, lon: -74.0, tz: 'America/New_York' },
    { name: 'Frankfurt', lat: 50.11, lon: 8.68, tz: 'Europe/Berlin' },
    { name: 'Singapore', lat: 1.35, lon: 103.82, tz: 'Asia/Singapore' },
    { name: 'Tokyo', lat: 35.68, lon: 139.69, tz: 'Asia/Tokyo' },
    { name: 'São Paulo', lat: -23.55, lon: -46.63, tz: 'America/Sao_Paulo' },
    { name: 'Lagos', lat: 6.52, lon: 3.38, tz: 'Africa/Lagos' },
    { name: 'Dubai', lat: 25.2, lon: 55.27, tz: 'Asia/Dubai' },
    { name: 'Sydney', lat: -33.87, lon: 151.21, tz: 'Australia/Sydney' },
    { name: 'Mumbai', lat: 19.08, lon: 72.88, tz: 'Asia/Kolkata' },
    { name: 'Toronto', lat: 43.65, lon: -79.38, tz: 'America/Toronto' },
    { name: 'Mexico City', lat: 19.43, lon: -99.13, tz: 'America/Mexico_City' },
    { name: 'Johannesburg', lat: -26.2, lon: 28.05, tz: 'Africa/Johannesburg' },
    { name: 'Hong Kong', lat: 22.32, lon: 114.17, tz: 'Asia/Hong_Kong' },
    { name: 'Stockholm', lat: 59.33, lon: 18.07, tz: 'Europe/Stockholm' },
    { name: 'Madrid', lat: 40.42, lon: -3.7, tz: 'Europe/Madrid' },
  ],
  // Route pairs by city index.
  routes: [[0, 1], [0, 3], [2, 4], [1, 5], [7, 9], [3, 8], [6, 0], [13, 4], [10, 11], [14, 2], [15, 5], [12, 7], [1, 13], [9, 3], [0, 7], [11, 1]],
};

export const features = {
  label: 'Platform',
  items: [
    { no: '01', title: 'Instant FX', text: 'Interbank rates across 42 currencies, routed to the best of 11 liquidity providers per trade.', stat: '0.04%', statLabel: 'Typical spread', kind: 'fx' },
    { no: '02', title: 'Programmable rules', text: 'If-this-then-that for money. Sweeps, hedges and payouts triggered by balances, dates or events.', stat: '1.2M', statLabel: 'Rules run daily', kind: 'rules' },
    { no: '03', title: 'Yield on idle cash', text: 'Surplus balances move into money-market funds overnight and come back before you need them.', stat: '4.6%', statLabel: 'Indicative APY', kind: 'yield' },
    { no: '04', title: 'Live reconciliation', text: 'Every transaction matched to its invoice, entity and ledger line the moment it settles.', stat: '99.7%', statLabel: 'Auto-matched', kind: 'recon' },
  ],
};

export const security = {
  label: 'Security',
  title: 'Built like',
  em: 'a vault.',
  text: 'Segregated client funds, hardware-backed keys and four-eyes approval on every movement above your threshold.',
  points: [
    { k: 'Encryption', v: 'AES-256 at rest · TLS 1.3 in transit' },
    { k: 'Keys', v: 'FIPS 140-2 Level 3 HSMs' },
    { k: 'Approvals', v: 'Multi-party, policy-based' },
    { k: 'Audit', v: 'Immutable, exportable event log' },
  ],
};

export const developers = {
  label: 'Developers',
  title: 'An API',
  em: 'for money.',
  text: 'Everything in the dashboard is an endpoint. Idempotent, versioned and typed — with webhooks for every state change.',
  endpoints: ['POST /v4/transfers', 'POST /v4/fx/quotes', 'GET /v4/balances', 'POST /v4/rules', 'GET /v4/events'],
  snippets: {
    Node: `import { Numa } from '@numa/sdk';

const numa = new Numa(process.env.NUMA_KEY);

const transfer = await numa.transfers.create({
  from: 'acc_eur_ops',
  to: 'ben_aster_gmbh',
  amount: { value: '84210.00', currency: 'EUR' },
  rail: 'auto',
  idempotencyKey: 'inv-4471',
});`,
    Python: `from numa import Numa

numa = Numa(api_key=os.environ["NUMA_KEY"])

transfer = numa.transfers.create(
    source="acc_eur_ops",
    destination="ben_aster_gmbh",
    amount={"value": "84210.00", "currency": "EUR"},
    rail="auto",
    idempotency_key="inv-4471",
)`,
    cURL: `curl https://api.numa.example/v4/transfers \\
  -H "Authorization: Bearer $NUMA_KEY" \\
  -H "Idempotency-Key: inv-4471" \\
  -d from=acc_eur_ops \\
  -d to=ben_aster_gmbh \\
  -d amount[value]=84210.00 \\
  -d amount[currency]=EUR \\
  -d rail=auto`,
  },
  response: `{
  "id": "tr_7Hq2xN4pLk",
  "status": "settled",
  "rail": "sepa_instant",
  "amount": { "value": "84210.00", "currency": "EUR" },
  "fee": { "value": "0.20", "currency": "EUR" },
  "settled_in_ms": 2140
}`,
};

export const metrics = {
  label: 'By the numbers',
  items: [
    { value: 38, suffix: ' ms', label: 'Median API latency', size: 'wide', chart: 'latency' },
    { value: 42, suffix: '', label: 'Currencies held natively', size: 'sq' },
    { value: 2.1, suffix: 's', decimals: 1, label: 'Median settlement, instant rails', size: 'sq' },
    { value: 1800, suffix: '+', label: 'Finance teams on Numa', size: 'sq' },
    { value: 99.995, suffix: '%', decimals: 3, label: 'Platform uptime, trailing 12 months', size: 'wide', chart: 'uptime' },
  ],
  quote: {
    text: 'We closed the month in two days instead of nine. The CFO dashboard is now the only tab I keep open.',
    who: 'Lena Varga',
    role: 'VP Finance, Aster Logistics (fictional)',
  },
};

export const cta = {
  title: ['Make every', 'euro move.'],
  text: 'Numa is onboarding finance teams in Europe, the UK and Singapore.',
  placeholder: 'Work email',
  button: 'Request access',
  thanks: 'Thanks — this is a demo form, nothing was sent.',
};

export const exchanges = [
  { name: 'NYSE', tz: 'America/New_York', open: [9, 30], close: [16, 0] },
  { name: 'LSE', tz: 'Europe/London', open: [8, 0], close: [16, 30] },
  { name: 'XETRA', tz: 'Europe/Berlin', open: [9, 0], close: [17, 30] },
  { name: 'TSE', tz: 'Asia/Tokyo', open: [9, 0], close: [15, 0] },
  { name: 'HKEX', tz: 'Asia/Hong_Kong', open: [9, 30], close: [16, 0] },
];

export const footerLinks = [
  { title: 'Product', links: ['Accounts', 'FX', 'Payments', 'Rules', 'Yield'] },
  { title: 'Developers', links: ['Docs', 'API reference', 'Status', 'Changelog'] },
  { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
];
