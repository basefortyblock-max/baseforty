// components/WalletAuthButton.tsx
'use client';

import { useState } from 'react';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';

export function WalletAuthButton() {
  const {
    address,
    isConnected,
    walletType,
    connectBaseAccount,
    signInWithEmbeddedWallet,
    verifyOtpAndConnect,
    disconnect,
    isSigningIn,
    isVerifying,
  } = useUnifiedAuth();

  const [authStep, setAuthStep] = useState<'select' | 'email' | 'otp'>('select');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Connected state
  if (isConnected && address) {
    const walletDisplay = {
      base_account: { name: 'Base Account', icon: '🟦' },
      embedded: { name: 'Embedded Wallet', icon: '📱' },
    }[walletType] || { name: 'Connected', icon: '✅' };

    return (
      <div className="flex items-center space-x-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <span>{walletDisplay.icon}</span>
        <div>
          <div className="font-medium text-green-800">{walletDisplay.name}</div>
          <div className="text-xs text-green-600 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
        <button onClick={() => disconnect()} className="text-sm text-red-600">
          Disconnect
        </button>
      </div>
    );
  }

  // OTP verification
  if (authStep === 'otp') {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="text-center">
          <h3 className="font-semibold">Check your email</h3>
          <p className="text-sm text-gray-600">Enter the code sent to {email}</p>
        </div>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="000000"
          maxLength={6}
          className="w-full px-3 py-2 border rounded text-center font-mono"
        />

        <div className="space-y-2">
          <button
            onClick={() => verifyOtpAndConnect(otp)}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isVerifying ? 'Creating account...' : 'Verify & create account'}
          </button>

          <button
            onClick={() => setAuthStep('email')}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Email input
  if (authStep === 'email') {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold text-center">Create account</h3>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border rounded"
        />

        <div className="space-y-2">
          <button
            onClick={async () => {
              const success = await signInWithEmbeddedWallet(email);
              if (success) setAuthStep('otp');
            }}
            disabled={!email || isSigningIn}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isSigningIn ? 'Sending Code...' : 'Send Verification Code'}
          </button>

          <button
            onClick={() => setAuthStep('select')}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Initial selection
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-center mb-4">Connect Your Wallet</h2>

      <button
        onClick={connectBaseAccount}
        className="w-full p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🟦</span>
          <div className="text-left">
            <div className="font-semibold">Sign in with Base</div>
            <div className="text-sm text-gray-600">I have a Base Account</div>
          </div>
        </div>
      </button>

      <button
        onClick={() => setAuthStep('email')}
        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📱</span>
          <div className="text-left">
            <div className="font-semibold">Create new account</div>
            <div className="text-sm text-gray-600">Use email to get started</div>
          </div>
        </div>
      </button>
    </div>
  );
}