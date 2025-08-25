"use client";

// This component is used to enable the session signer for the wallet

import { useState } from "react";
import { useSessionSigners } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";

export default function EnableSessionSigner() {
  const { walletMetadata, isDelegated } = useEmbeddedWallet();
  const { addSessionSigners } = useSessionSigners();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableSessionSigner = async () => {
    if (!walletMetadata) return;

    setIsLoading(true);
    try {
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
