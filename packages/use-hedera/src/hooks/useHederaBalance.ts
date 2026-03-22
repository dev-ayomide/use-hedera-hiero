import { useHederaAccount } from "./useHederaAccount";
import { HederaBalance } from "../types";
import { tinybarsToHbar } from "../utils/formatters";

/**
 * useHederaBalance - Query account HBAR and token balances
 *
 * Builds on useHederaAccount but formats balance data for easy display.
 * Returns HBAR balance in both HBAR and tinybar units, plus token balances.
 *
 * @example
 * ```tsx
 * const { balance, isLoading, error, refetch } = useHederaBalance("0.0.1234");
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!balance) return null;
 *
 * return (
 *   <div>
 *     <p>HBAR: {balance.hbar} ℏ</p>
 *     <p>Tinybars: {balance.tinybars}</p>
 *     {balance.tokens.map(token => (
 *       <p key={token.tokenId}>
 *         {token.tokenId}: {token.balance}
 *       </p>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @param accountId - Hedera account ID (e.g., "0.0.1234") or null to skip
 * @returns Object containing formatted balance data, loading state, error, and refetch function
 */
export function useHederaBalance(accountId: string | null) {
  const { account, isLoading, error, refetch } = useHederaAccount(accountId);

  const balance: HederaBalance | null = account
    ? {
        tinybars: account.balance.balance,
        hbar: tinybarsToHbar(account.balance.balance),
        tokens: account.balance.tokens.map((t) => ({
          tokenId: t.token_id,
          balance: t.balance,
        })),
      }
    : null;

  return { balance, isLoading, error, refetch };
}
