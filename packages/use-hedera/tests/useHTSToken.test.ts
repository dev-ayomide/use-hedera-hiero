import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useHTSToken } from "../src/hooks/useHTSToken";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

const mockTokenData = {
  admin_key: { _type: "ED25519", key: "abcd1234" },
  auto_renew_account: null,
  auto_renew_period: null,
  created_timestamp: "1234567890.123456789",
  decimals: "8",
  deleted: false,
  expiry_timestamp: null,
  fee_schedule_key: null,
  freeze_default: false,
  initial_supply: "1000000",
  max_supply: "10000000",
  memo: "Test token",
  modified_timestamp: "1234567890.123456789",
  name: "Test Token",
  pause_key: null,
  pause_status: "UNPAUSED",
  supply_key: { _type: "ED25519", key: "abcd1234" },
  supply_type: "FINITE" as const,
  symbol: "TST",
  token_id: "0.0.9999",
  total_supply: "1000000",
  treasury_account_id: "0.0.1234",
  type: "FUNGIBLE_COMMON" as const,
  wipe_key: null,
};

describe("useHTSToken", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("fetches token data successfully", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenData,
    });

    const { result } = renderHook(() => useHTSToken("0.0.9999"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.token).toEqual(mockTokenData);
    expect(result.current.token?.name).toBe("Test Token");
    expect(result.current.token?.symbol).toBe("TST");
  });

  it("handles fetch errors", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useHTSToken("0.0.9999"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("skips fetch when tokenId is null", () => {
    const { result } = renderHook(() => useHTSToken(null), { wrapper });
    expect(result.current.token).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("provides transfer and associate functions", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenData,
    });

    const { result } = renderHook(() => useHTSToken("0.0.9999"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(typeof result.current.transfer).toBe("function");
    expect(typeof result.current.associate).toBe("function");
    expect(result.current.isTransacting).toBe(false);
  });
});
