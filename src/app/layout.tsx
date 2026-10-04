import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topspot — Universal Ijara Marketi',
  description: 'O\'zbekistonning birinchi universal ijara platformasi. Avtomobil, uskunalar, ko\'chmas mulk va mutaxassislarni ijaraga oling.',
  keywords: 'ijara, arenda, rent, topspot, uzbekistan, avtomobil, uskuna, koʻchmas mulk',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
