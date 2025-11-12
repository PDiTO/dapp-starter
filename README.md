Full‑stack dapp starter using Privy with session signers.

## Tech Stack

- **Next.js 16** – App Router
- **React 19** – Latest React version
- **Tailwind CSS v4** – Utility‑first styling
- **shadcn/ui** – Headless UI primitives and styles
- **Lucide Icons** – Icon set
- **Privy** – Auth, embedded wallets, session signers
- **viem** – On‑chain reads/writes

## Prerequisites

- Node.js 22 LTS
- pnpm (or npm/yarn; commands below use pnpm)

## Features

- **Privy auth**: email, Google, and external wallets; automatically creates embedded EVM wallets on login.
- **Session signer**: auto‑enable on login, manual enable/disable from the wallet dropdown; server‑side transactions when delegated, client‑side otherwise.
- **Counter demo**: on‑chain reads (viem) and writes with toasts and loading states.
- **Wallet balance**: live ETH balance display.
- **Modern UI**: Next.js App Router, Tailwind v4, shadcn/ui, Lucide.

## Environment Variables

Copy `.sample.env` to `.env` and fill all values:

- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy Dashboard → App → Basics.
- `NEXT_PUBLIC_PRIVY_CLIENT_ID`: Privy Dashboard → App → Clients.
- `PRIVY_APP_SECRET`: Privy Dashboard → App → Secrets.
- `NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID`: Privy Dashboard → Authorization → Session Signer ID.
- `PRIVY_SESSION_SIGNER_PRIVATE_KEY`: Private key for the session signer.
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Address of the deployed Counter contract.
- `NEXT_PUBLIC_DEFAULT_CHAIN`: Default chain name (e.g., `arbitrumSepolia`).
- `NEXT_PUBLIC_SUPPORTED_CHAINS`: Comma‑separated chain names (e.g., `arbitrumSepolia,baseSepolia`).

The included chain list and helpers live in `lib/chains.ts`. Defaults are set to `arbitrumSepolia`.

## Initial Setup

1. Create a new desktop/web app in [Privy](https://dashboard.privy.io/account). Note the keys.
2. In App Settings → Authentication, enable:
   - Basics: Email
   - Basics: External wallets (Ethereum)
   - Basics: Automatically create embedded wallets on login (EVM wallets + create for all users)
   - Social: Google
3. In Authorization, create a Session Signer and note its ID and private key.
4. Copy `.sample.env` → `.env` and populate all variables. Ensure the `NEXT_PUBLIC_CONTRACT_ADDRESS` points to a Counter contract compatible with `lib/counterAbi.ts` (has `increment`, `decrement`, `getNumber`).
5. Optionally adjust `NEXT_PUBLIC_DEFAULT_CHAIN` and `NEXT_PUBLIC_SUPPORTED_CHAINS` to match your contract’s network.

## Development

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

## Production

```bash
pnpm build
pnpm start
```

Make sure `.env` is configured in your hosting environment (e.g., Vercel Project Settings).

## Quick Test Flow

1. Start the dev server and open the app.
2. Log in; an embedded wallet is created and shown in the header.
3. Confirm the counter loads its current value (ensure contract address & chain match).
4. Click +/− to submit a transaction; a toast displays the tx hash.

## Troubleshooting

- “Session signer not configured”: set `NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID` and `PRIVY_SESSION_SIGNER_PRIVATE_KEY`.
- “Insufficient funds”: fund the embedded wallet or configure gas sponsorship (see comment in `app/api/counter/route.ts`).
- “Wrong network”: align `NEXT_PUBLIC_DEFAULT_CHAIN`/`NEXT_PUBLIC_SUPPORTED_CHAINS` with the contract’s network.

## Useful Paths

- `lib/counterAbi.ts`: ABI for the sample Counter.
- `lib/chains.ts`: Chain helpers and defaults.
- `app/api/counter/route.ts`: Server endpoint for delegated transactions.
- `components/Counter.tsx`: Counter UI and reads.
- `components/WalletDropdown.tsx`: Wallet actions and session signer toggle.
- `components/SessionSigners/*`: Auto‑enable and status indicator.
