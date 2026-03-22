# use-hedera

> React hooks for Hedera/Hiero networks — TypeScript-first, composable, production-ready

[![CI](https://github.com/yourusername/use-hedera/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/use-hedera/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/use-hedera.svg)](https://badge.fury.io/js/use-hedera)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**use-hedera** is the Hedera equivalent of `wagmi` for Ethereum — a TypeScript-first React hooks library that abstracts the `@hashgraph/sdk` into composable, developer-friendly hooks with full type safety, loading states, and error handling.

Instead of writing 40 lines of SDK boilerplate, you can now do:

```tsx
const { balance, isLoading } = useHederaBalance("0.0.1234");
```

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

To run locally:

```bash
pnpm install
cd apps/demo
cp .env.example .env.local
# Add your testnet credentials
pnpm dev
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

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

All commits must be signed off with the [Developer Certificate of Origin](https://developercertificate.org/).

## License

MIT © [Your Name]

## Acknowledgments

Built for the Hedera/Hiero ecosystem. Inspired by [wagmi](https://wagmi.sh) for Ethereum.

---

**Made with ❤️ for Hedera developers**
