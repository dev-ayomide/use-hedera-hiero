"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Client } from "@hashgraph/sdk";
import { HederaConfig, HederaContextValue } from "../types";

export const HederaContext = createContext<HederaContextValue | null>(null);

export interface HederaProviderProps {
  config: HederaConfig;
  children: ReactNode;
}

/**
 * HederaProvider - React context provider for Hedera client configuration
 *
 * Wraps your app to provide Hedera SDK client and configuration to all hooks.
 *
 * @example
 * ```tsx
 * const config: HederaConfig = {
 *   network: "testnet",
 *   accountId: "0.0.1234",
 *   privateKey: "302e..."
 * };
 *
 * <HederaProvider config={config}>
 *   <App />
 * </HederaProvider>
 * ```
 */
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

/**
 * useHederaContext - Access Hedera context
 *
 * Internal hook used by other hooks to access the Hedera client and config.
 * Most users should use the specific hooks (useHederaBalance, etc.) instead.
 *
 * @throws Error if used outside HederaProvider
 * @returns HederaContextValue containing client, config, and connection status
 */
export function useHederaContext(): HederaContextValue {
  const ctx = useContext(HederaContext);
  if (!ctx) throw new Error("useHederaContext must be used within HederaProvider");
  return ctx;
}
