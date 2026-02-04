// config/wagmi.ts
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseAccount } from 'wagmi/connectors';

// Base Account connector
const baseAccountConnector = baseAccount({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Your App',
});

// Wagmi config (only for Base Account - embedded wallets handled by CDP React providers)
export const wagmiConfig = createConfig({
  connectors: [baseAccountConnector],
  chains: [baseSepolia, base], // Put baseSepolia first for testing
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});