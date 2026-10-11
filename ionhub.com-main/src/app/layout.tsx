import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ION HUB — Doorstep Car Wash & Professional Ironing | Kompally, Hyderabad',
  description:
    'Your Everyday Care. Delivered to Your Doorstep. Eco-friendly doorstep car wash and professional ironing services in Kompally. Daily 6 PM to 11 PM.',
  keywords: [
    'ION HUB',
    'Doorstep car wash Kompally',
    'Car wash at home Kompally',
    'Ironing service Kompally',
    'Doorstep ironing Kompally',
    'Car detailing Hyderabad',
    'Steam press Kompally',
  ],
  authors: [{ name: 'ION HUB' }],
  creator: 'ION HUB',
  icons: {
    icon: '/brand/logo_source.png',
    apple: '/brand/logo_source.png',
  },
  openGraph: {
    title: 'ION HUB — Everyday Care Delivered to Your Doorstep',
    description:
      'From sparkling-clean cars to perfectly pressed clothes, ION HUB makes everyday care simple, convenient and reliable in Kompally.',
    url: 'https://ionhub.in',
    siteName: 'ION HUB',
    images: [
      {
        url: '/brand/creative_carwash.jpeg',
        width: 1200,
        height: 630,
        alt: 'ION HUB Doorstep Services',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ION HUB — Everyday Care. Delivered to Your Doorstep.',
    description: 'Doorstep car wash & professional ironing in Kompally.',
    images: ['/brand/creative_carwash.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF9F2] text-[#12312C] font-sans antialiased selection:bg-[#EAF5E8] selection:text-[#0B4F47]">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
