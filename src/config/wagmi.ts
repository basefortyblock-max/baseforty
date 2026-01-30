import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Baseforty',
  projectId: 'fe43b759ba0320df1d33cc7102343123', 
  chains: [base, baseSepolia],
  ssr: true,
});