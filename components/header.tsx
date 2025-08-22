"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { ready: privyReady, login, logout, authenticated } = usePrivy();

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-bold">Dapp Starter</h1>
      {privyReady && !authenticated && (
        <Button onClick={() => login()}>Login</Button>
      )}
      {privyReady && authenticated && (
        <Button onClick={() => logout()}>Logout</Button>
      )}
    </header>
  );
}
