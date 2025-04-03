import { Toaster } from '@/components/ui/sonner';
import { TanstackProvider } from '@/providers/tanstack-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
  maximumScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: {
    default: 'Nillow | Book Your Services Online',
    template: '%s | Nillow',
  },
  description:
    'Nillow is your all-in-one platform for booking beauty, wellness, and professional services. Schedule appointments effortlessly and discover top-rated service providers near you.',
  keywords: ['booking', 'appointment', 'beauty', 'wellness', 'services', 'salon', 'spa', 'nillow', 'online booking'],
  authors: [{ name: 'Godswill Ezeala' }],
  creator: 'Godswill Ezeala',
  publisher: 'Godswill Ezeala',
  metadataBase: new URL('https://nillow.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nilow-business.vercel.app',
    title: 'Nillow | Book Your Services Online',
    description: 'Nillow is your all-in-one platform for booking beauty, wellness, and professional services.',
    siteName: 'Nillow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nillow - Book Services Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nillow | Book Your Services Online',
    description: 'Nillow is your all-in-one platform for booking beauty, wellness, and professional services.',
    images: ['/screenshot-wide.png'],
    creator: '@nillowapp',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32' },
      { url: '/icon-192x192.png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/shortcut-icon.png', sizes: '128x128' }],
  },
  // manifest: '/site.webmanifest',
  // verification: {
  //   google: 'google-site-verification-code',
  //   yandex: 'yandex-verification-code',
  // },
  category: 'booking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          rel='icon'
          href='/favicon.png'
          sizes='any'
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanstackProvider>
          <Toaster />
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
