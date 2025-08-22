"use client";

import { usePrivy } from "@privy-io/react-auth";

import Counter from "@/components/Counter";
import SessionSigners from "@/components/SessionSigners";

export default function Home() {
  const { ready: privyReady, authenticated } = usePrivy();

  if (!privyReady) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Dapp Starter
          </h2>
          <p className="text-muted-foreground">Please login to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Counter />
        <SessionSigners />
      </div>
    </div>
  );
}
