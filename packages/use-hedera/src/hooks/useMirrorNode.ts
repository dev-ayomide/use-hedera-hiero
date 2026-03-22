import { useState, useEffect, useCallback } from "react";
import { useHederaContext } from "../providers/HederaProvider";
import { getMirrorNodeBaseUrl } from "../utils/mirrorNode";

/**
 * useMirrorNode - Generic hook for querying Mirror Node REST API
 *
 * Low-level hook for making requests to the Hedera Mirror Node.
 * Most users should use the specific hooks (useHederaAccount, useHederaBalance, etc.) instead.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch, fetchNext, hasMore } =
 *   useMirrorNode<MirrorNodeAccount>("/api/v1/accounts/0.0.1234");
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!data) return null;
 *
 * return <div>{data.account}</div>;
 * ```
 *
 * @template T - Type of the data returned from the Mirror Node
 * @param path - API path (e.g., "/api/v1/accounts/0.0.1234") or null to skip
 * @returns Object containing data, loading state, error, and refetch functions
 */
export function useMirrorNode<T>(path: string | null) {
  const { config } = useHederaContext();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextLink, setNextLink] = useState<string | null>(null);

  const baseUrl = getMirrorNodeBaseUrl(config.network, config.mirrorNodeUrl);

  const fetchData = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Mirror Node error: ${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
      setNextLink(json?.links?.next ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!path) return;
    fetchData(`${baseUrl}${path}`);
  }, [path, baseUrl, fetchData]);

  const refetch = useCallback(() => {
    if (path) fetchData(`${baseUrl}${path}`);
  }, [path, baseUrl, fetchData]);

  const fetchNext = useCallback(() => {
    if (nextLink) fetchData(`${baseUrl}${nextLink}`);
  }, [nextLink, baseUrl, fetchData]);

  return { data, isLoading, error, refetch, fetchNext, hasMore: nextLink !== null };
}
