import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useMirrorNode } from "../src/hooks/useMirrorNode";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

describe("useMirrorNode", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("fetches data successfully", async () => {
    const mockData = { test: "data" };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMirrorNode<any>("/api/v1/test"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch errors", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useMirrorNode<any>("/api/v1/test"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("500");
  });

  it("skips fetch when path is null", () => {
    const { result } = renderHook(() => useMirrorNode<any>(null), { wrapper });
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("handles pagination with next link", async () => {
    const mockData = {
      items: [1, 2, 3],
      links: { next: "/api/v1/test?page=2" },
    };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMirrorNode<any>("/api/v1/test"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasMore).toBe(true);
    expect(typeof result.current.fetchNext).toBe("function");
  });

  it("refetch triggers another mirror request", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ test: "data" }),
    });

    const { result } = renderHook(() => useMirrorNode<any>("/api/v1/test"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetch).toHaveBeenCalledTimes(1);

    result.current.refetch();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
