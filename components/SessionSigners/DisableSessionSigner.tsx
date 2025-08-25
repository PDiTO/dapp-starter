"use client";

// This component is used to disable the session signer for the wallet

import { useState } from "react";
import { useSessionSigners } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";

export default function DisableSessionSigner() {
  const { walletMetadata, isDelegated } = useEmbeddedWallet();
  const { removeSessionSigners } = useSessionSigners();
  const [isLoading, setIsLoading] = useState(false);

  const handleDisableSessionSigner = async () => {
    if (!walletMetadata) return;

    setIsLoading(true);
    try {
      await removeSessionSigners({
        address: walletMetadata.address,
      });
      console.log("Session signer removed successfully");
    } catch (error) {
      console.error("Failed to remove session signers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !isDelegated;

  return (
    <Button
      onClick={handleDisableSessionSigner}
      disabled={isDisabled}
      className="w-48"
    >
      {isLoading ? "Disabling..." : "Disable Session Signer"}
    </Button>
  );
}
