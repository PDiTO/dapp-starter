"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { counterAbi } from "@/lib/counterAbi";
import { usePublicClient } from "@/hooks/usePublicClient";

export default function Counter() {
  const [count, setCount] = useState<bigint>(BigInt(0));
  const { client, blockNumber, isReady } = usePublicClient();
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

  const handleIncrement = () => {
    console.log("Increment clicked");
  };

  const handleDecrement = () => {
    console.log("Decrement clicked");
  };

  if (!isReady) return <div>Loading...</div>;
  if (!client) return <div>Connecting to blockchain...</div>;

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleDecrement} size="icon" variant="outline">
        <Minus className="h-4 w-4" />
      </Button>

      <div className="text-2xl font-semibold min-w-[3rem] text-center">
        {count.toString()}
      </div>

      <Button onClick={handleIncrement} size="icon" variant="outline">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
