import { useHederaContext } from "../providers/HederaProvider";

/**
 * useHederaClient - Get the raw Hedera SDK client
 *
 * Returns the Hedera client instance and network configuration from context.
 * Used internally by other hooks that need to submit transactions.
 *
 * @example
 * ```tsx
 * const { client, network, accountId, isConnected } = useHederaClient();
 *
 * if (!client) {
 *   return <div>Not connected</div>;
 * }
 *
 * // Use client for custom SDK operations...
 * ```
 *
 * @returns Object containing client, network, accountId, and connection status
 */
export function useHederaClient() {
  const { client, config, isConnected } = useHederaContext();
  return { client, network: config.network, accountId: config.accountId, isConnected };
}
