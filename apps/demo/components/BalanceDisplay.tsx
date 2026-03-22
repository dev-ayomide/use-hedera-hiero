"use client";
import { useState } from "react";
import { useHederaBalance } from "use-hedera";

export default function BalanceDisplay() {
  const [accountId, setAccountId] = useState("");
  const [lookupId, setLookupId] = useState<string | null>(null);
  const { balance, isLoading, error, refetch } = useHederaBalance(lookupId);

  const handleCheck = () => {
    if (accountId.trim()) {
      setLookupId(accountId.trim());
    }
  };

  return (
    <div className="card">
      <h2>Balances</h2>
      <p className="panel__hint">HBAR plus HTS token rows in one formatted read.</p>
      <div className="input-group">
        <label htmlFor="balance-account-id">Account ID</label>
        <input
          id="balance-account-id"
          type="text"
          placeholder="0.0.1234"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          autoComplete="off"
        />
      </div>
      <button type="button" className="btn" onClick={handleCheck} disabled={isLoading}>
        {isLoading ? "Loading…" : "Check balance"}
      </button>

      {error && (
        <div className="error" role="alert">
          {error.message}
        </div>
      )}

      {balance && (
        <div style={{ marginTop: "var(--space-lg)" }}>
          <div className="info-row">
            <strong>HBAR</strong>
            <span>{balance.hbar.toFixed(4)} ℏ</span>
          </div>
          <div className="info-row">
            <strong>Tinybars</strong>
            <span className="code-inline">{balance.tinybars.toLocaleString()}</span>
          </div>

          {balance.tokens.length > 0 && (
            <>
              <h3 className="section-label">Token balances</h3>
              <div className="token-grid">
                {balance.tokens.map((token) => (
                  <div key={token.tokenId} className="token-item">
                    <strong>{token.tokenId}</strong>
                    <span className="code-inline">{token.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <button type="button" className="btn btn--ghost btn--block" onClick={() => refetch()} style={{ marginTop: "var(--space-md)" }}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
