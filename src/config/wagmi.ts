// src/config/wagmi.ts
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseAccount } from 'wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    connectors: [
      baseAccount({
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'Your App',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}