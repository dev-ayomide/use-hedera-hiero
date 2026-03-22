"use client";
import { useState } from "react";
import { useHCSMessages } from "use-hedera";

export default function TopicFeed() {
  const [topicId, setTopicId] = useState("");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { decodedMessages, isLoading, error, sendMessage, isSending, refetch } = useHCSMessages({
    topicId: activeTopicId,
    limit: 10,
    order: "desc",
  });

  const handleConnect = () => {
    if (topicId.trim()) {
      setActiveTopicId(topicId.trim());
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const txId = await sendMessage(newMessage.trim());
    if (txId) {
      setNewMessage("");
      setTimeout(refetch, 2000);
    }
  };

  return (
    <div className="card">
      <h2>Consensus feed</h2>
      <p className="panel__hint">Mirror for reads; submit path uses your configured operator.</p>

      {!activeTopicId ? (
        <>
          <div className="input-group">
            <label htmlFor="topic-id">Topic ID</label>
            <input
              id="topic-id"
              type="text"
              placeholder="0.0.9999"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              autoComplete="off"
            />
          </div>
          <button type="button" className="btn" onClick={handleConnect}>
            Open topic
          </button>
        </>
      ) : (
        <>
          <div className="btn-row" style={{ marginBottom: "var(--space-md)" }}>
            <span style={{ color: "var(--ink-soft)", fontSize: "var(--step--1)" }}>
              Topic <span className="code-inline">{activeTopicId}</span>
            </span>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setActiveTopicId(null)}>
              Close
            </button>
          </div>

          {error && (
            <div className="error" role="alert">
              {error.message}
            </div>
          )}

          {isLoading ? (
            <div className="loading">Pulling messages…</div>
          ) : (
            <div className="message-list" role="log" aria-live="polite">
              {decodedMessages.length === 0 ? (
                <p className="empty-hint">No messages yet—send the first one below.</p>
              ) : (
                decodedMessages.map((msg) => (
                  <div key={msg.raw.sequence_number} className="message">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-meta">
                      Seq {msg.raw.sequence_number} · From {msg.raw.payer_account_id}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="input-group" style={{ marginTop: "var(--space-md)" }}>
            <label htmlFor="topic-message">New message</label>
            <textarea
              id="topic-message"
              rows={3}
              placeholder="Write something to consensus…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <button type="button" className="btn" onClick={handleSend} disabled={isSending || !newMessage.trim()}>
            {isSending ? "Submitting…" : "Submit message"}
          </button>
        </>
      )}
    </div>
  );
}
