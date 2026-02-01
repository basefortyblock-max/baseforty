// app/layout.tsx
import { Providers } from '@/src/providers/Providers';
import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Baseforty - Express Your Happiness',
    template: '%s | Baseforty',
  },
  description: 'Type 40 unique characters or share happiness to earn $B40B on Base. Gasless rewards, Proof of Humanity & Happiness.',
  keywords: ['Baseforty', 'Base', 'Proof of Happiness', 'Proof of Humanity', '$B40B', 'gasless', 'onchain'],
  authors: [{ name: 'Baseforty Team' }],
  openGraph: {
    title: 'Baseforty - Express Your Happiness',
    description: 'Type 40 characters, generate proof, earn $B40B rewards on Base.',
    url: 'https://baseforty.vercel.app',
    siteName: 'Baseforty',
    images: [
      {
        url: '/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'Baseforty - Proof of Happiness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baseforty - Express Your Happiness',
    description: 'Earn $B40B by typing 40 unique characters or sharing happiness.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png', 
  },
  manifest: '/site.webmanifest', 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="base:app_id" content="696c89e8c0ab25addaaaf3a1" />            
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#4f46e5" /> 
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-950 via-purple-950 to-black min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}