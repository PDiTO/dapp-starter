"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { createPublicClient, custom } from "viem";
import { counterAbi } from "@/lib/counterAbi";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import { getDefaultChain } from "@/lib/chains";

export default function Counter() {
  const [count, setCount] = useState<bigint>(BigInt(0));
  const { wallet: embeddedWallet, isReady } = useEmbeddedWallet();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const readCounter = async (client: ReturnType<typeof createPublicClient>) => {
    if (!contractAddress) return;

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

  useEffect(() => {
    if (!isReady || !embeddedWallet) return;

    let client: ReturnType<typeof createPublicClient>;
    const defaultChain = getDefaultChain();

    (async () => {
      try {
        await embeddedWallet.switchChain(defaultChain.id);

        const provider = await embeddedWallet.getEthereumProvider();

        client = createPublicClient({
          chain: defaultChain,
          transport: custom(provider),
        });

        await readCounter(client);

        const unsubscribe = client.watchBlocks({
          onBlock: async () => {
            await readCounter(client);
          },
          onError: (error: Error) => {
            console.error("Block subscription error:", error);
          },
        });
        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error("Failed to setup wallet client:", error);
      }
    })();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isReady, embeddedWallet, contractAddress]);

  const handleIncrement = () => {
    console.log("Increment clicked");
  };

  const handleDecrement = () => {
    console.log("Decrement clicked");
  };

  if (!isReady) return <div>Loading...</div>;
  if (!embeddedWallet) return <div>No embedded wallet connected</div>;

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
