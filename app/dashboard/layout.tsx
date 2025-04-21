import DashboardLayout from '@/layouts/DashboardLayout';
import { Metadata } from 'next';
import '../globals.css';

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
        url: 'https://res.cloudinary.com/dyq13myey/image/upload/f_auto,q_auto/gztsdhfcgykktqhkqalv',
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
  category: 'booking',
};

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
