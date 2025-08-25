"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2 } from "lucide-react";
import { counterAbi } from "@/lib/counterAbi";
import { usePublicClient } from "@/hooks/usePublicClient";
import { useCounterTransaction } from "@/hooks/useCounterTransaction";

export default function Counter() {
  const [count, setCount] = useState<bigint>(BigInt(0));
  const [activeAction, setActiveAction] = useState<"increment" | "decrement" | null>(null);
  const { client, blockNumber, isReady } = usePublicClient();
  const { execute, isLoading, isDelegated } = useCounterTransaction();
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  useEffect(() => {
    const readCounter = async () => {
      if (!client || !contractAddress) return;

      try {
        const result = await client.readContract({
          address: contractAddress,
          abi: counterAbi,
          functionName: "getNumber",
        });
        setCount(result as bigint);
      } catch (error) {
        console.error("Error reading contract:", error);
      }
    };

    readCounter();
  }, [client, contractAddress, blockNumber]); // Re-read when block changes

  const handleIncrement = async () => {
    setActiveAction("increment");
    try {
      await execute("increment");
    } finally {
      setActiveAction(null);
    }
  };

  const handleDecrement = async () => {
    setActiveAction("decrement");
    try {
      await execute("decrement");
    } finally {
      setActiveAction(null);
    }
  };

  if (!isReady) return <div>Loading...</div>;
  if (!client) return <div>Connecting to blockchain...</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleDecrement} 
          size="icon" 
          variant="outline"
          disabled={isLoading}
        >
          {activeAction === "decrement" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
        </Button>

        <div className="text-2xl font-semibold min-w-[3rem] text-center">
          {count.toString()}
        </div>

        <Button 
          onClick={handleIncrement} 
          size="icon" 
          variant="outline"
          disabled={isLoading}
        >
          {activeAction === "increment" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {isDelegated && (
        <p className="text-xs text-muted-foreground">
          Using session signer (no prompts)
        </p>
      )}
    </div>
  );
}
