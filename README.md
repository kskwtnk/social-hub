# Social Hub

Multi-platform social media posting application built with Tauri + React + TypeScript.

## Development

### Prerequisites

- Node.js with pnpm
- Rust and Cargo
- Platform-specific Tauri dependencies

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm tauri dev
```

## Linting and Formatting

### Frontend (TypeScript/React)

Using [Biome](https://biomejs.dev/) for fast, unified linting and formatting:

```bash
# Check all issues (lint + format)
pnpm check

# Auto-fix all issues
pnpm check:fix

# Lint only
pnpm lint         # Check
pnpm lint:fix     # Fix

# Format only
pnpm format       # Check
pnpm format:fix   # Fix
```

### Backend (Rust)

Using `rustfmt` and `clippy`:

```bash
# Format code
cargo fmt

# Check formatting (without modifying)
cargo fmt --check

# Lint with Clippy
cargo clippy

# Lint with strict warnings as errors
cargo clippy -- -D warnings
```

### CI Integration

Both linters run in strict mode and can be integrated into CI/CD:

```bash
# Full check (add to CI)
pnpm check && cargo fmt --check && cargo clippy -- -D warnings
```
