"use client";

// This component is used to switch the current session signer status for the wallet

import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import EnableSessionSigner from "./EnableSessionSigner";
import DisableSessionSigner from "./DisableSessionSigner";

export default function SessionSigners() {
  const { walletMetadata, isReady, isDelegated } = useEmbeddedWallet();

  if (!isReady || !walletMetadata) {
    return null;
  }

  return isDelegated ? <DisableSessionSigner /> : <EnableSessionSigner />;
}
