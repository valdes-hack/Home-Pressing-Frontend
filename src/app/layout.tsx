import type { Metadata, Viewport } from 'next';
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/sora";
import './globals.css';
import PwaRegister from '@/components/PwaRegister';
import ShowcaseShell from '@/components/ShowcaseShell';

export const metadata: Metadata = {
  title: 'Atlantic Palace Pressing — Gestion Multi-Agences',
  description: 'Système centralisé de gestion de pressing haute couture (IUGEE / KEYCE v3.0)',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Atlantic Palace',
  },
  applicationName: 'Atlantic Palace Pressing',
};

export const viewport: Viewport = {
  themeColor: '#081a36',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Atlantic Palace" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-navy-950 text-white antialiased font-sans">
        <ShowcaseShell>
          {children}
        </ShowcaseShell>
        <PwaRegister />
      </body>
    </html>
  );
}
