import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topspot — Universal Ijara Marketi',
  description: "O'zbekistonning birinchi universal ijara platformasi. Avtomobil, uskunalar, ko'chmas mulk va mutaxassislarni ijaraga oling.",
  keywords: 'ijara, arenda, rent, topspot, uzbekistan, avtomobil, uskuna, koʻchmas mulk',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Topspot',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Topspot — Universal Ijara Marketi',
    description: "O'zbekistonning birinchi universal ijara platformasi",
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF5500',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        {/* iOS PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Topspot" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
