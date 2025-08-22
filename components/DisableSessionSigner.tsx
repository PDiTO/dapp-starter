"use client";

import { useState } from "react";
import { WalletWithMetadata, useSessionSigners } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

interface DisableSessionSignerProps {
  wallet: WalletWithMetadata;
}

export default function DisableSessionSigner({ wallet }: DisableSessionSignerProps) {
  const { removeSessionSigners } = useSessionSigners();
  const [isLoading, setIsLoading] = useState(false);

  const isDelegated = wallet.delegated === true;

  const handleDisableSessionSigner = async () => {
    setIsLoading(true);
    try {
      await removeSessionSigners({
        address: wallet.address,
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
