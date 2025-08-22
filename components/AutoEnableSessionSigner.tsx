"use client";

import { useEffect } from "react";
import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import { useSessionSigners } from "@privy-io/react-auth";

export default function AutoEnableSessionSigner() {
  const { user, ready } = usePrivy();
  const { addSessionSigners } = useSessionSigners();

  useEffect(() => {
    const enableSessionSigner = async () => {
      if (!ready || !user) return;

      const embeddedWallet = user.linkedAccounts.find(
        (wallet): wallet is WalletWithMetadata =>
          wallet.type === "wallet" &&
          wallet.walletClientType === "privy" &&
          wallet.connectorType === "embedded"
      );

      // Only enable if wallet exists and is not already delegated
      if (embeddedWallet && !embeddedWallet.delegated) {
        try {
          console.log("Auto-enabling session signer for wallet:", embeddedWallet.address);
          await addSessionSigners({
            address: embeddedWallet.address,
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
  }, [ready, user, addSessionSigners]);

  return null; // This component doesn't render anything
}