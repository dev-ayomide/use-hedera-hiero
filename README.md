# use-hedera

> React hooks for Hedera/Hiero networks — TypeScript-first, composable, production-ready

[![CI](https://github.com/dev-ayomide/use-hedera-hiero/actions/workflows/ci.yml/badge.svg)](https://github.com/dev-ayomide/use-hedera-hiero/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/use-hedera.svg)](https://badge.fury.io/js/use-hedera)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**use-hedera** is the Hedera equivalent of `wagmi` for Ethereum — a TypeScript-first React hooks library that abstracts the `@hashgraph/sdk` into composable, developer-friendly hooks with full type safety, loading states, and error handling.

Instead of writing 40 lines of SDK boilerplate, you can now do:

```tsx
const { balance, isLoading } = useHederaBalance("0.0.1234");
```

## What is this? (plain English)

**For a friend who doesn’t write code:**

Hedera is a public network people use to build apps that need **shared, trusted record-keeping**—balances, tokens, timestamps, messages, and scheduled payments.

**use-hedera** is a **toolkit for app builders** who use **React** (a common way to make websites and web apps). Instead of every team reinventing the same low-level “plumbing,” this library gives them **ready-made building blocks**: “show this account’s balance,” “read messages from this feed,” “send a token,” “schedule a transfer later.”

The **small website in `apps/demo`** is not the product by itself—it’s a **showroom**: it proves the toolkit works on Hedera **testnet** (play money). The real product is the **library** other developers can install and reuse in **their** products.

---

## Features

- 🎣 **7 React Hooks** — Account queries, balances, HCS messages, HTS tokens, scheduled transactions
- 🔒 **Type-Safe** — Full TypeScript support with strict typing
- ⚡ **Zero Config** — Works out of the box with sensible defaults
- 🔄 **Auto-Refetch** — Built-in refresh and pagination support
- 🧪 **Well-Tested** — Comprehensive test coverage with Vitest
- 📦 **Tree-Shakeable** — Only bundle what you use
- 🌐 **Network Support** — Mainnet, Testnet, and Previewnet

## Installation

```bash
npm install use-hedera
# or
pnpm add use-hedera
# or
yarn add use-hedera
```

## Quick Start

### 1. Wrap your app with HederaProvider

```tsx
import { HederaProvider } from "use-hedera";

const config = {
  network: "testnet",
  accountId: "0.0.1234",
  privateKey: "302e...",
};

function App() {
  return (
    <HederaProvider config={config}>
      <YourApp />
    </HederaProvider>
  );
}
```

### 2. Use hooks in your components

```tsx
import { useHederaBalance } from "use-hedera";

function WalletBalance() {
  const { balance, isLoading, error } = useHederaBalance("0.0.1234");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Balance: {balance?.hbar} ℏ</div>;
}
```

## API Reference

### Hooks

#### `useHederaClient()`

Get the raw Hedera SDK client instance.

```tsx
const { client, network, accountId, isConnected } = useHederaClient();
```

#### `useHederaAccount(accountId)`

Query account information from Mirror Node.

```tsx
const { account, isLoading, error, refetch } = useHederaAccount("0.0.1234");
```

#### `useHederaBalance(accountId)`

Get formatted HBAR and token balances.

```tsx
const { balance, isLoading, error, refetch } = useHederaBalance("0.0.1234");

console.log(balance?.hbar); // 5.0
console.log(balance?.tinybars); // 500000000
console.log(balance?.tokens); // [{ tokenId: "0.0.9999", balance: 100 }]
```

#### `useHCSMessages({ topicId, limit?, order? })`

Read and send messages to HCS topics.

```tsx
const { messages, decodedMessages, sendMessage, isSending } = useHCSMessages({
  topicId: "0.0.9999",
  limit: 25,
  order: "desc",
});

// Send a message
const txId = await sendMessage("Hello, Hedera!");
```

#### `useHTSToken(tokenId)`

Query token info and perform token operations.

```tsx
const { token, transfer, associate, isTransacting } = useHTSToken("0.0.9999");

// Transfer tokens
const txId = await transfer("0.0.5678", 100);

// Associate token with account
const txId = await associate("0.0.5678");
```

#### `useScheduledTransaction()`

Schedule transactions for delayed execution.

```tsx
import { TransferTransaction, Hbar } from "@hashgraph/sdk";

const { schedule, isLoading, lastScheduleId } = useScheduledTransaction();

const transfer = new TransferTransaction()
  .addHbarTransfer("0.0.1234", Hbar.fromTinybars(-100))
  .addHbarTransfer("0.0.5678", Hbar.fromTinybars(100));

const scheduleId = await schedule({
  inner: transfer,
  memo: "Scheduled payment",
  expirationTime: new Date(Date.now() + 86400000),
});
```

#### `useMirrorNode<T>(path)`

Low-level hook for querying any Mirror Node endpoint.

```tsx
const { data, isLoading, error, refetch, fetchNext, hasMore } =
  useMirrorNode<MirrorNodeAccount>("/api/v1/accounts/0.0.1234");
```

### Utilities

```tsx
import {
  tinybarsToHbar,
  hbarToTinybars,
  formatHbar,
  shortenAccountId,
  consensusTimestampToDate,
} from "use-hedera";

tinybarsToHbar(500_000_000); // 5
hbarToTinybars(5); // 500000000
formatHbar(500_000_000); // "5.0000 ℏ"
shortenAccountId("0.0.12345678"); // "0.0.1234…5678"
consensusTimestampToDate("1234567890.123456789"); // Date object
```

### Types

All TypeScript types are fully exported:

```tsx
import type {
  HederaConfig,
  HederaNetwork,
  MirrorNodeAccount,
  MirrorNodeToken,
  HCSMessage,
  HederaBalance,
} from "use-hedera";
```

## Demo App

Check out the [demo app](./apps/demo) for live examples of all hooks in action.

To run locally (from repo root):

```bash
pnpm install
pnpm dev
```

Or from `apps/demo`: copy `apps/demo/.env.example` to `apps/demo/.env.local`, add testnet credentials, then `pnpm dev`.

Optional — create a **testnet topic** for the Consensus demo (uses the same `.env.local`):

```bash
pnpm --filter demo create-topic
```

Get free testnet HBAR from: https://portal.hedera.com

## Architecture

```
use-hedera/
├── packages/use-hedera/          # Main library
│   ├── src/
│   │   ├── hooks/                # React hooks
│   │   ├── providers/            # React context provider
│   │   ├── utils/                # Utility functions
│   │   └── types/                # TypeScript types
│   └── tests/                    # Vitest tests
└── apps/demo/                    # Next.js demo app
```

## Product strategy (MVP, roadmap & hackathon alignment)

This section summarizes how the project is positioned for **sustained use** beyond a hackathon and maps to common **judging rubrics** (feasibility, execution, success, validation).

### MVP (what ships today)

| Area | Delivered |
|------|-----------|
| **Library** | `HederaProvider` + 7 hooks: client, account, balance, mirror path, HCS messages, HTS token ops, scheduled transactions |
| **Quality** | TypeScript types, Vitest tests, GitHub Actions CI (lint, test, build) |
| **Demo** | Next.js app exercising read + write flows on testnet |
| **Open source** | MIT license, `CONTRIBUTING.md`, DCO sign-offs (`git commit -s`) |

### Lean canvas (business model at a glance)

| Block | Summary |
|--------|---------|
| **Problem** | React teams avoid or slow-roll Hedera apps because SDK setup and patterns are repetitive and easy to get wrong. |
| **Customer segments** | Frontend / full-stack teams building on Hedera or Hiero-compatible networks; educators and hackathon participants. |
| **Unique value** | **Composable hooks** with loading/error/refetch conventions—less boilerplate, faster shipping, consistent UX patterns. |
| **Solution** | Open-source npm package `use-hedera` + reference demo. |
| **Channels** | GitHub, npm, Hedera/Hiero Discord & forums, hackathons, blog posts, tutorial links. |
| **Costs** | Maintainer time; no infra bill for the library itself (apps pay their own network fees). |
| **Revenue (optional / future)** | Sponsorships, paid support, or a future “pro” layer—**not required** for core OSS adoption. |

### Go-to-market (GTM)

1. **Publish** stable releases on npm and keep the repo public with a green CI badge.  
2. **Document** install + quickstart (this README) and link the demo.  
3. **Reach** Hedera Discord developers and share minimal reproduction examples.  
4. **Iterate** from GitHub issues and discussion threads.

### Validation & feedback loops

| When | What |
|------|------|
| **Now** | Issues and PRs on GitHub; comments from hackathon judges and peers. |
| **Next** | Short survey link in README or pinned discussion; 5–10 short calls or async feedback from teams building React apps on Hedera. |
| **Ongoing** | Track which hooks are requested most; prioritize missing flows (e.g. wallet connectors, more mirror endpoints). |

### Success metrics (developer tooling)

End-user MAU/TPS are **indirect** for a library. We focus on **ecosystem leverage**:

- npm **downloads** and **dependent** repositories over time  
- GitHub **stars**, **forks**, and **active issues** (signal of use)  
- **Apps and tutorials** linking to or depending on `use-hedera`  
- **Fewer support threads** about basic SDK wiring (qualitative)

Stronger Hedera adoption follows when **more apps ship faster** using these patterns.

### Roadmap (post-hackathon)

- Semver releases and changelog  
- Optional **HashConnect** / wallet recipes in docs  
- More mirror-backed hooks or helpers where patterns repeat  
- Demo **a11y** pass (focus order, contrast, live regions) where needed  

### Design decisions (execution)

- **Hooks + provider** instead of class singletons—fits React and testability.  
- **Mirror Node for reads, SDK for writes**—matches Hedera security and architecture guidance.  
- **Demo uses `NEXT_PUBLIC_*` keys** for hackathon speed; **production apps** should keep signing keys on a server or use a wallet flow, not in the browser bundle.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

All commits must be signed off with the [Developer Certificate of Origin](https://developercertificate.org/).

## License

MIT © use-hedera contributors

## Acknowledgments

Built for the Hedera/Hiero ecosystem. Inspired by [wagmi](https://wagmi.sh) for Ethereum.

---

**Made with ❤️ for Hedera developers**
