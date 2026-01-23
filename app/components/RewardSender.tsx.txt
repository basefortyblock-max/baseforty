'use client';

import { useAccount, useWalletClient } from 'wagmi';
import { encodeFunctionData, parseUnits } from 'viem';

const B40B_CONTRACT = '0x76edfdf2c9ead7b542e4d2ea618bf5dc5ad6a958';
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL!;

// ERC20 transfer ABI
const erc20ABI = [{
  name: 'transfer',
  type: 'function',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ],
  outputs: [{ type: 'bool' }]
}] as const;

export function useGaslessReward() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const sendReward = async (amount: number = 40) => {
    if (!walletClient || !address) return;

    // Gunakan wallet_sendCalls dengan paymaster
    await walletClient.request({
      method: 'wallet_sendCalls',
      params: [{
        version: '1.0',
        chainId: '0x2105', // Base Mainnet
        from: address,
        calls: [{
          to: B40B_CONTRACT,
          value: '0x0',
          data: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'transfer',
            args: [address, parseUnits(amount.toString(), 18)]
          })
        }],
        capabilities: {
          paymasterService: {
            url: PAYMASTER_URL
          }
        }
      }]
    });
  };

  return { sendReward };
}