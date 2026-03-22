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
