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
    const toastId = toast.loading(`Submitting ${action} transaction...`);

    try {
      let hash: string;
      
      if (isDelegated && walletMetadata) {
        // Session signer mode - send to backend
        toast.loading("Processing with session signer...", { id: toastId });
        
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

        const result = await response.json();
        hash = result.hash;
      } else {
        // Non-delegated mode - client-side transaction with user approval
        toast.loading("Waiting for wallet approval...", { id: toastId });
        
        const data = encodeFunctionData({
          abi: counterAbi,
          functionName: action,
        });

        const result = await sendTransaction({
          to: contractAddress,
          data,
        });
        hash = result.hash;
      }

      // Show success with transaction hash
      toast.success(`Counter ${action}ed!`, { 
        id: toastId,
        description: `Tx: ${hash.slice(0, 10)}...${hash.slice(-8)}` 
      });
      
      return hash;
    } catch (error) {
      console.error(`Failed to ${action} counter:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} counter`;
      toast.error(errorMessage, { id: toastId });
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