// config/wagmi.ts
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseAccount } from 'wagmi/connectors';

const baseAccountConnector = baseAccount({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Your App',
});

export const wagmiConfig = createConfig({
  connectors: [baseAccountConnector],
  chains: [baseSepolia, base],
  ssr: true, 
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});