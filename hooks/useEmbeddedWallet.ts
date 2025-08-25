"use client";

import { useWallets, usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import { useMemo } from "react";

export function useEmbeddedWallet() {
  const { wallets, ready } = useWallets();
  const { user } = usePrivy();

  const embeddedWallet = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy"),
    [wallets]
  );

  const embeddedWalletMetadata = useMemo(
    () =>
      user?.linkedAccounts.find(
        (wallet): wallet is WalletWithMetadata =>
          wallet.type === "wallet" &&
          wallet.walletClientType === "privy" &&
          wallet.connectorType === "embedded"
      ),
    [user?.linkedAccounts]
  );

  return {
    wallet: embeddedWallet,
    walletMetadata: embeddedWalletMetadata,
    isReady: ready,
    isLoading: !ready,
    hasWallet: !!embeddedWallet,
    isDelegated: embeddedWalletMetadata?.delegated === true,
    address: embeddedWallet?.address || embeddedWalletMetadata?.address,
  };
}
