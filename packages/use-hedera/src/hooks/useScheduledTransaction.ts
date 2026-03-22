import { useState, useCallback } from "react";
import { ScheduleCreateTransaction, Timestamp } from "@hashgraph/sdk";
import { useHederaClient } from "./useHederaClient";
import { ScheduleParams, ScheduledTransactionState } from "../types";

/**
 * useScheduledTransaction - Schedule transactions for delayed execution
 *
 * Creates scheduled transactions that can execute at a future time or
 * after collecting multiple signatures. Useful for multi-sig workflows
 * and time-locked operations.
 *
 * @example
 * ```tsx
 * import { TransferTransaction, Hbar } from "@hashgraph/sdk";
 *
 * const { schedule, isLoading, lastScheduleId } = useScheduledTransaction();
 *
 * const scheduleTransfer = async () => {
 *   const transfer = new TransferTransaction()
 *     .addHbarTransfer("0.0.1234", Hbar.fromTinybars(-100))
 *     .addHbarTransfer("0.0.5678", Hbar.fromTinybars(100));
 *
 *   const scheduleId = await schedule({
 *     inner: transfer,
 *     memo: "Scheduled payment",
 *     expirationTime: new Date(Date.now() + 86400000), // 24 hours
 *   });
 *
 *   if (scheduleId) console.log("Scheduled:", scheduleId);
 * };
 *
 * return (
 *   <div>
 *     <button onClick={scheduleTransfer} disabled={isLoading}>
 *       Schedule Transfer
 *     </button>
 *     {lastScheduleId && <p>Last scheduled: {lastScheduleId}</p>}
 *   </div>
 * );
 * ```
 *
 * @returns Object containing schedule function, loading state, error, and last schedule ID
 */
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
        if (expirationTime) tx = tx.setExpirationTime(Timestamp.fromDate(expirationTime));
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
