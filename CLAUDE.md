# CLAUDE.md — use-hedera Project Context

> This file is the single source of truth for building `use-hedera`.
> Read this entire file before writing any code. Do not deviate from the conventions here.

---

## 🧠 Project Overview

**`use-hedera`** is a TypeScript-first React hooks library for interacting with Hedera/Hiero networks.
It is the Hedera equivalent of `wagmi` (Ethereum's hooks library) — abstracting the `@hashgraph/sdk` into
composable, developer-friendly React hooks with full TypeScript types, loading states, and error handling.

**Goal:** Lower the barrier for React/Next.js developers building on Hedera. Instead of 40 lines of SDK
boilerplate, a developer should be able to do:

```tsx
const { balance, isLoading } = useHederaBalance("0.0.1234")
```

This is a **library** (not an app). The library lives in `packages/use-hedera`. There is also a demo
Next.js app in `apps/demo` that uses the library to showcase all hooks.

---

## 📁 Exact Project Structure

```
use-hedera/
├── packages/
│   └── use-hedera/
│       ├── src/
│       │   ├── hooks/
│       │   │   ├── useHederaClient.ts
│       │   │   ├── useHederaAccount.ts
│       │   │   ├── useHederaBalance.ts
│       │   │   ├── useHCSMessages.ts
│       │   │   ├── useHTSToken.ts
│       │   │   ├── useMirrorNode.ts
│       │   │   └── useScheduledTransaction.ts
│       │   ├── providers/
│       │   │   └── HederaProvider.tsx
│       │   ├── utils/
│       │   │   ├── mirrorNode.ts
│       │   │   └── formatters.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── tests/
│       │   ├── useHederaBalance.test.ts
│       │   ├── useHederaAccount.test.ts
│       │   ├── useHCSMessages.test.ts
│       │   ├── useHTSToken.test.ts
│       │   └── useMirrorNode.test.ts
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsup.config.ts
│       └── vitest.config.ts
├── apps/
│   └── demo/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── providers.tsx
│       ├── components/
│       │   ├── AccountLookup.tsx
│       │   ├── BalanceDisplay.tsx
│       │   ├── TopicFeed.tsx
│       │   ├── TokenInfo.tsx
│       │   └── TransactionScheduler.tsx
│       ├── package.json
│       └── next.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE           ← MIT
├── README.md
├── package.json      ← monorepo root
└── pnpm-workspace.yaml
```

---

## ⚙️ Monorepo Configuration

### `/package.json` (root)
```json
{
  "name": "use-hedera-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "dev": "pnpm --filter demo dev"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

### `/pnpm-workspace.yaml`
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### `/packages/use-hedera/package.json`
```json
{
  "name": "use-hedera",
  "version": "0.1.0",
  "description": "React hooks for Hedera/Hiero networks — TypeScript-first, composable, production-ready",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "@hashgraph/sdk": "^2.50.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@types/react": "^18.0.0",
    "tsup": "^8.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^24.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  },
  "license": "MIT"
}
```

### `/packages/use-hedera/tsup.config.ts`
```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@hashgraph/sdk"],
  treeshake: true,
});
```

### `/packages/use-hedera/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### `/packages/use-hedera/vitest.config.ts`
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

---

## 🔑 TypeScript Types

### `/packages/use-hedera/src/types/index.ts`

```ts
// ─── Network ───────────────────────────────────────────────
export type HederaNetwork = "mainnet" | "testnet" | "previewnet";

// ─── Provider Config ───────────────────────────────────────
export interface HederaConfig {
  network: HederaNetwork;
  accountId: string;       // e.g. "0.0.1234"
  privateKey: string;      // hex or DER encoded
  mirrorNodeUrl?: string;  // optional override
}

// ─── Context ───────────────────────────────────────────────
export interface HederaContextValue {
  client: import("@hashgraph/sdk").Client | null;
  config: HederaConfig;
  isConnected: boolean;
}

// ─── Mirror Node: Account ──────────────────────────────────
export interface MirrorNodeAccount {
  account: string;
  alias: string | null;
  auto_renew_period: number;
  balance: {
    balance: number;        // in tinybars
    timestamp: string;
    tokens: Array<{
      token_id: string;
      balance: number;
    }>;
  };
  created_timestamp: string;
  decline_reward: boolean;
  deleted: boolean;
  ethereum_address: string | null;
  expiry_timestamp: string | null;
  key: {
    _type: string;
    key: string;
  };
  max_automatic_token_associations: number;
  memo: string;
  pending_reward: number;
  receiver_sig_required: boolean;
}

// ─── Mirror Node: Token ────────────────────────────────────
export interface MirrorNodeToken {
  admin_key: { _type: string; key: string } | null;
  auto_renew_account: string | null;
  auto_renew_period: number | null;
  created_timestamp: string;
  decimals: string;
  deleted: boolean;
  expiry_timestamp: string | null;
  fee_schedule_key: null;
  freeze_default: boolean;
  initial_supply: string;
  max_supply: string;
  memo: string;
  modified_timestamp: string;
  name: string;
  pause_key: null;
  pause_status: string;
  supply_key: { _type: string; key: string } | null;
  supply_type: "FINITE" | "INFINITE";
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: "FUNGIBLE_COMMON" | "NON_FUNGIBLE_UNIQUE";
  wipe_key: { _type: string; key: string } | null;
}

// ─── Mirror Node: HCS Message ──────────────────────────────
export interface HCSMessage {
  chunk_info: null | {
    initial_transaction_id: string;
    number: number;
    total: number;
  };
  consensus_timestamp: string;
  message: string;         // base64 encoded
  payer_account_id: string;
  running_hash: string;
  running_hash_version: number;
  sequence_number: number;
  topic_id: string;
}

// ─── Mirror Node: Transaction ──────────────────────────────
export interface MirrorNodeTransaction {
  bytes: string | null;
  charged_tx_fee: number;
  consensus_timestamp: string;
  entity_id: string | null;
  max_fee: string;
  memo_base64: string;
  name: string;
  nonce: number;
  parent_consensus_timestamp: string | null;
  result: string;
  scheduled: boolean;
  transaction_hash: string;
  transaction_id: string;
  transfers: Array<{
    account: string;
    amount: number;
    is_approval: boolean;
  }>;
  valid_duration_seconds: string;
  valid_start_timestamp: string;
}

// ─── Mirror Node: Paginated Response ───────────────────────
export interface MirrorNodePaginatedResponse<T> {
  [key: string]: T[] | { next: string | null };
  links: { next: string | null };
}

// ─── Hook Return Types ─────────────────────────────────────
export interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface HederaBalance {
  hbar: number;            // in HBAR (not tinybars)
  tinybars: number;
  tokens: Array<{
    tokenId: string;
    balance: number;
  }>;
}

export interface HCSMessagesState {
  messages: HCSMessage[];
  decodedMessages: Array<{ raw: HCSMessage; text: string }>;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<string | null>;
  isSending: boolean;
  refetch: () => void;
}

export interface HTSTokenState {
  token: MirrorNodeToken | null;
  isLoading: boolean;
  error: Error | null;
  transfer: (toAccountId: string, amount: number) => Promise<string | null>;
  associate: (accountId: string) => Promise<string | null>;
  isTransacting: boolean;
  refetch: () => void;
}

export interface ScheduledTransactionState {
  schedule: (params: ScheduleParams) => Promise<string | null>;
  isLoading: boolean;
  error: Error | null;
  lastScheduleId: string | null;
}

export interface ScheduleParams {
  inner: import("@hashgraph/sdk").Transaction;
  memo?: string;
  expirationTime?: Date;
  waitForExpiry?: boolean;
}
```

---

## 🧩 Implementation Specs — Every Hook

### `HederaProvider`

**File:** `src/providers/HederaProvider.tsx`

```tsx
"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { Client } from "@hashgraph/sdk";
import { HederaConfig, HederaContextValue } from "../types";

export const HederaContext = createContext<HederaContextValue | null>(null);

export interface HederaProviderProps {
  config: HederaConfig;
  children: ReactNode;
}

export function HederaProvider({ config, children }: HederaProviderProps) {
  const client = useMemo(() => {
    try {
      const c =
        config.network === "mainnet"
          ? Client.forMainnet()
          : config.network === "previewnet"
          ? Client.forPreviewnet()
          : Client.forTestnet();
      c.setOperator(config.accountId, config.privateKey);
      return c;
    } catch {
      return null;
    }
  }, [config.accountId, config.privateKey, config.network]);

  const value: HederaContextValue = {
    client,
    config,
    isConnected: client !== null,
  };

  return (
    <HederaContext.Provider value={value}>{children}</HederaContext.Provider>
  );
}

export function useHederaContext(): HederaContextValue {
  const ctx = useContext(HederaContext);
  if (!ctx) throw new Error("useHederaContext must be used within HederaProvider");
  return ctx;
}
```

---

### `useHederaClient`

**File:** `src/hooks/useHederaClient.ts`

Returns the raw Hedera SDK client from context. Used internally by other hooks.

```ts
import { useHederaContext } from "../providers/HederaProvider";

export function useHederaClient() {
  const { client, config, isConnected } = useHederaContext();
  return { client, network: config.network, accountId: config.accountId, isConnected };
}
```

---

### `useMirrorNode`

**File:** `src/hooks/useMirrorNode.ts`

Generic hook for querying any Mirror Node REST endpoint. All other read hooks use this internally.

**Behaviour:**
- Accepts a path string (e.g. `"/api/v1/accounts/0.0.1234"`)
- Auto-resolves mirror node base URL from network in context
- Returns `{ data, isLoading, error, refetch }`
- Supports pagination via `next` link — expose `fetchNext` function
- Caches last result; sets `isLoading: true` on refetch

**Mirror Node base URLs:**
```
mainnet:    https://mainnet-public.mirrornode.hedera.com
testnet:    https://testnet.mirrornode.hedera.com
previewnet: https://previewnet.mirrornode.hedera.com
```

```ts
import { useState, useEffect, useCallback } from "react";
import { useHederaContext } from "../providers/HederaProvider";
import { getMirrorNodeBaseUrl } from "../utils/mirrorNode";

export function useMirrorNode<T>(path: string | null) {
  const { config } = useHederaContext();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextLink, setNextLink] = useState<string | null>(null);

  const baseUrl = getMirrorNodeBaseUrl(config.network, config.mirrorNodeUrl);

  const fetchData = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Mirror Node error: ${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
      setNextLink(json?.links?.next ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (!path) return;
    fetchData(`${baseUrl}${path}`);
  }, [path, baseUrl, fetchData]);

  const refetch = useCallback(() => {
    if (path) fetchData(`${baseUrl}${path}`);
  }, [path, baseUrl, fetchData]);

  const fetchNext = useCallback(() => {
    if (nextLink) fetchData(`${baseUrl}${nextLink}`);
  }, [nextLink, baseUrl, fetchData]);

  return { data, isLoading, error, refetch, fetchNext, hasMore: nextLink !== null };
}
```

---

### `useHederaAccount`

**File:** `src/hooks/useHederaAccount.ts`

```ts
import { useMirrorNode } from "./useMirrorNode";
import { MirrorNodeAccount } from "../types";

export function useHederaAccount(accountId: string | null) {
  const path = accountId ? `/api/v1/accounts/${accountId}` : null;
  const { data, isLoading, error, refetch } = useMirrorNode<MirrorNodeAccount>(path);
  return { account: data, isLoading, error, refetch };
}
```

---

### `useHederaBalance`

**File:** `src/hooks/useHederaBalance.ts`

Builds on `useHederaAccount` but formats the balance nicely.

```ts
import { useHederaAccount } from "./useHederaAccount";
import { HederaBalance } from "../types";
import { tinybarsToHbar } from "../utils/formatters";

export function useHederaBalance(accountId: string | null) {
  const { account, isLoading, error, refetch } = useHederaAccount(accountId);

  const balance: HederaBalance | null = account
    ? {
        tinybars: account.balance.balance,
        hbar: tinybarsToHbar(account.balance.balance),
        tokens: account.balance.tokens.map((t) => ({
          tokenId: t.token_id,
          balance: t.balance,
        })),
      }
    : null;

  return { balance, isLoading, error, refetch };
}
```

---

### `useHCSMessages`

**File:** `src/hooks/useHCSMessages.ts`

**Behaviour:**
- Reads messages from a HCS topic via Mirror Node
- Decodes base64 message content to UTF-8 text
- Exposes `sendMessage(text)` that submits a real `TopicMessageSubmitTransaction` via the SDK client
- `sendMessage` returns the transaction ID string on success, null on failure
- After sending, auto-refetches the message list

```ts
import { useState, useCallback } from "react";
import { TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk";
import { useMirrorNode } from "./useMirrorNode";
import { useHederaClient } from "./useHederaClient";
import { MirrorNodePaginatedResponse, HCSMessage } from "../types";
import { decodeBase64 } from "../utils/formatters";

interface UseHCSMessagesOptions {
  topicId: string | null;
  limit?: number;
  order?: "asc" | "desc";
}

export function useHCSMessages({ topicId, limit = 25, order = "desc" }: UseHCSMessagesOptions) {
  const { client } = useHederaClient();
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<Error | null>(null);

  const path = topicId
    ? `/api/v1/topics/${topicId}/messages?limit=${limit}&order=${order}`
    : null;

  const { data, isLoading, error, refetch } = useMirrorNode<
    MirrorNodePaginatedResponse<HCSMessage>
  >(path);

  const messages: HCSMessage[] = (data as any)?.messages ?? [];

  const decodedMessages = messages.map((msg) => ({
    raw: msg,
    text: decodeBase64(msg.message),
  }));

  const sendMessage = useCallback(
    async (message: string): Promise<string | null> => {
      if (!client || !topicId) return null;
      setIsSending(true);
      setSendError(null);
      try {
        const tx = await new TopicMessageSubmitTransaction()
          .setTopicId(TopicId.fromString(topicId))
          .setMessage(message)
          .execute(client);
        const receipt = await tx.getReceipt(client);
        refetch();
        return tx.transactionId.toString();
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setSendError(err);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [client, topicId, refetch]
  );

  return {
    messages,
    decodedMessages,
    isLoading,
    error: error ?? sendError,
    sendMessage,
    isSending,
    refetch,
  };
}
```

---

### `useHTSToken`

**File:** `src/hooks/useHTSToken.ts`

**Behaviour:**
- Reads token info from Mirror Node
- Exposes `transfer(toAccountId, amount)` → `TransferTransaction` via SDK
- Exposes `associate(accountId)` → `TokenAssociateTransaction` via SDK
- Both write functions return transaction ID string or null

```ts
import { useState, useCallback } from "react";
import {
  TransferTransaction,
  TokenAssociateTransaction,
  TokenId,
  AccountId,
  Hbar,
} from "@hashgraph/sdk";
import { useMirrorNode } from "./useMirrorNode";
import { useHederaClient } from "./useHederaClient";
import { MirrorNodeToken } from "../types";

export function useHTSToken(tokenId: string | null) {
  const { client } = useHederaClient();
  const [isTransacting, setIsTransacting] = useState(false);
  const [txError, setTxError] = useState<Error | null>(null);

  const path = tokenId ? `/api/v1/tokens/${tokenId}` : null;
  const { data: token, isLoading, error, refetch } = useMirrorNode<MirrorNodeToken>(path);

  const transfer = useCallback(
    async (toAccountId: string, amount: number): Promise<string | null> => {
      if (!client || !tokenId) return null;
      setIsTransacting(true);
      setTxError(null);
      try {
        const tx = await new TransferTransaction()
          .addTokenTransfer(TokenId.fromString(tokenId), client.operatorAccountId!, -amount)
          .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(toAccountId), amount)
          .execute(client);
        await tx.getReceipt(client);
        return tx.transactionId.toString();
      } catch (e) {
        setTxError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setIsTransacting(false);
      }
    },
    [client, tokenId]
  );

  const associate = useCallback(
    async (accountId: string): Promise<string | null> => {
      if (!client || !tokenId) return null;
      setIsTransacting(true);
      setTxError(null);
      try {
        const tx = await new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(accountId))
          .setTokenIds([TokenId.fromString(tokenId)])
          .execute(client);
        await tx.getReceipt(client);
        return tx.transactionId.toString();
      } catch (e) {
        setTxError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setIsTransacting(false);
      }
    },
    [client, tokenId]
  );

  return {
    token,
    isLoading,
    error: error ?? txError,
    transfer,
    associate,
    isTransacting,
    refetch,
  };
}
```

---

### `useScheduledTransaction`

**File:** `src/hooks/useScheduledTransaction.ts`

```ts
import { useState, useCallback } from "react";
import { ScheduleCreateTransaction } from "@hashgraph/sdk";
import { useHederaClient } from "./useHederaClient";
import { ScheduleParams, ScheduledTransactionState } from "../types";

export function useScheduledTransaction(): ScheduledTransactionState {
  const { client } = useHederaClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastScheduleId, setLastScheduleId] = useState<string | null>(null);

  const schedule = useCallback(
    async ({ inner, memo, expirationTime, waitForExpiry }: ScheduleParams): Promise<string | null> => {
      if (!client) return null;
      setIsLoading(true);
      setError(null);
      try {
        let tx = new ScheduleCreateTransaction().setScheduledTransaction(inner);
        if (memo) tx = tx.setScheduleMemo(memo);
        if (expirationTime) tx = tx.setExpirationTime(expirationTime);
        if (waitForExpiry !== undefined) tx = tx.setWaitForExpiry(waitForExpiry);
        const submitted = await tx.execute(client);
        const receipt = await submitted.getReceipt(client);
        const scheduleId = receipt.scheduleId!.toString();
        setLastScheduleId(scheduleId);
        return scheduleId;
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return { schedule, isLoading, error, lastScheduleId };
}
```

---

## 🛠️ Utilities

### `src/utils/mirrorNode.ts`

```ts
import { HederaNetwork } from "../types";

const MIRROR_NODE_URLS: Record<HederaNetwork, string> = {
  mainnet: "https://mainnet-public.mirrornode.hedera.com",
  testnet: "https://testnet.mirrornode.hedera.com",
  previewnet: "https://previewnet.mirrornode.hedera.com",
};

export function getMirrorNodeBaseUrl(
  network: HederaNetwork,
  override?: string
): string {
  return override ?? MIRROR_NODE_URLS[network];
}
```

### `src/utils/formatters.ts`

```ts
/**
 * Convert tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
 */
export function tinybarsToHbar(tinybars: number): number {
  return tinybars / 100_000_000;
}

/**
 * Convert HBAR to tinybars
 */
export function hbarToTinybars(hbar: number): number {
  return Math.round(hbar * 100_000_000);
}

/**
 * Format HBAR for display
 */
export function formatHbar(tinybars: number, decimals = 4): string {
  return `${tinybarsToHbar(tinybars).toFixed(decimals)} ℏ`;
}

/**
 * Decode base64 string to UTF-8 text (safe — returns original if decode fails)
 */
export function decodeBase64(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return encoded;
  }
}

/**
 * Encode string to base64
 */
export function encodeBase64(text: string): string {
  return btoa(text);
}

/**
 * Shorten an account ID for display: "0.0.12345678" → "0.0.1234…5678"
 */
export function shortenAccountId(accountId: string, chars = 4): string {
  if (accountId.length <= chars * 2 + 3) return accountId;
  const parts = accountId.split(".");
  const last = parts[parts.length - 1];
  if (last.length <= chars * 2) return accountId;
  return `${parts.slice(0, -1).join(".")}.${last.slice(0, chars)}…${last.slice(-chars)}`;
}

/**
 * Format consensus timestamp (seconds.nanos) to JS Date
 */
export function consensusTimestampToDate(timestamp: string): Date {
  const [seconds] = timestamp.split(".");
  return new Date(parseInt(seconds, 10) * 1000);
}
```

---

## 📤 Main Export

### `src/index.ts`

```ts
// Provider
export { HederaProvider } from "./providers/HederaProvider";
export type { HederaProviderProps } from "./providers/HederaProvider";

// Hooks
export { useHederaClient } from "./hooks/useHederaClient";
export { useHederaAccount } from "./hooks/useHederaAccount";
export { useHederaBalance } from "./hooks/useHederaBalance";
export { useHCSMessages } from "./hooks/useHCSMessages";
export { useHTSToken } from "./hooks/useHTSToken";
export { useMirrorNode } from "./hooks/useMirrorNode";
export { useScheduledTransaction } from "./hooks/useScheduledTransaction";

// Utils
export { tinybarsToHbar, hbarToTinybars, formatHbar, decodeBase64, encodeBase64, shortenAccountId, consensusTimestampToDate } from "./utils/formatters";
export { getMirrorNodeBaseUrl } from "./utils/mirrorNode";

// Types
export type {
  HederaNetwork,
  HederaConfig,
  HederaContextValue,
  MirrorNodeAccount,
  MirrorNodeToken,
  HCSMessage,
  MirrorNodeTransaction,
  MirrorNodePaginatedResponse,
  UseAsyncState,
  HederaBalance,
  HCSMessagesState,
  HTSTokenState,
  ScheduledTransactionState,
  ScheduleParams,
} from "./types";
```

---

## 🧪 Test Patterns

All tests use Vitest + jsdom. Mock `fetch` for Mirror Node calls. Mock `@hashgraph/sdk` for SDK calls.

### Example: `tests/useHederaBalance.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useHederaBalance } from "../src/hooks/useHederaBalance";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b6570...",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

describe("useHederaBalance", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns null balance when loading", () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        account: "0.0.1234",
        balance: { balance: 500_000_000, timestamp: "", tokens: [] },
      }),
    });

    const { result } = renderHook(() => useHederaBalance("0.0.1234"), { wrapper });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.balance).toBeNull();
  });

  it("returns formatted HBAR balance", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        account: "0.0.1234",
        balance: {
          balance: 500_000_000,
          timestamp: "",
          tokens: [{ token_id: "0.0.9999", balance: 100 }],
        },
      }),
    });

    const { result } = renderHook(() => useHederaBalance("0.0.1234"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.balance?.hbar).toBe(5);
    expect(result.current.balance?.tinybars).toBe(500_000_000);
    expect(result.current.balance?.tokens).toHaveLength(1);
  });

  it("returns error on failed fetch", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useHederaBalance("0.0.9999"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
```

---

## 🖥️ Demo App

### `apps/demo/app/providers.tsx`

```tsx
"use client";
import { HederaProvider, HederaConfig } from "use-hedera";

const config: HederaConfig = {
  network: "testnet",
  accountId: process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!,
  privateKey: process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY!,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <HederaProvider config={config}>{children}</HederaProvider>;
}
```

### Demo Pages (build these 5 components):

| Component | Hook Used | What It Shows |
|-----------|-----------|---------------|
| `AccountLookup.tsx` | `useHederaAccount` | Enter account ID → show account details |
| `BalanceDisplay.tsx` | `useHederaBalance` | Show HBAR + token balances with refresh |
| `TopicFeed.tsx` | `useHCSMessages` | Live HCS message feed + send new message |
| `TokenInfo.tsx` | `useHTSToken` | Token details + transfer form |
| `TransactionScheduler.tsx` | `useScheduledTransaction` | Schedule a HBAR transfer |

### `.env.local` needed for demo:
```
NEXT_PUBLIC_HEDERA_ACCOUNT_ID=0.0.xxxxxx
NEXT_PUBLIC_HEDERA_PRIVATE_KEY=302e...
```

> ⚠️ Get free testnet HBAR from: https://portal.hedera.com
> ⚠️ Use testnet account only — never expose mainnet private keys

---

## 🔄 GitHub Actions CI

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm -r lint

      - name: Run tests
        run: pnpm -r test

      - name: Build library
        run: pnpm -r build
```

---

## 📝 Commit Convention

**Every commit MUST include a DCO sign-off line:**
```
git commit -m "feat: add useHederaBalance hook

Signed-off-by: Taiwo Ayomide <your@email.com>"
```

**Commit prefixes:**
- `feat:` — new hook or feature
- `fix:` — bug fix
- `docs:` — README, comments
- `test:` — tests only
- `chore:` — config, CI, deps
- `refactor:` — code reorganization

---

## 🚨 Rules — Do Not Break These

1. **Never expose `@hashgraph/sdk` in the public API** — all SDK types should be wrapped in our own types
2. **Every hook must handle 3 states:** loading, success, error — no exceptions
3. **All async operations use try/catch** — never let unhandled rejections bubble up
4. **`useClient` must check `client !== null`** before SDK calls and return `null` early
5. **Mirror Node is read-only** — never write to Hedera via Mirror Node, only via SDK
6. **No `any` in type definitions** — only use it in test mocks if absolutely needed
7. **All public functions and hooks must have JSDoc comments**
8. **The demo app uses env vars for credentials** — no hardcoded keys ever
9. **Library has zero default exports** — named exports only
10. **`"use client"` directive only in Provider and demo components** — hooks are universal

---

## 🎯 Definition of Done

The project is ready to submit when:

- [ ] All 7 hooks are implemented and exported
- [ ] All 5 hooks have at least 3 test cases each
- [ ] CI passes on push to main
- [ ] Demo app deployed to Vercel and all 5 demo components work on testnet
- [ ] README covers: install, quickstart, all hooks with examples, contributing
- [ ] `CONTRIBUTING.md` exists with DCO instructions
- [ ] All commits are DCO signed
- [ ] MIT LICENSE file exists
- [ ] Demo video recorded (max 5 mins, uploaded to YouTube)

---

*This file is the ground truth. When in doubt, refer back here.*
