"use client";
import { useState } from "react";
import { useHederaAccount } from "use-hedera";

export default function AccountLookup() {
  const [accountId, setAccountId] = useState("");
  const [lookupId, setLookupId] = useState<string | null>(null);
  const { account, isLoading, error, refetch } = useHederaAccount(lookupId);

  const handleLookup = () => {
    if (accountId.trim()) {
      setLookupId(accountId.trim());
    }
  };

  return (
    <div className="card">
      <h2>Account lookup</h2>
      <p className="panel__hint">Resolve memo, keys, and creation time from the mirror.</p>
      <div className="input-group">
        <label htmlFor="account-lookup-id">Account ID</label>
        <input
          id="account-lookup-id"
          type="text"
          placeholder="0.0.1234"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          autoComplete="off"
        />
      </div>
      <button type="button" className="btn" onClick={handleLookup} disabled={isLoading}>
        {isLoading ? "Loading…" : "Look up"}
      </button>

      {error && (
        <div className="error" role="alert">
          {error.message}
        </div>
      )}

      {account && (
        <div style={{ marginTop: "var(--space-lg)" }}>
          <div className="info-row">
            <strong>Account</strong>
            <span className="code-inline">{account.account}</span>
          </div>
          <div className="info-row">
            <strong>HBAR</strong>
            <span>{(account.balance.balance / 100_000_000).toFixed(4)} ℏ</span>
          </div>
          <div className="info-row">
            <strong>Memo</strong>
            <span>{account.memo || "—"}</span>
          </div>
          <div className="info-row">
            <strong>Created</strong>
            <span>{new Date(parseInt(account.created_timestamp.split(".")[0], 10) * 1000).toLocaleDateString()}</span>
          </div>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => refetch()} style={{ marginTop: "var(--space-md)" }}>
            Refresh mirror row
          </button>
        </div>
      )}
    </div>
  );
}
