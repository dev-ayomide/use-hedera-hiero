// ─── Network ───────────────────────────────────────────────
export type HederaNetwork = "mainnet" | "testnet" | "previewnet";

// ─── Provider Config ───────────────────────────────────────
export interface HederaConfig {
  network: HederaNetwork;
  accountId: string;       // e.g. "0.0.1234"
  privateKey: string;      // hex or DER encoded
  mirrorNodeUrl?: string;  // optional override
}

// ─── Context ───────────────────────────────────────────────
export interface HederaContextValue {
  client: import("@hashgraph/sdk").Client | null;
  config: HederaConfig;
  isConnected: boolean;
}

// ─── Mirror Node: Account ──────────────────────────────────
export interface MirrorNodeAccount {
  account: string;
  alias: string | null;
  auto_renew_period: number;
  balance: {
    balance: number;        // in tinybars
    timestamp: string;
    tokens: Array<{
      token_id: string;
      balance: number;
    }>;
  };
  created_timestamp: string;
  decline_reward: boolean;
  deleted: boolean;
  ethereum_address: string | null;
  expiry_timestamp: string | null;
  key: {
    _type: string;
    key: string;
  };
  max_automatic_token_associations: number;
  memo: string;
  pending_reward: number;
  receiver_sig_required: boolean;
}

// ─── Mirror Node: Token ────────────────────────────────────
export interface MirrorNodeToken {
  admin_key: { _type: string; key: string } | null;
  auto_renew_account: string | null;
  auto_renew_period: number | null;
  created_timestamp: string;
  decimals: string;
  deleted: boolean;
  expiry_timestamp: string | null;
  fee_schedule_key: null;
  freeze_default: boolean;
  initial_supply: string;
  max_supply: string;
  memo: string;
  modified_timestamp: string;
  name: string;
  pause_key: null;
  pause_status: string;
  supply_key: { _type: string; key: string } | null;
  supply_type: "FINITE" | "INFINITE";
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: "FUNGIBLE_COMMON" | "NON_FUNGIBLE_UNIQUE";
  wipe_key: { _type: string; key: string } | null;
}

// ─── Mirror Node: HCS Message ──────────────────────────────
export interface HCSMessage {
  chunk_info: null | {
    initial_transaction_id: string;
    number: number;
    total: number;
  };
  consensus_timestamp: string;
  message: string;         // base64 encoded
  payer_account_id: string;
  running_hash: string;
  running_hash_version: number;
  sequence_number: number;
  topic_id: string;
}

// ─── Mirror Node: Transaction ──────────────────────────────
export interface MirrorNodeTransaction {
  bytes: string | null;
  charged_tx_fee: number;
  consensus_timestamp: string;
  entity_id: string | null;
  max_fee: string;
  memo_base64: string;
  name: string;
  nonce: number;
  parent_consensus_timestamp: string | null;
  result: string;
  scheduled: boolean;
  transaction_hash: string;
  transaction_id: string;
  transfers: Array<{
    account: string;
    amount: number;
    is_approval: boolean;
  }>;
  valid_duration_seconds: string;
  valid_start_timestamp: string;
}

// ─── Mirror Node: Paginated Response ───────────────────────
export interface MirrorNodePaginatedResponse<T> {
  [key: string]: T[] | { next: string | null };
  links: { next: string | null };
}

// ─── Hook Return Types ─────────────────────────────────────
export interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface HederaBalance {
  hbar: number;            // in HBAR (not tinybars)
  tinybars: number;
  tokens: Array<{
    tokenId: string;
    balance: number;
  }>;
}

export interface HCSMessagesState {
  messages: HCSMessage[];
  decodedMessages: Array<{ raw: HCSMessage; text: string }>;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<string | null>;
  isSending: boolean;
  refetch: () => void;
}

export interface HTSTokenState {
  token: MirrorNodeToken | null;
  isLoading: boolean;
  error: Error | null;
  transfer: (toAccountId: string, amount: number) => Promise<string | null>;
  associate: (accountId: string) => Promise<string | null>;
  isTransacting: boolean;
  refetch: () => void;
}

export interface ScheduledTransactionState {
  schedule: (params: ScheduleParams) => Promise<string | null>;
  isLoading: boolean;
  error: Error | null;
  lastScheduleId: string | null;
}

export interface ScheduleParams {
  inner: import("@hashgraph/sdk").Transaction;
  memo?: string;
  expirationTime?: Date;
  waitForExpiry?: boolean;
}
