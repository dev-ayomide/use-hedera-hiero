/**
 * Create an HCS topic on Hedera testnet using the same operator as the Next demo.
 *
 * Prereqs: apps/demo/.env.local with NEXT_PUBLIC_HEDERA_ACCOUNT_ID and NEXT_PUBLIC_HEDERA_PRIVATE_KEY
 *
 * Run from repo root:
 *   pnpm --filter demo create-topic
 *
 * Or from apps/demo:
 *   pnpm create-topic
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, TopicCreateTransaction } from "@hashgraph/sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

function loadEnvLocal(filePath) {
  if (!existsSync(filePath)) {
    console.error(`Missing ${filePath}\nCopy apps/demo/.env.example to .env.local and add your testnet credentials.`);
    process.exit(1);
  }
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvLocal(envPath);

const accountId = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID;
const privateKey = process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY;

if (!accountId || !privateKey) {
  console.error(
    "Set NEXT_PUBLIC_HEDERA_ACCOUNT_ID and NEXT_PUBLIC_HEDERA_PRIVATE_KEY in apps/demo/.env.local"
  );
  process.exit(1);
}

const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

try {
  const tx = await new TopicCreateTransaction()
    .setTopicMemo("use-hedera demo topic")
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId?.toString();

  if (!topicId) {
    console.error("Topic was not created (no topicId on receipt).");
    process.exit(1);
  }

  console.log("\nTopic created on testnet.\n");
  console.log("Topic ID (paste into the demo Consensus feed):\n");
  console.log(`  ${topicId}\n`);
  console.log(`Transaction ID: ${tx.transactionId?.toString() ?? "n/a"}\n`);
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Failed to create topic:", msg);
  process.exit(1);
} finally {
  client.close();
}
