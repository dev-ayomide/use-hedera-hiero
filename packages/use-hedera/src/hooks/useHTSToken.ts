import { useState, useCallback } from "react";
import {
  TransferTransaction,
  TokenAssociateTransaction,
  TokenId,
  AccountId,
} from "@hashgraph/sdk";
import { useMirrorNode } from "./useMirrorNode";
import { useHederaClient } from "./useHederaClient";
import { MirrorNodeToken } from "../types";

/**
 * useHTSToken - Query token information and perform token operations
 *
 * Fetches HTS (Hedera Token Service) token metadata from Mirror Node and
 * provides functions to transfer tokens and associate tokens with accounts.
 *
 * @example
 * ```tsx
 * const { token, isLoading, transfer, associate, isTransacting } =
 *   useHTSToken("0.0.9999");
 *
 * const handleTransfer = async () => {
 *   const txId = await transfer("0.0.5678", 100);
 *   if (txId) console.log("Transfer successful:", txId);
 * };
 *
 * const handleAssociate = async () => {
 *   const txId = await associate("0.0.5678");
 *   if (txId) console.log("Association successful:", txId);
 * };
 *
 * if (!token) return null;
 *
 * return (
 *   <div>
 *     <h2>{token.name} ({token.symbol})</h2>
 *     <p>Supply: {token.total_supply}</p>
 *     <button onClick={handleTransfer} disabled={isTransacting}>
 *       Transfer 100 tokens
 *     </button>
 *   </div>
 * );
 * ```
 *
 * @param tokenId - HTS token ID (e.g., "0.0.9999") or null to skip
 * @returns Object containing token data, transfer/associate functions, and loading states
 */
export function useHTSToken(tokenId: string | null) {
  const { client } = useHederaClient();
  const [isTransacting, setIsTransacting] = useState(false);
  const [txError, setTxError] = useState<Error | null>(null);

  const path = tokenId ? `/api/v1/tokens/${tokenId}` : null;
  const { data: token, isLoading, error, refetch } = useMirrorNode<MirrorNodeToken>(path);

  const transfer = useCallback(
    async (toAccountId: string, amount: number): Promise<string | null> => {
      if (!client || !tokenId) return null;
      setIsTransacting(true);
      setTxError(null);
      try {
        const tx = await new TransferTransaction()
          .addTokenTransfer(TokenId.fromString(tokenId), client.operatorAccountId!, -amount)
          .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(toAccountId), amount)
          .execute(client);
        await tx.getReceipt(client);
        return tx.transactionId.toString();
      } catch (e) {
        setTxError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setIsTransacting(false);
      }
    },
    [client, tokenId]
  );

  const associate = useCallback(
    async (accountId: string): Promise<string | null> => {
      if (!client || !tokenId) return null;
      setIsTransacting(true);
      setTxError(null);
      try {
        const tx = await new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(accountId))
          .setTokenIds([TokenId.fromString(tokenId)])
          .execute(client);
        await tx.getReceipt(client);
        return tx.transactionId.toString();
      } catch (e) {
        setTxError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setIsTransacting(false);
      }
    },
    [client, tokenId]
  );

  return {
    token,
    isLoading,
    error: error ?? txError,
    transfer,
    associate,
    isTransacting,
    refetch,
  };
}
