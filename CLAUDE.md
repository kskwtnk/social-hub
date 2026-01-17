# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-platform social media posting application built with Tauri + React + TypeScript. Posts to Bluesky, X (Twitter), and Threads simultaneously.

## Development Commands

### Frontend (React + TypeScript)

```bash
# Development server
pnpm tauri:dev

# Build for production (macOS Apple Silicon)
pnpm tauri:build

# Frontend-only development (without Tauri)
pnpm dev

# Build frontend
pnpm build
```

### Linting and Formatting

**Frontend** uses Biome:
```bash
pnpm check         # Check all issues
pnpm check:fix     # Auto-fix all issues
pnpm lint          # Lint only
pnpm lint:fix      # Auto-fix lint issues
pnpm format        # Format check only
pnpm format:fix    # Auto-fix formatting
```

**Backend** uses rustfmt and clippy:
```bash
cd src-tauri
cargo fmt                      # Format code
cargo fmt --check              # Check formatting
cargo clippy                   # Lint
cargo clippy -- -D warnings    # Lint strict mode
```

## Architecture

### Frontend (src/)

- **App.tsx**: Main screen coordinator managing three states: `loading`, `setup` (credentials form), and `main` (post form)
- **components/CredentialsForm.tsx**: Form for entering/editing platform API credentials
- **components/PostForm.tsx**: Main UI for composing and posting to social platforms
- **lib/api.ts**: Type-safe wrapper around Tauri invoke commands
- **lib/types.ts**: Shared TypeScript types for platform credentials and post results

### Backend (src-tauri/src/)

- **lib.rs**: Tauri application entry point, registers all commands
- **commands.rs**: Tauri command handlers for posting and credential management
  - `post_to_bluesky/x/threads`: Individual platform posting
  - `post_to_all`: Parallel posting to all platforms using tokio::spawn (lines 117-209)
  - `save_credentials/load_credentials/check_credentials_exist`: Keychain integration
- **credentials.rs**: Secure credential storage using system keychain
  - macOS-specific implementation using "User" target for Login Keychain
  - Platform-agnostic fallback for other OS
- **platforms/**: Per-platform API integration modules
  - `bluesky.rs`: AT Protocol authentication and posting
  - `threads.rs`: Meta Graph API integration
  - `x.rs`: OAuth 1.0a authentication and Twitter API v2

### Key Design Patterns

**Parallel Posting**: The `post_to_all` command spawns concurrent tokio tasks for each platform, improving UX by not blocking on sequential API calls.

**Credential Security**: All sensitive credentials stored in system keychain (macOS Keychain/Windows Credential Manager) rather than local files. Never logged or exposed.

**Platform Abstraction**: Each platform module (`platforms/*.rs`) implements a consistent `post(message, ...credentials) -> Result<String, Error>` interface, making it easy to add new platforms.

**Frontend-Backend Communication**: TypeScript types in `lib/types.ts` mirror Rust structs with serde, ensuring type safety across the Tauri invoke boundary.

## Testing

Currently no automated tests. When adding tests:

**Frontend**:
```bash
# Setup testing framework first (e.g., Vitest)
pnpm test
```

**Backend**:
```bash
cd src-tauri
cargo test
```

## Platform-Specific Notes

### macOS

- Build target is Apple Silicon by default: `pnpm tauri:build` uses `--target aarch64-apple-darwin`
- Keychain integration requires "User" target (see `credentials.rs:10`)

### Adding New Social Platforms

1. Create new module in `src-tauri/src/platforms/`
2. Implement `post()` function with platform-specific API
3. Add credentials fields to `PlatformCredentials` in `credentials.rs`
4. Add command handler in `commands.rs`
5. Export command in `lib.rs` invoke_handler
6. Add TypeScript wrapper in `src/lib/api.ts`
7. Update UI forms in `CredentialsForm.tsx` and `PostForm.tsx`
