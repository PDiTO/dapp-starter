"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import SessionSignerStatus from "@/components/SessionSigners/SessionSignerStatus";
import WalletDropdown from "@/components/WalletDropdown";
import WalletBalance from "@/components/WalletBalance";

export default function Header() {
  const { ready: privyReady, login, authenticated } = usePrivy();

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-bold">Dapp Starter</h1>
      <div className="flex items-center gap-4">
        {privyReady && authenticated && (
          <>
            <WalletBalance />
            <SessionSignerStatus />
            <WalletDropdown />
          </>
        )}
        {privyReady && !authenticated && (
          <Button onClick={() => login()}>Login</Button>
        )}
      </div>
    </header>
  );
}
