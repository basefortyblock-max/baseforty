"use client";

import { useSendCalls } from "wagmi";
import { encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import { DATA_SUFFIX } from "../config/builderCode";

const B40B_CONTRACT = "0x76edfdf2c9ead7b542e4d2ea618bf5dc5ad6a958";
const PAYMASTER_URL = "https://api.developer.coinbase.com/rpc/v1/base/knKJ1H6JBiS9CAqAqgaEcb20BTsBEuUn";

const b40bAbi = [
  {
    name: "claimReward",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

export function ClaimReward() {
  const { sendCalls, isPending, isSuccess } = useSendCalls();

  async function handleClaim() {
    sendCalls({
      calls: [
        {
          to: B40B_CONTRACT,
          data: encodeFunctionData({
            abi: b40bAbi,
            functionName: "claimReward",
          }),
        },
      ],
      chainId: base.id,
      capabilities: {
        paymasterService: {
          url: PAYMASTER_URL,
        },
        dataSuffix: {
          value: DATA_SUFFIX,
          optional: true,
        },
      },
    });
  }

  return (
    <button onClick={handleClaim} disabled={isPending}>
      {isPending ? "Claiming..." : "Claim $B40B Reward"}
    </button>
  );
}