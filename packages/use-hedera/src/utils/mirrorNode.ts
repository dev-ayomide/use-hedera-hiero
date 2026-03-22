import { HederaNetwork } from "../types";

const MIRROR_NODE_URLS: Record<HederaNetwork, string> = {
  mainnet: "https://mainnet-public.mirrornode.hedera.com",
  testnet: "https://testnet.mirrornode.hedera.com",
  previewnet: "https://previewnet.mirrornode.hedera.com",
};

/**
 * Get the Mirror Node base URL for a given network
 * @param network - The Hedera network
 * @param override - Optional override URL
 * @returns The Mirror Node base URL
 */
export function getMirrorNodeBaseUrl(
  network: HederaNetwork,
  override?: string
): string {
  return override ?? MIRROR_NODE_URLS[network];
}
