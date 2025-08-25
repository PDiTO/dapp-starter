"use client";

import { useState } from "react";
import { useSendTransaction } from "@privy-io/react-auth";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import { encodeFunctionData } from "viem";
import { counterAbi } from "@/lib/counterAbi";
import { toast } from "sonner";

type CounterAction = "increment" | "decrement";

export function useCounterTransaction() {
  const { isDelegated, walletMetadata } = useEmbeddedWallet();
  const { sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const execute = async (action: CounterAction) => {
    if (!contractAddress) {
      toast.error("Contract address not configured");
      return;
    }

    setIsLoading(true);

    try {
      if (isDelegated && walletMetadata) {
        // Session signer mode - send to backend
        console.log(`Using session signer for ${action}`);
        
        const response = await fetch("/api/counter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            walletId: walletMetadata.id,
            contractAddress,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `Failed to ${action} counter`);
        }

        const { hash } = await response.json();
        toast.success(`Counter ${action}ed! Tx: ${hash.slice(0, 10)}...`);
        return hash;
      } else {
        // Non-delegated mode - client-side transaction with user approval
        console.log(`Using client-side transaction for ${action}`);
        
        const data = encodeFunctionData({
          abi: counterAbi,
          functionName: action,
        });

        const { hash } = await sendTransaction({
          to: contractAddress,
          data,
        });

        toast.success(`Counter ${action}ed! Tx: ${hash.slice(0, 10)}...`);
        return hash;
      }
    } catch (error) {
      console.error(`Failed to ${action} counter:`, error);
      toast.error(`Failed to ${action} counter`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    isDelegated,
  };
}