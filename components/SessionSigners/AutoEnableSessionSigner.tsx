"use client";

import { useEffect, useRef } from "react";
import { useSessionSigners, usePrivy } from "@privy-io/react-auth";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";

export default function AutoEnableSessionSigner() {
  const { walletMetadata, isReady, isDelegated } = useEmbeddedWallet();
  const { authenticated } = usePrivy();
  const { addSessionSigners } = useSessionSigners();
  const hasAttempted = useRef(false);

  useEffect(() => {
    const enableSessionSigner = async () => {
      // Check all conditions are met
      if (!isReady || !authenticated || !walletMetadata || isDelegated) {
        return;
      }

      // Check if session signer ID is configured
      if (!process.env.NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID) {
        console.warn("Session signer ID not configured");
        return;
      }

      // Only attempt once per session
      if (hasAttempted.current) {
        return;
      }

      hasAttempted.current = true;

      try {
        console.log(
          "Auto-enabling session signer for wallet:",
          walletMetadata.address
        );
        
        await addSessionSigners({
          address: walletMetadata.address,
          signers: [
            {
              signerId: process.env.NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID,
              policyIds: [],
            },
          ],
        });
        
        console.log("Session signer auto-enabled successfully");
      } catch (error) {
        console.error("Failed to auto-enable session signer:", error);
        // Reset the flag after a delay to potentially retry later
        setTimeout(() => {
          hasAttempted.current = false;
        }, 30000); // Retry after 30 seconds if it fails
      }
    };

    enableSessionSigner();
  }, [isReady, authenticated, walletMetadata, isDelegated, addSessionSigners]);

  return null;
}
