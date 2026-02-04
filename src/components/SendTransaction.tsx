// components/SendTransaction.tsx
import { useState } from 'react';
import { parseEther } from 'viem';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';

export function SendTransaction() {
  const { address, walletType } = useUnifiedAuth();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const { data: hash, sendTransaction, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleTransaction = async () => {
    if (!address || !amount || !recipient) return;

    try {
      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  // Show different guidance based on wallet type
  const getTransactionGuidance = () => {
    switch (walletType) {
      case 'base_account':
        return {
          title: 'Base Account Transaction',
          description: 'You\'ll be prompted to confirm with your passkey',
          icon: '🔐'
        };
      case 'embedded':
        return {
          title: 'Embedded Wallet Transaction',
          description: 'Transaction will be signed automatically',
          icon: '⚡'
        };
      default:
        return { title: 'Send Transaction', description: '', icon: '💸' };
    }
  };

  const guidance = getTransactionGuidance();

  if (!address) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">{guidance.icon}</div>
        <h3 className="text-lg font-bold">{guidance.title}</h3>
        <p className="text-sm text-gray-600">{guidance.description}</p>

        {/* Network indicator and switch */}
        <div className="mt-3 p-2 bg-gray-50 rounded border">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              Network: <strong>{chain?.name || 'Unknown'}</strong>
            </span>
            <div className="space-x-1">
              {chain?.id !== baseSepolia.id && (
                <button
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  → Sepolia
                </button>
              )}
              {chain?.id !== base.id && (
                <button
                  onClick={() => switchChain({ chainId: base.id })}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  → Mainnet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            step="0.001"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        )}

        <button
          onClick={handleTransaction}
          disabled={!amount || !recipient || isPending || isConfirming}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending || isConfirming ? 'Processing...' : 'Send Transaction'}
        </button>

        {isSuccess && hash && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
            <p className="text-green-800 font-medium mb-2">✅ Transaction Confirmed!</p>
            <a
              href={`https://${chain?.id === baseSepolia.id ? 'sepolia.' : ''}basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              View on {chain?.id === baseSepolia.id ? 'Sepolia ' : ''}Basescan →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}