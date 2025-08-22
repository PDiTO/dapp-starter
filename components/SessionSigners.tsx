"use client";

import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import EnableSessionSigner from "./EnableSessionSigner";
import DisableSessionSigner from "./DisableSessionSigner";

export default function SessionSigners() {
  const { user, ready } = usePrivy();

  const embeddedWallet = user?.linkedAccounts.find(
    (wallet): wallet is WalletWithMetadata =>
      wallet.type === "wallet" &&
      wallet.walletClientType === "privy" &&
      wallet.connectorType === "embedded"
  );

  if (!ready || !embeddedWallet) {
    return null;
  }

  const isDelegated = embeddedWallet.delegated === true;

  return isDelegated ? (
    <DisableSessionSigner wallet={embeddedWallet} />
  ) : (
    <EnableSessionSigner wallet={embeddedWallet} />
  );
}