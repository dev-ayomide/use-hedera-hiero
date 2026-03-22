import { useState, useCallback } from "react";
import { TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk";
import { useMirrorNode } from "./useMirrorNode";
import { useHederaClient } from "./useHederaClient";
import { MirrorNodePaginatedResponse, HCSMessage } from "../types";
import { decodeBase64 } from "../utils/formatters";

interface UseHCSMessagesOptions {
  topicId: string | null;
  limit?: number;
  order?: "asc" | "desc";
}

/**
 * useHCSMessages - Query and send messages to a Hedera Consensus Service topic
 *
 * Fetches messages from an HCS topic via Mirror Node and provides a function
 * to submit new messages via the SDK. Messages are automatically base64 decoded.
 *
 * @example
 * ```tsx
 * const { messages, decodedMessages, isLoading, sendMessage, isSending } =
 *   useHCSMessages({ topicId: "0.0.9999", limit: 10, order: "desc" });
 *
 * const handleSend = async () => {
 *   const txId = await sendMessage("Hello, Hedera!");
 *   if (txId) console.log("Message sent:", txId);
 * };
 *
 * return (
 *   <div>
 *     {decodedMessages.map(({ raw, text }) => (
 *       <div key={raw.sequence_number}>
 *         <p>{text}</p>
 *         <small>{raw.consensus_timestamp}</small>
 *       </div>
 *     ))}
 *     <button onClick={handleSend} disabled={isSending}>
 *       Send Message
 *     </button>
 *   </div>
 * );
 * ```
 *
 * @param options - Configuration options (topicId, limit, order)
 * @returns Object containing messages, loading state, sendMessage function, and refetch
 */
export function useHCSMessages({ topicId, limit = 25, order = "desc" }: UseHCSMessagesOptions) {
  const { client } = useHederaClient();
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<Error | null>(null);

  const path = topicId
    ? `/api/v1/topics/${topicId}/messages?limit=${limit}&order=${order}`
    : null;

  const { data, isLoading, error, refetch } = useMirrorNode<
    MirrorNodePaginatedResponse<HCSMessage>
  >(path);

  const messages: HCSMessage[] = (data as any)?.messages ?? [];

  const decodedMessages = messages.map((msg) => ({
    raw: msg,
    text: decodeBase64(msg.message),
  }));

  const sendMessage = useCallback(
    async (message: string): Promise<string | null> => {
      if (!client || !topicId) return null;
      setIsSending(true);
      setSendError(null);
      try {
        const tx = await new TopicMessageSubmitTransaction()
          .setTopicId(TopicId.fromString(topicId))
          .setMessage(message)
          .execute(client);
        await tx.getReceipt(client);
        refetch();
        return tx.transactionId.toString();
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setSendError(err);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [client, topicId, refetch]
  );

  return {
    messages,
    decodedMessages,
    isLoading,
    error: error ?? sendError,
    sendMessage,
    isSending,
    refetch,
  };
}
