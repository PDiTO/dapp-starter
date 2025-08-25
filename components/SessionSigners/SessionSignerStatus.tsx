"use client";

import { Bot, BotOff } from "lucide-react";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";

export default function SessionSignerStatus() {
  const { walletMetadata, isReady, isDelegated } = useEmbeddedWallet();

  if (!isReady || !walletMetadata) {
    return null;
  }

  if (isDelegated) {
    // Green bot with pulse effect when enabled
    return (
      <div className="relative inline-flex items-center">
        <Bot className="h-5 w-5 text-green-500" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
    );
  }

  // Red bot off when disabled
  return (
    <div className="relative inline-flex items-center">
      <BotOff className="h-5 w-5 text-red-500" />
    </div>
  );
}