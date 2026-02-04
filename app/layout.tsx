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
  description: 'Type 40 unique characters or share happiness to earn $B40B on Base.',
  // ... rest of your metadata
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="base:app_id" content="696c89e8c0ab25addaaaf3a1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-950 via-purple-950 to-black min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}