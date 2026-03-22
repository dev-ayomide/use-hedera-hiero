import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useHederaBalance } from "../src/hooks/useHederaBalance";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
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
        alias: null,
        auto_renew_period: 7776000,
        balance: {
          balance: 500_000_000,
          timestamp: "1234567890.123456789",
          tokens: [{ token_id: "0.0.9999", balance: 100 }],
        },
        created_timestamp: "1234567890.123456789",
        decline_reward: false,
        deleted: false,
        ethereum_address: null,
        expiry_timestamp: null,
        key: { _type: "ED25519", key: "abcd1234" },
        max_automatic_token_associations: 0,
        memo: "",
        pending_reward: 0,
        receiver_sig_required: false,
      }),
    });

    const { result } = renderHook(() => useHederaBalance("0.0.1234"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.balance?.hbar).toBe(5);
    expect(result.current.balance?.tinybars).toBe(500_000_000);
    expect(result.current.balance?.tokens).toHaveLength(1);
    expect(result.current.balance?.tokens[0].tokenId).toBe("0.0.9999");
    expect(result.current.balance?.tokens[0].balance).toBe(100);
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
    expect(result.current.error?.message).toContain("404");
  });

  it("returns null when accountId is null", () => {
    const { result } = renderHook(() => useHederaBalance(null), { wrapper });
    expect(result.current.balance).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
