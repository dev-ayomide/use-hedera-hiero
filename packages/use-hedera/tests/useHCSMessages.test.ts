import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useHCSMessages } from "../src/hooks/useHCSMessages";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

const mockMessages = {
  messages: [
    {
      chunk_info: null,
      consensus_timestamp: "1234567890.123456789",
      message: btoa("Hello, Hedera!"),
      payer_account_id: "0.0.1234",
      running_hash: "abc123",
      running_hash_version: 2,
      sequence_number: 1,
      topic_id: "0.0.9999",
    },
    {
      chunk_info: null,
      consensus_timestamp: "1234567891.123456789",
      message: btoa("Second message"),
      payer_account_id: "0.0.1234",
      running_hash: "def456",
      running_hash_version: 2,
      sequence_number: 2,
      topic_id: "0.0.9999",
    },
  ],
  links: { next: null },
};

describe("useHCSMessages", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("fetches and decodes messages", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    const { result } = renderHook(() => useHCSMessages({ topicId: "0.0.9999" }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.decodedMessages[0].text).toBe("Hello, Hedera!");
    expect(result.current.decodedMessages[1].text).toBe("Second message");
  });

  it("handles empty messages", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [], links: { next: null } }),
    });

    const { result } = renderHook(() => useHCSMessages({ topicId: "0.0.9999" }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.decodedMessages).toHaveLength(0);
  });

  it("skips fetch when topicId is null", () => {
    const { result } = renderHook(() => useHCSMessages({ topicId: null }), { wrapper });
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });

  it("respects limit and order parameters", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    renderHook(() => useHCSMessages({ topicId: "0.0.9999", limit: 10, order: "asc" }), { wrapper });
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining("limit=10")));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("order=asc"));
  });
});
