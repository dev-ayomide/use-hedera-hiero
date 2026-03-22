import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useHederaAccount } from "../src/hooks/useHederaAccount";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

const mockAccountData = {
  account: "0.0.1234",
  alias: null,
  auto_renew_period: 7776000,
  balance: {
    balance: 1000_000_000,
    timestamp: "1234567890.123456789",
    tokens: [],
  },
  created_timestamp: "1234567890.123456789",
  decline_reward: false,
  deleted: false,
  ethereum_address: null,
  expiry_timestamp: null,
  key: { _type: "ED25519", key: "abcd1234" },
  max_automatic_token_associations: 0,
  memo: "Test account",
  pending_reward: 0,
  receiver_sig_required: false,
};

describe("useHederaAccount", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("fetches account data successfully", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAccountData,
    });

    const { result } = renderHook(() => useHederaAccount("0.0.1234"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.account).toEqual(mockAccountData);
    expect(result.current.account?.memo).toBe("Test account");
  });

  it("handles fetch errors", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useHederaAccount("0.0.1234"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("skips fetch when accountId is null", () => {
    const { result } = renderHook(() => useHederaAccount(null), { wrapper });
    expect(result.current.account).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("refetch triggers another mirror request", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAccountData,
    });

    const { result } = renderHook(() => useHederaAccount("0.0.1234"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetch).toHaveBeenCalledTimes(1);

    result.current.refetch();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
