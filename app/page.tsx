"use client";

import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { ready: privyReady, login } = usePrivy();

  if (!privyReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onClick={() => login()}>Login</Button>
    </div>
  );
}
