// hooks/useUnifiedAuth.ts
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useSignInWithEmail, useVerifyEmailOTP, useIsSignedIn, useEvmAddress, useSignOut } from '@coinbase/cdp-hooks';
import { useState, useEffect } from 'react';

export type WalletType = 'base_account' | 'embedded' | 'none';

export function useUnifiedAuth() {
  // Wagmi hooks for Base Account
  const { address: wagmiAddress, isConnected: wagmiConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // CDP hooks - tanpa isLoading (tidak tersedia di API)
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { isSignedIn: cdpSignedIn } = useIsSignedIn();
  const { evmAddress: cdpAddress } = useEvmAddress();
  const { signOut } = useSignOut();

  // Manual loading states
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('none');
  const [flowId, setFlowId] = useState<string>('');

  const address = wagmiConnected ? wagmiAddress : cdpAddress;
  const isConnected = wagmiConnected || cdpSignedIn;

  useEffect(() => {
    if (wagmiConnected && connector?.name === 'Base Account') {
      setWalletType('base_account');
    } else if (cdpSignedIn && cdpAddress) {
      setWalletType('embedded');
    } else {
      setWalletType('none');
    }
  }, [wagmiConnected, cdpSignedIn, connector, cdpAddress]);

  const connectBaseAccount = () => {
    const baseConnector = connectors.find(c => c.name === 'Base Account');
    if (baseConnector) {
      connect({ connector: baseConnector });
    }
  };

  const signInWithEmbeddedWallet = async (email: string) => {
    setIsSigningIn(true);
    try {
      const response = await signInWithEmail({ email });
      if (response && typeof response === 'object' && 'flowId' in response) {
        setFlowId(response.flowId as string);
      }
      return true;
    } catch (error) {
      console.error('Failed to sign in with email:', error);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const verifyOtpAndConnect = async (otp: string) => {
    setIsVerifying(true);
    try {
      await verifyEmailOTP({ flowId, otp });
      return true;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const disconnect = async () => {
    if (wagmiConnected) {
      wagmiDisconnect();
    }
    if (cdpSignedIn || walletType === 'embedded') {
      try {
        await signOut();
      } catch (error) {
        console.error('CDP sign out failed:', error);
      }
    }
  };

  return {
    address,
    isConnected,
    walletType,
    connectBaseAccount,
    signInWithEmbeddedWallet,
    verifyOtpAndConnect,
    disconnect,
    isSigningIn,
    isVerifying,
  };
}