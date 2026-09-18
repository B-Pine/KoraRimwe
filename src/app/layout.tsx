import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800'],
});

const SITE_URL = 'https://korarimwe.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KoraRimwe — Rwanda Driving Theory Exam Preparation',
    template: '%s · KoraRimwe',
  },
  description:
    'Prepare for the Rwandan driving theory exam (Amategeko y’Umuhanda): study the rules, explore road signs, practise verified questions and sit timed mock exams.',
  keywords: [
    'Amategeko y’Umuhanda',
    'Rwanda driving theory',
    'provisional driving licence Rwanda',
    'ibibazo by’amategeko y’umuhanda',
    'road signs Rwanda',
  ],
  applicationName: 'KoraRimwe',
  openGraph: {
    type: 'website',
    siteName: 'KoraRimwe',
    title: 'KoraRimwe — Prepare. Practice. Pass.',
    description:
      'Study Rwanda road rules, explore road signs and sit timed mock exams for the driving theory test.',
    locale: 'en_RW',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1F6B4F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="pb-24 lg:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileNav />
      </body>
    </html>
  );
}
