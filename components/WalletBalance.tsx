"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import { usePublicClient } from "@/hooks/usePublicClient";
import { Wallet } from "lucide-react";

export default function WalletBalance() {
  const { address } = useEmbeddedWallet();
  const { client, blockNumber, isLoading: clientLoading } = usePublicClient();
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!client || !address) return;

      try {
        const balance = await client.getBalance({
          address: address as `0x${string}`,
        });
        setBalance(balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();
  }, [client, address, blockNumber]); // Re-fetch when block changes

  if (!address) return null;

  const formatBalance = (balance: bigint | null) => {
    if (balance === null) return "0";
    const formatted = formatEther(balance);
    // Show up to 4 decimal places
    const num = parseFloat(formatted);
    if (num === 0) return "0";
    if (num < 0.0001) return "<0.0001";
    return num.toFixed(4).replace(/\.?0+$/, "");
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
      <Wallet className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">
        {clientLoading || balance === null ? "..." : `${formatBalance(balance)} ETH`}
      </span>
    </div>
  );
}