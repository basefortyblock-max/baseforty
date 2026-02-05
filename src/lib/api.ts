// src/lib/api.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

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
    const res = await fetch(`${BACKEND_URL}/api/wallet`);
    return await res.json();
  } catch (error) {
    console.error('Get wallet failed:', error);
    return null;
  }
}

export async function sendReward(userAddress: string, amount: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress, amount }),
    });
    return await res.json();
  } catch (error) {
    console.error('Send reward failed:', error);
    return { success: false, error: 'Failed to send reward' };
  }
}