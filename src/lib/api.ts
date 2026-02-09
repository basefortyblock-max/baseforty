// src/lib/api.ts
import { BACKEND_URL } from '../config/backend';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    return await res.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'error', message: 'Failed to connect to backend' };
  }
}

export async function getServerWallet() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    const data = await res.json();
    return data?.rewardWallet ? { address: data.rewardWallet } : null;
  } catch (error) {
    console.error('Get wallet failed:', error);
    return null;
  }
}

export async function claimEarlyBonus(walletAddress: string, referralCode?: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/claim/early`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, referralCode }),
    });
    return await res.json();
  } catch (error) {
    console.error('Early claim failed:', error);
    return { success: false, error: 'Failed to claim reward' };
  }
}

/** @deprecated Use claimEarlyBonus instead. Kept for backwards compatibility. */
export async function sendReward(userAddress: string, _amount?: string) {
  return claimEarlyBonus(userAddress);
}