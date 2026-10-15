import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { brand } from '@/lib/content';
import './globals.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: 'Numa connects every account, currency and payment rail into one programmable balance sheet. A fictional fintech design concept.',
};

export const viewport: Viewport = { themeColor: '#08090b', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script adds the `motion` class to <html> before
    // React hydrates; that intentional pre-paint change must not count as a mismatch.
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
