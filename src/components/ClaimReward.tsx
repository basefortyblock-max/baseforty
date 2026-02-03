"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';

export function ClaimReward() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function claimReward() {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/claim-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, amount: '10' })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Claim error:', error);
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