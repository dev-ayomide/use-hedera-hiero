"use client";
import { useState } from "react";
import { useHTSToken } from "use-hedera";

export default function TokenInfo() {
  const [tokenId, setTokenId] = useState("");
  const [lookupId, setLookupId] = useState<string | null>(null);
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferOk, setTransferOk] = useState<string | null>(null);

  const { token, isLoading, error, transfer, isTransacting, refetch } = useHTSToken(lookupId);

  const handleLookup = () => {
    if (tokenId.trim()) {
      setLookupId(tokenId.trim());
      setTransferOk(null);
    }
  };

  const handleTransfer = async () => {
    if (!transferTo.trim() || !transferAmount.trim()) return;
    setTransferOk(null);
    const txId = await transfer(transferTo.trim(), parseInt(transferAmount, 10));
    if (txId) {
      setTransferOk(txId);
      setTransferTo("");
      setTransferAmount("");
    }
  };

  return (
    <div className="card">
      <h2>HTS token</h2>
      <p className="panel__hint">Metadata from mirror; transfers use your operator from env.</p>

      <div className="input-group">
        <label htmlFor="token-id">Token ID</label>
        <input
          id="token-id"
          type="text"
          placeholder="0.0.9999"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          autoComplete="off"
        />
      </div>
      <button type="button" className="btn" onClick={handleLookup} disabled={isLoading}>
        {isLoading ? "Loading…" : "Load token"}
      </button>

      {error && (
        <div className="error" role="alert">
          {error.message}
        </div>
      )}

      {token && (
        <div style={{ marginTop: "var(--space-lg)" }}>
          <div className="info-row">
            <strong>Name</strong>
            <span>{token.name}</span>
          </div>
          <div className="info-row">
            <strong>Symbol</strong>
            <span>{token.symbol}</span>
          </div>
          <div className="info-row">
            <strong>Supply</strong>
            <span>{parseInt(token.total_supply, 10).toLocaleString()}</span>
          </div>
          <div className="info-row">
            <strong>Decimals</strong>
            <span>{token.decimals}</span>
          </div>
          <div className="info-row">
            <strong>Type</strong>
            <span>{token.type}</span>
          </div>

          <h3 className="section-label">Transfer</h3>
          <div className="input-group">
            <label htmlFor="transfer-to">To account</label>
            <input
              id="transfer-to"
              type="text"
              placeholder="0.0.5678"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <label htmlFor="transfer-amount">Amount</label>
            <input
              id="transfer-amount"
              type="number"
              placeholder="100"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min={0}
            />
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn"
              onClick={handleTransfer}
              disabled={isTransacting || !transferTo.trim() || !transferAmount.trim()}
            >
              {isTransacting ? "Submitting…" : "Transfer"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => refetch()}>
              Refresh
            </button>
          </div>

          {transferOk && (
            <div className="success" role="status">
              Transfer submitted.{" "}
              <span className="code-inline" style={{ display: "block", marginTop: "0.35rem" }}>
                {transferOk}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
