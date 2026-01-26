import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Baseforty - Express Your Happiness',
  description: 'Type 40 characters, generate, earn $B40B on Base',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<head><meta name="base:app_id" content="696c89e8c0ab25addaaaf3a1" /></head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}