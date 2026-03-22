import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useHederaClient } from "../src/hooks/useHederaClient";
import React from "react";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

describe("useHederaClient", () => {
  it("throws when used outside HederaProvider", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useHederaClient());
    }).toThrow(/useHederaContext must be used within HederaProvider/);
    err.mockRestore();
  });

  it("returns network and accountId from config", () => {
    const { result } = renderHook(() => useHederaClient(), { wrapper });

    expect(result.current.network).toBe("testnet");
    expect(result.current.accountId).toBe("0.0.1234");
  });

  it("reports disconnected when operator setup fails", () => {
    const badConfig = { ...mockConfig, privateKey: "__invalid__" };
    const badWrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(HederaProvider, { config: badConfig }, children);

    const { result } = renderHook(() => useHederaClient(), { wrapper: badWrapper });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.client).toBeNull();
  });

  it("reports connected with a valid operator config", () => {
    const { result } = renderHook(() => useHederaClient(), { wrapper });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.client).not.toBeNull();
  });
});
