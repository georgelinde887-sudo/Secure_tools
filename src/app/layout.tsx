import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1c63ed',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://securetools.live'),
  applicationName: 'SecureTools.live',
  title: {
    default: 'SecureTools.live | Software Discovery for Files, Documents & Security',
    template: '%s | SecureTools.live'
  },
  description: 'Independent software discovery, comparison, and research platform covering 25 security categories: secure file sharing, encrypted cloud storage, database & backend security, virtual data rooms, and digital signatures.',
  keywords: [
    'secure file sharing',
    'encrypted cloud storage',
    'database and backend security',
    'backend as a service security',
    'database encryption',
    'virtual data rooms',
    'zero-knowledge encryption',
    'electronic signatures',
    'document management systems',
    'PDF security and redaction',
    'file security software',
    'cybersecurity software directory',
    'SecureTools'
  ],
  authors: [{ name: 'SecureTools.live Editorial Team', url: 'https://securetools.live/about' }],
  creator: 'SecureTools.live',
  publisher: 'SecureTools.live',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://securetools.live',
    siteName: 'SecureTools.live',
    title: 'SecureTools.live | Software Discovery for Files, Documents & Security',
    description: 'Discover the right tools for files, documents, database security, and digital privacy. 25 verified categories, zero-knowledge evaluations, and enterprise comparisons.',
    images: [
      {
        url: 'https://securetools.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SecureTools.live - Software Discovery for Files, Documents & Security',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecureTools.live | Software Discovery for Files, Documents & Security',
    description: 'Independent software discovery and comparison platform covering the entire digital file, document, and database security ecosystem.',
    images: ['https://securetools.live/og-image.png'],
    creator: '@securetools_live',
  },
  alternates: {
    canonical: 'https://securetools.live',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SecureTools.live',
    url: 'https://securetools.live',
    logo: 'https://securetools.live/securetools-hero-logo.png',
    description: 'Independent software discovery, comparison, and research platform covering the digital file and document ecosystem.',
    sameAs: []
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SecureTools.live',
    url: 'https://securetools.live',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://securetools.live/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistSans.className} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${geistSans.className} min-h-full flex flex-col bg-[#fafafa] text-[#09090b]`} suppressHydrationWarning>
        <Suspense fallback={<div className="h-14 border-b border-[#e4e4e7] bg-white" />}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
