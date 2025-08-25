"use client";

// This component is used to auto-enable the session signer for the wallet

import { useEffect } from "react";
import { useSessionSigners } from "@privy-io/react-auth";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";

export default function AutoEnableSessionSigner() {
  const { walletMetadata, isReady, isDelegated } = useEmbeddedWallet();
  const { addSessionSigners } = useSessionSigners();

  useEffect(() => {
    const enableSessionSigner = async () => {
      if (!isReady || !walletMetadata) return;

      if (!isDelegated) {
        try {
          console.log(
            "Auto-enabling session signer for wallet:",
            walletMetadata.address
          );
          await addSessionSigners({
            address: walletMetadata.address,
            signers: [
              {
                signerId: process.env.NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID!,
                policyIds: [],
              },
            ],
          });
          console.log("Session signer auto-enabled successfully");
        } catch (error) {
          console.error("Failed to auto-enable session signer:", error);
        }
      }
    };

    enableSessionSigner();
  }, [isReady, walletMetadata, isDelegated, addSessionSigners]);

  return null; // This component doesn't render anything
}
