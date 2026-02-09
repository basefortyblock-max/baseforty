"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { BACKEND_URL } from '../config/backend';

export function ClaimReward() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; txHash?: string; error?: string } | null>(null);

  async function claimReward() {
    if (!address) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/claim/early`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Claim error:', error);
      setResult({ success: false, error: 'Failed to connect to backend' });
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return <p>Connect wallet first</p>;
  }

  return (
    <div>
      <button onClick={claimReward} disabled={loading}>
        {loading ? 'Claiming...' : 'Claim Reward'}
      </button>
      {result && <p>Success: {result.txHash}</p>}
    </div>
  );
}