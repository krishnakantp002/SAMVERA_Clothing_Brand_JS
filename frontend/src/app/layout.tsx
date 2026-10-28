import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SAMVERA — Men\'s Fashion & Essentials',
    template: '%s | SAMVERA',
  },
  description:
    'Premium men\'s fashion and lifestyle essentials. Shop T-Shirts, Hoodies, Shirts, Bottomwear, Accessories & Grooming products.',
  keywords: [
    'SAMVERA',
    'mens fashion',
    'tshirts',
    'hoodies',
    'oversized tshirts',
    'mens essentials',
    'mens clothing',
    'streetwear',
  ],
  authors: [{ name: 'SAMVERA' }],
  creator: 'SAMVERA',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SAMVERA',
    title: 'SAMVERA — Men\'s Fashion & Essentials',
    description:
      'Premium men\'s fashion and lifestyle essentials. Shop the latest collection.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAMVERA — Men\'s Fashion & Essentials',
    description:
      'Premium men\'s fashion and lifestyle essentials.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ThemeProvider } from '@/components/layout/theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
