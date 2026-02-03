"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

const NEXT_PUBLIC_BACKEND_URL = "https://baseforty-backend.vercel.app"; 

export function ClaimReward() {
  const { address, isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleClaim() {
    if (!address) {
      setResult("Please connect wallet first");
      return;
    }

    setIsPending(true);
    setResult(null);

    try {
      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/claim/early`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ Claimed ${data.amount} B40B! Slot #${data.slot} (${data.remaining} slots remaining)`);
      } else {
        setResult(`❌ ${data.error}`);
      }
    } catch (error) {
      setResult("❌ Gagal konek ke backend. Cek apakah server jalan");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <button onClick={handleClaim} disabled={isPending || !isConnected}>
        {isPending ? "Claiming..." : "Claim 100$ B40B"}
      </button>
      {result && <p>{result}</p>}
    </div>
  );
}