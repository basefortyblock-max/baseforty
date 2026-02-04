// app/page.tsx
'use client';

import { WalletAuthButton } from '../components/WalletAuthButton';
import { SendTransaction } from '../components/SendTransaction';
import { useAccount } from 'wagmi';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">CDP + Base Account Demo</h1>
          <p className="text-gray-600">
            One app supporting both Base Account and embedded wallet users
          </p>
        </div>

        <div className="space-y-6">
          <WalletAuthButton />
          {isConnected && <SendTransaction />}
        </div>
      </div>
    </div>
  );
}