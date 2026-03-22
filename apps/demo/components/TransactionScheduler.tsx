"use client";
import { useState } from "react";
import { useScheduledTransaction, useHederaClient } from "use-hedera";
import { TransferTransaction, Hbar } from "@hashgraph/sdk";

export default function TransactionScheduler() {
  const { client } = useHederaClient();
  const { schedule, isLoading, error, lastScheduleId } = useScheduledTransaction();
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSchedule = async () => {
    if (!client || !toAccount.trim() || !amount.trim()) return;

    const transfer = new TransferTransaction()
      .addHbarTransfer(client.operatorAccountId!, Hbar.fromTinybars(-parseInt(amount, 10)))
      .addHbarTransfer(toAccount.trim(), Hbar.fromTinybars(parseInt(amount, 10)));

    const scheduleId = await schedule({
      inner: transfer,
      memo: memo.trim() || "Scheduled transfer",
      expirationTime: new Date(Date.now() + 86400000),
    });

    if (scheduleId) {
      setToAccount("");
      setAmount("");
      setMemo("");
    }
  };

  return (
    <div className="card">
      <h2>Schedule builder</h2>
      <p className="panel__hint">Wraps a native transfer in a schedule—expires in 24h by default.</p>

      {!client ? (
        <div className="error" role="alert">
          Operator client unavailable. Check <span className="code-inline">NEXT_PUBLIC_*</span> env keys.
        </div>
      ) : (
        <>
          <div className="input-group">
            <label htmlFor="sched-to">To account</label>
            <input
              id="sched-to"
              type="text"
              placeholder="0.0.5678"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label htmlFor="sched-amount">Amount (tinybars)</label>
            <input
              id="sched-amount"
              type="number"
              placeholder="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
          </div>

          <div className="input-group">
            <label htmlFor="sched-memo">Schedule memo (optional)</label>
            <input
              id="sched-memo"
              type="text"
              placeholder="Payroll — cycle 12"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn"
            onClick={handleSchedule}
            disabled={isLoading || !toAccount.trim() || !amount.trim()}
          >
            {isLoading ? "Scheduling…" : "Create schedule"}
          </button>

          {error && (
            <div className="error" role="alert" style={{ marginTop: "var(--space-md)" }}>
              {error.message}
            </div>
          )}

          {lastScheduleId && (
            <div className="success" role="status">
              Schedule recorded.
              <span className="code-inline" style={{ display: "block", marginTop: "0.45rem" }}>
                {lastScheduleId}
              </span>
              <p style={{ margin: "0.5rem 0 0", fontSize: "var(--step--1)", opacity: 0.9 }}>
                Expires in 24 hours unless your network rules differ.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
