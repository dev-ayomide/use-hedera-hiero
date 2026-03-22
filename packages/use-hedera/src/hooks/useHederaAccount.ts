import { useMirrorNode } from "./useMirrorNode";
import { MirrorNodeAccount } from "../types";

/**
 * useHederaAccount - Query Hedera account information
 *
 * Fetches complete account details from the Mirror Node including keys,
 * balance, tokens, and account properties.
 *
 * @example
 * ```tsx
 * const { account, isLoading, error, refetch } = useHederaAccount("0.0.1234");
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!account) return null;
 *
 * return (
 *   <div>
 *     <h2>Account {account.account}</h2>
 *     <p>Balance: {account.balance.balance} tinybars</p>
 *     <p>Memo: {account.memo}</p>
 *   </div>
 * );
 * ```
 *
 * @param accountId - Hedera account ID (e.g., "0.0.1234") or null to skip
 * @returns Object containing account data, loading state, error, and refetch function
 */
export function useHederaAccount(accountId: string | null) {
  const path = accountId ? `/api/v1/accounts/${accountId}` : null;
  const { data, isLoading, error, refetch } = useMirrorNode<MirrorNodeAccount>(path);
  return { account: data, isLoading, error, refetch };
}
