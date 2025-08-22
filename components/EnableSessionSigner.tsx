"use client";

import { useState } from "react";
import { useSessionSigners, WalletWithMetadata } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

interface EnableSessionSignerProps {
  wallet: WalletWithMetadata;
}

export default function EnableSessionSigner({ wallet }: EnableSessionSignerProps) {
  const { addSessionSigners } = useSessionSigners();
  const [isLoading, setIsLoading] = useState(false);

  const isDelegated = wallet.delegated === true;

  const handleEnableSessionSigner = async () => {
    console.log("embeddedWallet", wallet);

    setIsLoading(true);
    try {
      await addSessionSigners({
        address: wallet.address,
        signers: [
          {
            signerId: process.env.NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID!,
            policyIds: [],
          },
        ],
      });
      console.log("Session signer enabled successfully");
    } catch (error) {
      console.error("Failed to enable session signer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isDelegated;

  return (
    <Button 
      onClick={handleEnableSessionSigner} 
      disabled={isDisabled}
      className="w-48"
    >
      {isLoading ? "Enabling..." : "Enable Session Signer"}
    </Button>
  );
}
