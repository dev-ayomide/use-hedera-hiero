# 🏆 Hiero Bounty Build Plan — `use-hedera`
> Taiwo | Hedera Hello Future Apex Hackathon 2026
> Target: Hiero Bounty ($8,000 pool) — 1st Place ($4,000)
> Deadline: March 23, 11:59PM ET

---

## 🎯 What You're Building

**`use-hedera`** — A TypeScript-first React/Next.js hooks library for interacting with Hiero/Hedera networks.

Think of it as `wagmi` but for Hedera. Developers shouldn't have to wrestle with the Hedera SDK directly — your library wraps it in clean, composable React hooks with full TypeScript types.

This is *exactly* what the Hiero bounty example asks for:
> *"React / Next.js integration kit (hooks/utilities for common Hiero flows)"*

---

## 📦 Deliverables Checklist (Required to Win)

- [ ] Public GitHub repo with clear MIT license
- [ ] Clean library API with TypeScript types
- [ ] Basic tests (Jest / Vitest)
- [ ] CI pipeline (GitHub Actions)
- [ ] README with install + quickstart
- [ ] `CONTRIBUTING.md`
- [ ] GPG Signed commits + DCO sign-offs
- [ ] Live demo (Next.js app using the library)

---

## 🗂️ Project Structure

```
use-hedera/
├── packages/
│   └── use-hedera/               # The actual library
│       ├── src/
│       │   ├── hooks/
│       │   │   ├── useHederaClient.ts
│       │   │   ├── useHederaAccount.ts
│       │   │   ├── useHCSMessages.ts
│       │   │   ├── useHTSToken.ts
│       │   │   ├── useHederaBalance.ts
│       │   │   ├── useScheduledTransaction.ts
│       │   │   └── useMirrorNode.ts
│       │   ├── providers/
│       │   │   └── HederaProvider.tsx
│       │   ├── utils/
│       │   │   ├── mirrorNode.ts
│       │   │   └── formatters.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── index.ts           # Main export
│       ├── tests/
│       │   └── *.test.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
├── apps/
│   └── demo/                      # Next.js demo app
│       ├── app/
│       └── ...
├── .github/
│   └── workflows/
│       └── ci.yml
├── CONTRIBUTING.md
├── LICENSE                        # MIT
└── package.json                   # Monorepo root (pnpm workspaces)
```

---

## 🔧 Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Everything |
| React 18+ | Hook runtime |
| `@hashgraph/sdk` | Core Hedera SDK |
| `tsup` | Library bundler |
| `vitest` | Testing |
| GitHub Actions | CI |
| pnpm workspaces | Monorepo |
| Next.js 14 | Demo app |
| Tailwind + shadcn/ui | Demo UI |

---

## 📋 Hooks to Build (Priority Order)

### 1. `HederaProvider` — Foundation
```tsx
// Wraps the app, initializes client
<HederaProvider network="testnet" accountId="0.0.xxxx" privateKey="...">
  <App />
</HederaProvider>
```

### 2. `useHederaClient()` — Core
```ts
const { client, network, isConnected } = useHederaClient()
```

### 3. `useHederaBalance()` — Most Used
```ts
const { balance, isLoading, refetch } = useHederaBalance("0.0.1234")
// Returns HBAR balance + token balances
```

### 4. `useHederaAccount()` — Account Info
```ts
const { account, isLoading, error } = useHederaAccount("0.0.1234")
// Returns account info from Mirror Node
```

### 5. `useHCSMessages()` — Consensus Service
```ts
const { messages, isLoading, sendMessage } = useHCSMessages({
  topicId: "0.0.5678",
  limit: 25
})
```

### 6. `useHTSToken()` — Token Service
```ts
const { token, transfer, associate, isLoading } = useHTSToken("0.0.9999")
// Read token info + write operations
```

### 7. `useMirrorNode()` — Raw Mirror Node Queries
```ts
const { data, isLoading, error } = useMirrorNode<T>("/api/v1/accounts/0.0.1234")
// Generic hook for any Mirror Node endpoint
```

### 8. `useScheduledTransaction()` — Bonus Hook
```ts
const { schedule, execute, isLoading } = useScheduledTransaction()
// Create + track scheduled transactions
```

---

## 📅 Day-by-Day Build Schedule

> You have ~6 days left (Mar 17 → Mar 23). Here's the exact plan.

### Day 1 — March 17 (TODAY): Scaffolding
- [ ] Create GitHub repo: `use-hedera`
- [ ] Init pnpm monorepo with workspaces
- [ ] Set up `packages/use-hedera` with tsup + TypeScript
- [ ] Set up `apps/demo` with Next.js 14
- [ ] Configure GitHub Actions CI (lint + test + build)
- [ ] Write `LICENSE` (MIT) and skeleton `README.md`
- [ ] GPG sign your first commit + add DCO sign-off template

**DCO sign-off (add to every commit):**
```
Signed-off-by: Taiwo Ayomide <your@email.com>
```

---

### Day 2 — March 18: Core Foundation
- [ ] Build `HederaProvider` + context
- [ ] Build `useHederaClient()` hook
- [ ] Build `useMirrorNode()` generic hook with error handling + loading states
- [ ] Define all TypeScript types in `types/index.ts`
- [ ] Write tests for `useMirrorNode`

---

### Day 3 — March 19: Account + Balance Hooks
- [ ] Build `useHederaAccount()`
- [ ] Build `useHederaBalance()` (HBAR + tokens)
- [ ] Wire both into demo app with a simple account lookup UI
- [ ] Write tests for both hooks

---

### Day 4 — March 20: HCS + HTS Hooks
- [ ] Build `useHCSMessages()` — read + send
- [ ] Build `useHTSToken()` — info + transfer + associate
- [ ] Wire into demo app (topic message feed + token transfer UI)
- [ ] Write tests

---

### Day 5 — March 21: Polish + Bonus Hook
- [ ] Build `useScheduledTransaction()` (bonus — judges love extras)
- [ ] Complete demo app — make it look good (Tailwind + shadcn)
- [ ] Deploy demo to Vercel
- [ ] Polish README with full API docs + usage examples
- [ ] Write `CONTRIBUTING.md`

---

### Day 6 — March 22: Docs + Submission Prep
- [ ] Record demo video (max 5 mins) — screen record the demo app + code walkthrough
- [ ] Write pitch deck (PDF): Problem → Solution → API design decisions → Future roadmap
- [ ] Final code review + clean up
- [ ] Verify all CI checks pass
- [ ] Do a full end-to-end test on testnet

---

### Day 7 — March 23: Submit (Early!)
- [ ] Submit at least 2 hours before midnight ET deadline
- [ ] Double-check all required fields on submission form
- [ ] Answer feedback questions (allocate 30 mins)

---

## 📝 README Structure (What Judges Will Read First)

```md
# use-hedera

> React hooks for Hedera/Hiero networks — TypeScript-first, composable, production-ready.

## Install
npm install use-hedera @hashgraph/sdk

## Quick Start
[Code example with HederaProvider + useHederaBalance]

## Hooks
[Table: Hook name | Description | Status]

## API Reference
[Each hook with params, return values, examples]

## Contributing
See CONTRIBUTING.md

## License
MIT
```

---

## 🎤 Pitch Deck Structure (PDF)

**Slide 1 — Problem**
- Hedera SDK is powerful but has a steep learning curve for React devs
- No standard way to integrate Hedera into React/Next.js apps
- Devs copy-paste SDK boilerplate instead of focusing on their product

**Slide 2 — Solution**
- `use-hedera`: composable React hooks that abstract Hedera complexity
- Same DX as `wagmi` (Ethereum's beloved hooks library) but for Hedera
- TypeScript-first, tree-shakeable, minimal dependencies

**Slide 3 — API Design**
- Show the before/after code comparison
- Without library: 40 lines of SDK setup
- With `use-hedera`: 3 lines

**Slide 4 — Hooks Overview**
- Table of all hooks with use cases

**Slide 5 — Demo**
- Embed YouTube demo video link
- Screenshots of demo app

**Slide 6 — Hedera Integration**
- Uses HCS (Consensus Service)
- Uses HTS (Token Service)
- Uses Mirror Node REST API
- Targets testnet + mainnet

**Slide 7 — Ecosystem Impact**
- Lowers barrier for React/Next.js devs entering Hedera
- Could be officially adopted by Hiero community
- Foundation for more ecosystem tooling

**Slide 8 — Roadmap**
- v0.1: Core hooks (this hackathon)
- v0.2: WalletConnect integration
- v0.3: Smart contract hooks (EVM)
- v1.0: npm publish + official Hiero community library

**Slide 9 — Team**
- Taiwo Ayomide — Full-stack developer, PadiLabs
- Prior: PrivyLend (Canton Network), Platnova (fintech), multiple hackathon wins

---

## 💡 Judging Criteria Mapping

| Criteria | How You Win It |
|----------|---------------|
| **Innovation (10%)** | First dedicated React hooks library for Hedera — nothing like this exists in the ecosystem |
| **Feasibility (10%)** | You're literally building with their suggested example. Clearly feasible. |
| **Execution (20%)** | Clean monorepo, CI, tests, docs, deployed demo — shows engineering maturity |
| **Integration (15%)** | Uses HCS + HTS + Mirror Node — multiple Hedera services |
| **Success (20%)** | Every React dev building on Hedera becomes a potential user — massive adoption surface |
| **Validation (15%)** | Note in pitch: shared with Hedera Discord, got developer feedback, planned npm publish |
| **Pitch (10%)** | wagmi analogy instantly clicks with any Web3 judge |

---

## ⚡ Key Commands to Get Started Right Now

```bash
# 1. Create repo + init monorepo
mkdir use-hedera && cd use-hedera
git init
pnpm init

# 2. Create workspace config
echo '{ "packages": ["packages/*", "apps/*"] }' > pnpm-workspace.yaml

# 3. Scaffold library package
mkdir -p packages/use-hedera/src/{hooks,providers,utils,types}
mkdir -p packages/use-hedera/tests

# 4. Scaffold demo app
pnpm create next-app apps/demo --typescript --tailwind --app

# 5. Install core deps in library
cd packages/use-hedera
pnpm add @hashgraph/sdk
pnpm add -D typescript tsup vitest @testing-library/react-hooks

# 6. Configure GPG signing for all commits
git config --global commit.gpgsign true
```

---

## 🔗 Key Resources

- Hedera SDK Docs: https://docs.hedera.com/hedera
- Mirror Node API: https://mainnet-public.mirrornode.hedera.com/api/v1/docs
- Hiero GitHub (reference): https://github.com/OpenElements/hiero-enterprise-java
- Hedera Testnet Portal: https://portal.hedera.com (get free testnet HBAR)
- Hiero Bounty Submission: https://hellofuturehackathon.dev

---

## ⚠️ Winning Tips

1. **Commit early and often** — judges see your commit history. Show active development.
2. **DCO sign every single commit** — it's a hard requirement for the bounty.
3. **Make the demo app genuinely useful** — a real "Hedera dashboard" using your own hooks shows confidence in your API.
4. **Join the Hedera Discord** and mention your library — organic traction counts for Validation score.
5. **The wagmi comparison** is your killer pitch angle. Any judge who knows Ethereum dev tooling will immediately get it.

---

*Good luck Taiwo. You've got the stack, the speed, and the hackathon experience. Ship it. 🚀*
