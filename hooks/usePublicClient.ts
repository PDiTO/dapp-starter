"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { createPublicClient, custom, PublicClient } from "viem";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import { getDefaultChain } from "@/lib/chains";

export function usePublicClient() {
  const { wallet, isReady } = useEmbeddedWallet();
  const [client, setClient] = useState<PublicClient | null>(null);
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const clientRef = useRef<PublicClient | null>(null);

  useEffect(() => {
    const setupClient = async () => {
      if (!isReady || !wallet) {
        setIsLoading(false);
        return;
      }

      try {
        const defaultChain = getDefaultChain();
        
        // Only switch chain if needed
        await wallet.switchChain(defaultChain.id);
        
        const provider = await wallet.getEthereumProvider();
        
        // Create client only if it doesn't exist or provider changed
        if (!clientRef.current) {
          const newClient = createPublicClient({
            chain: defaultChain,
            transport: custom(provider),
          });
          
          clientRef.current = newClient;
          setClient(newClient);
          
          // Set up block watching for real-time updates
          const unsubscribe = newClient.watchBlocks({
            onBlock: (block) => {
              setBlockNumber(block.number);
            },
            onError: (error: Error) => {
              console.error("Block subscription error:", error);
            },
            emitOnBegin: true,
            poll: true,
            pollingInterval: 12_000, // 12 seconds
          });
          
          unsubscribeRef.current = unsubscribe;
        }
      } catch (error) {
        console.error("Failed to setup public client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setupClient();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      clientRef.current = null;
    };
  }, [isReady, wallet]);

  return {
    client,
    blockNumber,
    isLoading,
    isReady,
  };
}