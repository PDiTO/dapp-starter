"use client";

import { useState } from "react";
import { usePrivy, useSessionSigners } from "@privy-io/react-auth";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Check, Bot, BotOff, Loader2, ChevronDown } from "lucide-react";

export default function WalletDropdown() {
  const { logout } = usePrivy();
  const { address, walletMetadata, isDelegated } = useEmbeddedWallet();
  const { addSessionSigners, removeSessionSigners } = useSessionSigners();
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleToggleSessionSigner = async () => {
    if (!walletMetadata || isToggling) return;
    
    setIsToggling(true);
    
    try {
      if (isDelegated) {
        // Disable session signer
        await removeSessionSigners({
          address: walletMetadata.address,
        });
        console.log("Session signer disabled successfully");
      } else {
        // Enable session signer
        await addSessionSigners({
          address: walletMetadata.address,
          signers: [
            {
              signerId: process.env.NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID!,
              policyIds: [],
            },
          ],
        });
        console.log("Session signer enabled successfully");
      }
    } catch (error) {
      console.error("Failed to toggle session signer:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!address) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <span>{formatAddress(address)}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleToggleSessionSigner} 
          className="cursor-pointer"
          disabled={isToggling}
        >
          {isToggling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isDelegated ? "Disabling..." : "Enabling..."}
            </>
          ) : isDelegated ? (
            <>
              <BotOff className="mr-2 h-4 w-4" />
              Disable Session Signer
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Enable Session Signer
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}