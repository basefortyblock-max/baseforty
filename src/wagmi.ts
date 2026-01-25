import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Baseforty',
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  chains: [base],
  ssr: true,
});
