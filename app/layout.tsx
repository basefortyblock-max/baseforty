// app/layout.tsx
import { Providers } from '@/src/providers/Providers';
// @ts-ignore
import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  return {
    title: 'Baseforty - Express Your Happiness',
    description: 'Type 40 unique characters or share happiness to earn $B40B on Base.',
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: `${URL}/hero-image.png`,
        button: {
          title: 'Launch Baseforty',
          action: {
            type: 'launch_frame',
            name: 'Baseforty',
            url: URL,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: '#4f46e5',
          },
        },
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-950 via-purple-950 to-black min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}