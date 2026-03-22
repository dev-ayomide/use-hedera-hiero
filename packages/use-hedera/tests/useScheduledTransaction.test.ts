import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import React from "react";

const { scheduleCtor } = vi.hoisted(() => ({
  scheduleCtor: vi.fn(),
}));

vi.mock("@hashgraph/sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@hashgraph/sdk")>();
  return {
    ...actual,
    ScheduleCreateTransaction: scheduleCtor,
  };
});

import { useScheduledTransaction } from "../src/hooks/useScheduledTransaction";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e020100300506032b65700422042000000000000000000000000000000000000000000000000000000000000000000",
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

function mockScheduleChain(overrides?: { executeReject?: Error }) {
  const submitted = {
    getReceipt: vi.fn().mockResolvedValue({
      scheduleId: { toString: () => "0.0.999888" },
    }),
  };
  const chain: Record<string, unknown> = {};
  chain.setScheduledTransaction = vi.fn().mockReturnValue(chain);
  chain.setScheduleMemo = vi.fn().mockReturnValue(chain);
  chain.setExpirationTime = vi.fn().mockReturnValue(chain);
  chain.setWaitForExpiry = vi.fn().mockReturnValue(chain);
  chain.execute = overrides?.executeReject
    ? vi.fn().mockRejectedValue(overrides.executeReject)
    : vi.fn().mockResolvedValue(submitted);
  return chain;
}

describe("useScheduledTransaction", () => {
  beforeEach(() => {
    scheduleCtor.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns null and does not call SDK when client is unavailable", async () => {
    const badConfig = { ...mockConfig, privateKey: "__invalid__" };
    const badWrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(HederaProvider, { config: badConfig }, children);

    scheduleCtor.mockImplementation(() => mockScheduleChain());

    const inner = {} as import("@hashgraph/sdk").Transaction;
    const { result } = renderHook(() => useScheduledTransaction(), { wrapper: badWrapper });

    const id = await result.current.schedule({ inner });
    expect(id).toBeNull();
    expect(scheduleCtor).not.toHaveBeenCalled();
  });

  it("submits schedule and returns schedule id on success", async () => {
    scheduleCtor.mockImplementation(() => mockScheduleChain());

    const inner = {} as import("@hashgraph/sdk").Transaction;
    const { result } = renderHook(() => useScheduledTransaction(), { wrapper });

    const id = await result.current.schedule({ inner, memo: "test memo" });

    expect(id).toBe("0.0.999888");
    await waitFor(() => expect(result.current.lastScheduleId).toBe("0.0.999888"));
    expect(scheduleCtor).toHaveBeenCalled();
    const instance = scheduleCtor.mock.results[0]?.value as {
      setScheduledTransaction: ReturnType<typeof vi.fn>;
      setScheduleMemo: ReturnType<typeof vi.fn>;
      execute: ReturnType<typeof vi.fn>;
    };
    expect(instance.setScheduledTransaction).toHaveBeenCalledWith(inner);
    expect(instance.setScheduleMemo).toHaveBeenCalledWith("test memo");
    expect(instance.execute).toHaveBeenCalled();
  });

  it("captures error and returns null when execution fails", async () => {
    const err = new Error("schedule failed");
    scheduleCtor.mockImplementation(() => mockScheduleChain({ executeReject: err }));

    const inner = {} as import("@hashgraph/sdk").Transaction;
    const { result } = renderHook(() => useScheduledTransaction(), { wrapper });

    const id = await result.current.schedule({ inner });

    expect(id).toBeNull();
    await waitFor(() => expect(result.current.error).toEqual(err));
  });
});
