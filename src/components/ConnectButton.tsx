'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          name: 'Baseforty',
          mode: 'auto',
          theme: 'default',
        },
        wallet: {
          display: 'modal', // Tambahkan ini!
          termsUrl: 'https://...',
          privacyUrl: 'https://...',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
