import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Baseforty - Express Your Happiness',
  description: 'Type 40 characters, generate, earn $B40B on Base',
};

import { Providers } from '../src/providers';

export default function RootLayout({ children }) {
  return (
    <html>
<head><meta name="base:app_id" content="694f1e08c63ad876c90814df" /></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}