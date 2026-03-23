# Contributing to use-hedera

Thank you for your interest in contributing to use-hedera! This document provides guidelines and instructions for contributing.

## Developer Certificate of Origin (DCO)

This project uses the Developer Certificate of Origin (DCO) to ensure that contributors have the right to submit their code. By contributing to this project, you agree to the DCO.

### What is the DCO?

The DCO is a lightweight way for contributors to certify that they wrote or otherwise have the right to submit the code they are contributing. You can read the full text at https://developercertificate.org/

### How to Sign Off Your Commits

Every commit must include a sign-off line at the end of the commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

You can add this automatically by using the `-s` flag with `git commit`:

```bash
git commit -s -m "feat: add new hook for querying transactions"
```

Or you can add it manually to your commit message:

```bash
git commit -m "feat: add new hook for querying transactions

Signed-off-by: Jane Doe <jane@example.com>"
```

**Important:** The name and email in the sign-off must match your Git configuration. Configure them with:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Commit Message Format

We follow conventional commit format:

- `feat:` — New feature or hook
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `test:` — Adding or updating tests
- `refactor:` — Code refactoring
- `chore:` — Build config, dependencies, CI/CD

Examples:

```
feat: add useHederaBalance hook

Implements a new hook for querying HBAR and token balances
from the Mirror Node with automatic formatting.

Signed-off-by: Jane Doe <jane@example.com>
```

```
fix: handle null client in useScheduledTransaction

Adds null check before creating scheduled transactions
to prevent runtime errors.

Signed-off-by: John Smith <john@example.com>
```

## Development Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Getting Started

1. Fork and clone the repository

```bash
git clone https://github.com/dev-ayomide/use-hedera-hiero.git
cd use-hedera
```

2. Install dependencies

```bash
pnpm install
```

3. Run tests

```bash
pnpm test
```

4. Build the library

```bash
pnpm build
```

## Project Structure

```
use-hedera/
├── packages/use-hedera/          # Main library package
│   ├── src/
│   │   ├── hooks/                # React hooks
│   │   ├── providers/            # HederaProvider
│   │   ├── utils/                # Utility functions
│   │   ├── types/                # TypeScript types
│   │   └── index.ts              # Main export
│   ├── tests/                    # Test files
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── vitest.config.ts
└── apps/demo/                    # Demo Next.js app
    ├── app/
    ├── components/
    └── package.json
```

## Adding a New Hook

1. Create the hook file in `packages/use-hedera/src/hooks/`
2. Add JSDoc comments with examples
3. Export from `src/index.ts`
4. Add TypeScript types in `src/types/index.ts`
5. Write tests in `tests/`
6. Add usage example to README
7. Add demo component in `apps/demo/components/`

Example hook template:

```tsx
/**
 * useYourHook - Brief description
 *
 * Detailed description of what this hook does and when to use it.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useYourHook(param);
 * ```
 *
 * @param param - Description of parameter
 * @returns Object containing data, loading state, and error
 */
export function useYourHook(param: string) {
  // Implementation
}
```

## Writing Tests

We use Vitest for testing. All hooks should have comprehensive test coverage.

Test template:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { HederaProvider } from "../src/providers/HederaProvider";
import { useYourHook } from "../src/hooks/useYourHook";

const mockConfig = {
  network: "testnet" as const,
  accountId: "0.0.1234",
  privateKey: "302e...",
};

const wrapper = ({ children }) =>
  React.createElement(HederaProvider, { config: mockConfig }, children);

describe("useYourHook", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should fetch data successfully", async () => {
    // Test implementation
  });

  it("should handle errors", async () => {
    // Test implementation
  });

  it("should skip when param is null", () => {
    // Test implementation
  });
});
```

Run tests:

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test -- --coverage
```

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Write descriptive variable names
- Add JSDoc comments for public APIs
- Keep hooks focused and composable
- Handle loading, error, and null states

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with proper commit messages
3. Ensure all tests pass: `pnpm test`
4. Ensure TypeScript checks pass: `pnpm lint`
5. Build successfully: `pnpm build`
6. Submit PR with clear description
7. Wait for CI checks to pass
8. Address review feedback

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Check existing issues before creating new ones

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together.

---

Thank you for contributing to use-hedera! 🎉
