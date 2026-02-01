import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { ClaimReward } from "../components/ClaimReward";

export default function Home() {
  return (
    <main>
      <ConnectWallet />
      <ClaimReward />
    </main>
  );
}