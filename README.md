# WeLiftoff (`weliftoff.now`) — Blueprint

**WeLiftoff** is an on-campus software engineering residency program operated by **Substrata Labs** (`UDYAM-RJ-37-0014993`). The curriculum transitions high school builders from zero prior codebase experience to shipping cryptographically signed, open-source Android applications on **Google Play** and **F-Droid** within a deterministic 14-day (28.0-hour) execution window.

---

## System Overview

The repository unifies two core systems:
1. **The Web Interface (`src/app`)**: The high-contrast tactile landing page at `weliftoff.now` featuring an interactive 2D Canvas Git DAG simulator, browser-synthesized audio feedback, institutional compliance registry, and residency reservation flow.
2. **The Builder Toolchain & Scaffold (`scripts/`, `templates/`)**: Zero-egress offline bootstrapping scripts and the reference Android template (`liftoff-starter`) built on Kotlin, Jetpack Compose, and Room.

### 1. Architectural & Pedagogical Bounds

| Parameter | System Bound / Invariant | Verification Mechanism |
| :--- | :--- | :--- |
| **Execution Window** | 14 Calendar Days (`2.0 hrs/day` lab cadence; `28.0 hrs` total) | Daily Git commit timestamp ledger |
| **Crew Topology** | Maximum `3` builders per repository | GitHub contributor graph & PR attribution |
| **Version Control Cadence** | Minimum `80` sequential atomic commits per crew | `git rev-list --count HEAD` & PR review log |
| **Network Egress Ceiling** | `0 Bytes` runtime user-data egress | Manifest audit stripping `android.permission.INTERNET` for local utilities |
| **On-Device Persistence** | Local SQLite / Jetpack Room schema | Deterministic DAO unit test suite (`./gradlew testDebugUnitTest`) |
| **Source Licensing** | Permissive `Apache-2.0` FOSS | Automated SPDX header & `fdroid scanner` compliance check |
| **Release Targets** | Signed Android App Bundle (`.aab`) + F-Droid APK (`.apk`) | SHA-256 certificate fingerprint & reproducible build check |

---

### 2. Core Pedagogical State Machine

The residency replaces unconstrained prompt-to-code generation with a two-phase directed acyclic graph (DAG):

1. **Phase 01 (Days 01–07) — State Control & Local-First Synthesis**:
   - **Days 01–02 (`NODE.01`)**: Terminal navigation, Android Debug Bridge (`adb`), and Git DAG mechanics (`git switch -c`, `git restore`, `git reset`, `git reflog`).
   - **Days 03–04 (`NODE.02`)**: Domain specification authoring (`AGENTS.md`) and bounded single-slice synthesis.
   - **Days 05–06 (`NODE.03`)**: Zero-egress SQLite/Room persistence and state-driven UI grids.
   - **Day 07 (`NODE.04`)**: Cross-crew pull-request review, automated secret scanning, and feature scope freeze.
2. **Phase 02 (Days 08–14) — Reproducible Packaging & Dual Distribution**:
   - **Days 08–09 (`NODE.05`)**: SIL Open Font / Apache-2.0 asset audit, R8 shrinking, and release signing.
   - **Days 10–11 (`NODE.06`)**: Google Play Console production submission and F-Droid upstream recipe merge request.
   - **Days 12–13 (`NODE.07`)**: Clean-slate architectural `README.md` and 3-minute technical defense screencast.
   - **Day 14 (`NODE.08`)**: On-campus Demo Day exhibition and live physical device installation via QR.

---

### 3. Web Interface Architecture (`liftoff-zero-to-one`)

The web surface at `weliftoff.now` enforces the **Tactile Interface** specification:

- **Asymmetric 4/8 Viewport Split**: A 4-column static thesis and tabular invariant stack anchored against an 8-column interactive HTML5 `<canvas>` **Git DAG & State Convergence Simulator**.
- **Spring-Damper Physics & Bounded Levers**: Driven by a 60fps `requestAnimationFrame` loop with three discrete mechanical state levers (`[01] Atomic Commit`, `[02] Unbounded Drift`, `[03] Reflog Restore`).
- **Native Acoustic Synthesizer**: Sub-80ms sine, triangle, and sawtooth wave sweeps synthesized via the browser `AudioContext` API with zero external audio assets.
- **Typographic Hierarchy**: High-contrast `Syne` and `Instrument Serif` display headers paired with tabular `JetBrains Mono` telemetry and `1px` structural hairlines (`#262930`).

---

## Local Configuration & Invariants

Root-level files govern project-wide module resolution, toolchain execution, and type definitions:

- **`next.config.ts`**: Configures Next.js 16 compiler features (`cacheComponents: true`, `partialPrefetching: true`) and Turbopack CSS loaders (`@tailwindcss/turbopack`).
- **`package.json`**: Declares package manager (`pnpm@10.33.0`), core dependencies (`next 16.4.2`, `react 19.3.0`, `lucide-react`, `tailwindcss 4`), and build scripts.
- **`eslint.config.mjs`**: Next.js flat ESLint ruleset.
- **`tsconfig.json`**: Strict TypeScript 5 configuration with `@/*` path mapping to `./src/*`.

---

## Subdirectories & System Boundaries

- **[`src/`](./src/README.md)**: Application source root. Contains [`src/app/`](./src/app/README.md) hosting the Next.js App Router entry point (`page.tsx`), root layout (`layout.tsx`), and global tokens (`globals.css`).
- **[`scripts/`](./scripts/README.md)**: Host provisioning and pair-programming workflows (`setup.sh`, `setup.bat`, `setup.ps1`, `verify-env.sh`, `crew-swap.sh`).
- **[`templates/`](./templates/README.md)**: Scaffold project index containing the [`liftoff-starter/`](./templates/liftoff-starter/README.md) offline-first Android template with Room database persistence and verification tasks.

---

## Global Invariants

1. **Zero Runtime Data Egress**: The template application strips `android.permission.INTERNET` at compile time and verifies it during Gradle `check`. The web landing page submits reservations via simulated local state without remote endpoints.
2. **Context Budget Enforcement**: Development environments are validated to maintain active prompt/skill context within the 20,000 token limit (`verify-env.sh` checking `agy-skills status`).
3. **Dual Author Attribution**: Pair-programming rotations generate standard Git trailers (`Agent: antigravity`, `Co-authored-by: ...`) ensuring transparent attribution on every commit.

---

## Global Side Effects

- **Environment & Shell Mutation**: `./scripts/setup.sh` writes toolchain binaries to `~/.liftoff/toolchain/` and modifies shell startup scripts (`~/.zshrc`).
- **AudioContext Lifecycle**: Landing page lazily constructs a Web Audio context on the first user interaction for acoustic UI feedback.

---

## System Verification

```bash
# Verify web interface linting and static correctness
pnpm lint

# Verify web interface production build
pnpm build

# Verify local toolchain and offline environment readiness
./scripts/verify-env.sh

# Verify Android template unit test suite (from templates directory)
(cd templates/liftoff-starter && ./gradlew testDebugUnitTest)
```

---

## Decision Log (Project Ontogeny)

- **`[Superseded]` Initial Symmetrical Pitch Layout**: Replaced the initial centered hero, gradient blur backdrops (`backdrop-blur-xl`), static bash mockup, and default `create-next-app` README with an asymmetric 4/8 tactile blueprint, interactive Git DAG physics engine, synthesized `AudioContext` feedback, and durable engineering terminology.
- **`[Added]` EGM Blueprint & Contract Hierarchy**: Bootstrapped Elephant-and-Goldfish Model (EGM) contracts across `src/`, `scripts/`, and `templates/` with explicit public interface boundaries, structural invariants, and verification targets.
