# Liftoff Zero-to-One: 2-Week Winter Agentic Android Engineering Bootcamp

* **Author:** Kush Chouhan (@kush-chou)
* **Date:** 2026-10-25

## Overview

Liftoff Zero-to-One is an intensive 14-day residential winter bootcamp piloted at Mayo College, Ajmer, designed for high school students (Grades 9–12). The curriculum guides students from an empty terminal (`git init`) to a signed Android App Bundle (`.aab`) deployed to Google Play under an organization developer account.

Students build local-first, offline-first Free and Open Source Software (FOSS) utilities tailored to boarding school campus life (e.g., house points ledgers, prep timers, campus maps). The program uses native Kotlin and Jetpack Compose directed via **Antigravity 2.0** and the **Elephant-Goldfish Model (EGM)** alongside a lightweight terminal-centric toolchain (`android` CLI `v1.0.16625370`, Gradle, ADB, `scrcpy`) instead of resource-heavy IDE emulators. Every student graduates with three verifiable portfolio artifacts for international university admissions: a public GitHub repository (`github.com/substrata-labs/liftoff-<team_slug>`) with 60+ atomic commits, an **In-App Identity Colophon & Build Fingerprint Screen**, and a signed app live on Google Play.

## Core Toolchain & Methodology Glossary

To ensure zero-context readers require no external institutional assumptions, the six primary tools and methodologies are defined below:

1. **Elephant-Goldfish Model (EGM) (`google/elephant-goldfish-model`)**: The primary engineering methodology taught in the bootcamp (`agy plugin install https://github.com/google/elephant-goldfish-model`). Students draft specifications with full-context "Elephant" agents (`/egm-brainstorm`, `/egm-draft`), stress-test them with stateless, zero-context "Goldfish" subagents (`/egm-review`: zoom-out, comprehension, critic, readiness) before writing code, and verify spec-to-code alignment via `/egm-drift-report`.
2. **Antigravity 2.0 (`agy` / `antigravity`)**: Google's standalone agentic desktop command center and CLI binary bundled on the Day-1 64GB USB drive. Authenticates against parent-consented Google AI Pro (Google One AI Premium) subscriptions via an interactive browser OAuth session (requiring no raw Gemini API keys).
3. **Android CLI (`android` `v1.0.16625370`)**: Google's modern agent-native Android CLI (distinct from the deprecated pre-2017 `tools/android` script). Provides `android info`, `android init`, `android skills`, `android create`, `android describe` (JSON build target/artifact metadata), `android install` & `android run` (incremental fast deploy), and `android layout`, `android screen`, & `android input` (live UI hierarchy inspection, screenshots, and gesture injection on physical handsets).
4. **`inst` (`v0.1.0`)**: Deterministic AI-native package and runtime provisioner (`inst setup -y --json` to auto-provision `.tool-versions` workspace runtimes; `inst uv:<pkg>` / `inst brew:<pkg>`).
5. **`agy-skills` (`v0.1.0`)**: Context and token budget manager for Antigravity and Gemini CLI (`agy-skills status --json`, `agy-skills list -w --json`, `agy-skills enable/disable <name> -w`, `agy-skills lint`). Enforces a strict 20,000 active token cap and 24 KB rule ceiling so students never prematurely exhaust their 5-hour Google AI Pro quota during 2.0-hour evening lab sessions.
6. **`git-ledger`**: Strictly read-only (`GIT_OPTIONAL_LOCKS=0`), zero-network local Git audit CLI (`git ledger --last --agents-only`, `git ledger --diff <hash>`, `git ledger --json`). Used by the Systems Auditor student during Ping-Pong pair programming to inspect agent diffs without locking `.git/index.lock` or mutating the working tree. Standardizes commit trailers on `git-ledger` Confidence 1.0 signals (`Agent: antigravity`, `Model: <model>`, and `Co-authored-by:` for both students).

## Analysis

### 1. Design & Campus Utility (`egm-design`)
* **Campus-Grounded Archetypes**: Rather than building generic to-do apps, students solve real friction points in Mayo College's residential routine:
  * **Inter-House Shield Ledger**: Offline point-tracking and standing tables across houses (Colvin, Bikaner, Bharatpur, Jodhpur, etc.) with custom weights for sports and cultural competitions.
  * **Prep & Routine Chime**: Offline countdown sequencer matching Mayo's historical daily schedule, with tactile haptic patterns via Android's `VibrationEffect`.
  * **Heritage Campus Map**: Offline vector directory of the 187-acre campus with sub-second SQLite text search for buildings, fields, and facilities.
* **Tactile Material 3 Polish**: High-contrast typography, strict light/dark theme parity, and fluid 60–120fps scrolling without dropped frames.
* **In-App Identity Colophon & Build Fingerprint Screen**: A dedicated architectural view displaying the crew's developer handles, Git commit hash, build timestamp, and Apache-2.0 license.

### 2. Codebase & State Architecture (`egm-codebase-details`)
* **Standardized Scaffold (`liftoff-starter`)**:
  * Modern baseline: Android Gradle Plugin 8.8+, Kotlin 2.1+, Jetpack Compose BOM 2025.x, Kotlin Symbol Processing (KSP) 2.1+, and Gradle Play Publisher (`com.github.triplet.play:3.12.1`).
  * Centralized dependency management via `gradle/libs.versions.toml` to prevent version drift across student laptops.
* **Data Structures Over Flags**:
  * Unidirectional Data Flow (UDF) backed by strict `sealed interface UiState<out T>` hierarchies (`Loading`, `Empty`, `Success(val data: T)`, `Error(val cause: String)`).
  * Ban on loose conditional flags (`var isLoading = true`, `var hasError = false`).
* **Deterministic Offline Persistence**:
  * Android Room with type-safe DAOs, Kotlin `Flow` queries, a concrete starter `@Entity` (`ColophonRecord`), and explicit database migration definitions.

### 3. Institutional Alignment & Portfolio Value (`egm-zoom-out`)
* **Admissions Portfolio Packaging**:
  * International admissions committees (MIT, Stanford, Cambridge) favor authentic systems-level proof-of-work over superficial bootcamp certificates.
  * Deliverables include: public Apache-2.0 GitHub repository (`github.com/substrata-labs/liftoff-<team_slug>`), atomic commit DAG, signed Google Play release, and a 3-minute technical architecture screencast.
* **Mayo Administration Buy-In**:
  * Zero server footprints or infrastructure demands on the school IT department.
  * Concludes with an on-campus Demo Day where Housemasters, the Principal, and alumni scan QR codes to install student apps on their phones.

### 4. Pedagogy & Mental Models (`egm-comprehension`)
* **Terminal-First & EGM Mental Models**:
  * Students begin in the shell on Day 1: understanding Git as a directed acyclic graph (DAG) and learning the Elephant-Goldfish Model (EGM) before generating code.
  * Explicit Android compilation pipeline: Source (`.kt`) -> Bytecode (`.class`) -> Dexing (`classes.dex`) -> R8/ProGuard shrinking -> Package (`.apk`/`.aab`) -> Keystore Signing (`apksigner`).
* **Structured Ping-Pong Pair-Programming Crews**:
  * 2-student crews (strictly 10 crews / 20 students maximum) operating across daily 2.0-hour evening lab sessions (18:00–20:00): Hour 1 Lead Architect (EGM specs & prompt steering) and Systems Auditor (`git-ledger` diff audit, `./gradlew test`, `android layout`/`scrcpy` inspection); roles invert at Hour 2 (19:00–20:00).

### 5. Toolchain & Host Laptop Agnosticism (`egm-implementation-readiness`)
* **Lightweight CLI Over Heavy Emulators**:
  * Standard Android Studio and emulators overwhelm 8GB RAM laptops.
  * The stack relies on: Antigravity 2.0, `android` CLI (`v1.0.16625370`), `./gradlew assembleDebug` / `bundleRelease`, Wireless ADB (`adb pair` / `adb connect`) over the lab's 5G router (with AP/Client Isolation disabled), and `scrcpy` (open-source low-latency screen mirroring).
  * **Zero-Virtualization Windows & macOS Bootstrap**: Native `setup.ps1` and `setup.sh` scripts unpack Antigravity 2.0, OpenJDK 17, `android` CLI, `inst`, `agy-skills`, `git-ledger`, and the offline Gradle cache (`~/.gradle/caches`) from the 64GB USB 3.0 drive directly into user-space.
* **Zero Loaner Fleet & Android/iOS Crew Pairing Rule**:
  * Neither Substrata Labs nor Mayo College maintains loaner phones, and some students carry iPhones.
  * *Operational Mitigation*: Every 2-student crew is strictly paired during onboarding so at least one member brings a physical Android 11+ handset (with USB cable ADB fallback for Android 9/10).
* **Google Play Tri-Track Delivery Strategy**:
  * **Track 1 (Baseline - Day 11)**: **Google Play Internal App Sharing** (`./gradlew uploadReleasePrivateBundle`) for immediate link/QR code installations without review delays.
  * **Track 2 (Closed Testing - Day 11–13)**: **Google Play Closed Testing Track** (`./gradlew publishReleaseBundle`) for organization-wide email opt-in links (public Production promotion is an async post-camp milestone).
  * **Track 3 (Instant FOSS Fallback)**: **Direct Signed APK QR Code** hosted on GitHub Releases.

### 6. Skeptical Architecture & Risk Mitigation (`egm-structural`)
* **Offline Resilience**: Pre-bundled 64GB USB 3.0 flash drives contain the complete toolchain and pre-seeded Gradle dependency cache (`~/.gradle/caches/modules-2/` and `wrapper/dists/`) so `org.gradle.offline=true` builds with zero network traffic. An instructor local HTTP cache mirror (`http://192.168.1.254:8081`) serves as an optional on-subnet fallback when `org.gradle.offline=false` is explicitly toggled.
* **Zero-Egress Minor Privacy**: Omission of `android.permission.INTERNET` eliminates cloud database and tracking surfaces, ensuring compliance with India's DPDP Act 2023 and US COPPA.
* **Custodial IP Transfer & Protected Environment Keystore Isolation**:
  * *GitHub Org & Protected Secrets*: Crew repositories are hosted under `github.com/substrata-labs/liftoff-<team_slug>` (Apache-2.0) with student collaborator access on feature branches. Per-crew upload keystores (`upload-<team_slug>.jks`) and Google Play Publisher service account JSON keys are quarantined inside a protected `production-release` GitHub Environment gated by instructor approval.
  * *Age-18 Co-Founder Split & Transfer*: Students retain Day-1 copyright under Apache-2.0 while Substrata Labs holds the Google Play listing in trust during minority. Upon turning 18, Substrata executes a formal Play Console transfer (using Developer Account ID and Registration Transaction ID) to the designated primary co-founder's personal account with their partner added as full Admin, while either student retains the right to publish an independent fork under a distinct `applicationId`.

## Goals vs. Non-Goals

### In-Scope Goals
* 14-day residency format with 28.0 structured lab hours (2.0 hours/day, 18:00–20:00) plus weekend deep-work sprints.
* 2-student Ping-Pong crews (strictly 10 crews / 20 students maximum), paired to guarantee at least one Android handset per crew.
* 100% native Android (Kotlin + Jetpack Compose) directed via Antigravity 2.0 and EGM (`/egm-brainstorm`, `/egm-draft`, `/egm-review`, `/egm-drift-report`) on `liftoff-starter`.
* Terminal-driven compilation, signing, and device deployment via `android` CLI (`v1.0.16625370`), Gradle, `agy-skills`, and `git-ledger`.
* 100% offline-first local persistence using Android Room / SQLite with zero internet permissions.
* Signed `.aab` deployment via protected GitHub Actions environment to Google Play Tri-Track (Internal App Sharing, Closed Testing, and GitHub Releases APK).
* Public GitHub repository (`github.com/substrata-labs/liftoff-<team_slug>`) with 60+ atomic commits carrying `Agent: antigravity`, `Model: <model>`, `Co-authored-by:` for both students, and `Prompted-by:` / `Audited-by:` trailers.
* On-campus Demo Day with live QR code installations on physical Android phones.

### Out-of-Scope Non-Goals
* Cloud backends, remote databases, or external APIs (Firebase, Supabase, custom REST servers).
* User authentication, OAuth, or cloud session management inside student apps.
* Ad mediation networks, in-app purchases, or commercial monetization SDKs.
* Cross-platform abstraction frameworks (Flutter, React Native).
* Heavy IDE dependencies (mandatory Android Studio GUI workflows or virtual emulator instances).

## Key Decisions & Staging for Next Steps

1. **Tri-Track Distribution Target**: Standardize on **Track 1 (Internal App Sharing)**, **Track 2 (Closed Testing)**, and **Track 3 (GitHub Releases Signed APK)** for Day 14 Demo Day, keeping public Production Track promotion as an async post-camp milestone.
2. **Offline Toolchain Provisioning**: Build the 64GB USB 3.0 archive containing Antigravity 2.0, OpenJDK 17, `android` CLI (`v1.0.16625370`), `inst` (`v0.1.0`), `agy-skills` (`v0.1.0`), `git-ledger`, the EGM plugin bundle, and pre-seeded Gradle caches (`~/.gradle/caches/modules-2/`) before arriving on campus.
3. **Template Repository**: Verify `liftoff-starter` with `libs.versions.toml` (including Gradle Play Publisher `3.12.1`), `buildFeatures { buildConfig = true }`, `crew.properties`, `ColophonRecord` starter entity, and dual-variant `verifyZeroEgress` checks.
4. **School Administration Proposal**: Finalize `MAYO_COLLEGE_PROPOSAL.md` highlighting autonomous offline USB provisioning and Substrata's on-site 5G cellular router (zero school internet bandwidth required).
