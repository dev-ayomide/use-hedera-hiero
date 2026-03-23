# use-hedera

React hooks for [Hedera / Hiero](https://hedera.com) networks — TypeScript-first, composable, and production-oriented.

This package is published from the [`use-hedera` monorepo](https://github.com/dev-ayomide/use-hedera-hiero). For full documentation, examples, and the Next.js demo, see the **repository root [README.md](../../README.md)**.

## Install

```bash
pnpm add use-hedera
# or: npm install use-hedera / yarn add use-hedera
```

Peer dependencies: `react` and `react-dom` (>= 18). The library bundles a dependency on `@hashgraph/sdk` for transaction submission.

## Quick usage

```tsx
import { HederaProvider, useHederaBalance } from "use-hedera";

const config = {
  network: "testnet" as const,
  accountId: "0.0.xxxxx",
  privateKey: process.env.HEDERA_PRIVATE_KEY!,
};

export function App() {
  return (
    <HederaProvider config={config}>
      <Balance />
    </HederaProvider>
  );
}

function Balance() {
  const { balance, isLoading, error, refetch } = useHederaBalance("0.0.xxxxx");
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <p>
      {balance?.hbar} ℏ <button type="button" onClick={() => refetch()}>Refresh</button>
    </p>
  );
}
```

## Development

From the monorepo root:

```bash
pnpm install
pnpm --filter use-hedera build
pnpm --filter use-hedera test
```

## License

MIT — see [LICENSE](../../LICENSE).
