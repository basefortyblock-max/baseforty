import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ClaimReward } from "../components/ClaimReward";

export default function Home() {
  return (
    <main>
      <ConnectButton />
      <ClaimReward />
    </main>
  );
}