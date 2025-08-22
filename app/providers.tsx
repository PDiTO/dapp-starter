"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { getDefaultChain, getSupportedChains } from "@/lib/chains";

import AutoEnableSessionSigner from "@/components/AutoEnableSessionSigner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!}
      config={{
        defaultChain: getDefaultChain(),
        supportedChains: getSupportedChains(),
      }}
    >
      <AutoEnableSessionSigner />
      {children}
    </PrivyProvider>
  );
}
