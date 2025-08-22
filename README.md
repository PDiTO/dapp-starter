This is a full-stack dapp starter template with a privy that supports session signers.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Icon library
- **Privy** - Web3 wallet infra

## Features

- TBC

## Initial setup

1. Create a new desktop/web application in [Privy](https://dashboard.privy.io/account)
2. Under Privy authentication settings for the app enable:
   - Basics Tab: Email
   - Basics Tab: External wallets (ethereum wallets)
   - Basics Tab: Automatically create embedded wallets on login (EVM wallets + create embedded wallets for all users)
   - Social Tab: Google
3. Under Privy Authorization keys create a new key called Session Signer
4. Clone .sample.env to .env and populate all the required keys.

## Running the Development Server

```bash
pnpm install
pnpm run dev
```
