# Liftoff Zero-to-One: Agentic Android Field Manual
## 14-Day Engineering Residency Handbook

* **Organization**: Substrata Labs (`github.com/substrata-labs`)
* **Target Audience**: High School Student Engineering Crews (Grades 9–12)
* **Standard Residency Duration**: 14 Days (28.0 Dedicated Lab Hours, 18:00–20:00 Daily)
* **License**: Apache-2.0

---

## Part 1: Agentic Engineering Principles

### 1.1 The Elephant-Goldfish Model (EGM)
Modern autonomous software engineering requires strict separation of memory regimes:
1. **Elephant Persona (High-Altitude Context & Memory)**:
   - Long-lived architectural context.
   - Responsible for problem discovery, interface contracts, and requirements decomposition (`docs/spec.md`).
   - Invocation triggers: `/egm-brainstorm`, `/egm-draft`.
2. **Goldfish Persona (Zero-Context Adversarial Audit)**:
   - Stateless, hyper-critical inspection subagents.
   - Evaluates code and specifications with zero assumptions, checking for undefined behavior, security oversights, unhandled edge cases, and documentation drift.
   - Invocation triggers: `/egm-review`, `/egm-drift-report`.

### 1.2 Antigravity 2.0 Orchestration & Steering
- **Spec-First, Code-Second**: Never invoke code synthesis until `docs/spec.md` is reviewed and approved.
- **Single Vertical Slice**: Direct Antigravity 2.0 to implement exactly one verified slice (one model, one DAO, or one screen state) per turn.
- **Red-to-Green Verification**: Verify state transitions locally with automated tests (`./gradlew testDebugUnitTest`) before committing.

### 1.3 Context Budget & 20,000 Token Cap
- Context pollution degrades model reasoning. Keep working context compact.
- Enforce the **20,000 active token cap** via `agy-skills status --json`.
- When token usage nears the cap, run `/compact` or reset the session after committing all dirty working-tree state.

---

## Part 2: Ping-Pong Pairing Protocol

### 2.1 Workstation vs. Auditor Station
Each 2-student crew operates with two designated machines:
- **Workstation (Laptop 1)**: Primary execution hub. Runs Antigravity 2.0, the Gradle daemon, and ADB. Permanently paired to the physical Android handset.
- **Auditor Station (Laptop 2)**: Verification and review station. Responsible for authoring specs, inspecting diffs via `git-ledger`, observing live UI mirroring via `scrcpy`, and running offline test suites.

### 2.2 Crew Rotation Cadence
- Roles rotate dynamically across feature milestones during each 18:00–20:00 lab residency:
  - **Lead Architect** (Workstation / Laptop 1): Steers Antigravity 2.0, synthesizes code slices, pairs to handset.
  - **Systems Auditor** (Auditor Station / Laptop 2): Reviews diffs, executes test suites, validates UI bounds.
- **Seat Swap**:
  - Run `bash scripts/crew-swap.sh` on Laptop 1.
  - In under 3 seconds, local Git attribution and commit templates rotate, maintaining co-authorship parity.

### 2.3 Commit Attribution & git-ledger Invariants
Every non-merge commit must contain standardized attribution trailers:
```git
Agent: antigravity
Model: gemini-2.5-pro
Prompted-by: <student-lead> <handle@users.noreply.github.com>
Audited-by: <student-auditor> <handle@users.noreply.github.com>
Co-authored-by: <student-lead> <handle@users.noreply.github.com>
Co-authored-by: <student-auditor> <handle@users.noreply.github.com>
Co-authored-by: Antigravity <antigravity@google.com>
```

---

## Part 3: 14-Day Milestone Guide (18:00–20:00 Daily Lab)

| Day Range | Phase | Milestone Objective | Gate Command |
| :--- | :--- | :--- | :--- |
| **Days 01–02** | Phase 1: Environment & Specs | Provision offline USB toolchain, browser OAuth login, pair phone via ADB, and initialize `crew.properties`. | `android --version && git reflog --oneline -n 5 && adb devices` |
| **Days 03–04** | Phase 2: Domain & UI | Author `docs/spec.md` with Elephant agents, stress-test with Goldfish auditors (`/egm-review`), synthesize Compose screen with `UiState<out T>`. | `agy-skills status --json && ./gradlew compileDebugKotlin --console=plain` |
| **Days 05–06** | Phase 3: Persistence Engine | Implement Room SQLite `@Entity`, KSP `@Dao`, and schema migrations; enforce zero network egress. | `./gradlew testDebugUnitTest verifyZeroEgress` |
| **Day 07** | Phase 4: Mid-Camp Freeze | Cross-crew code review using `git-ledger` (`GIT_OPTIONAL_LOCKS=0`) and `/egm-drift-report`; audit 60fps UI on handset via `scrcpy`. | `git ledger --last --agents-only` |
| **Days 08–09** | Phase 5: Production Hardening | Apply Material 3 theme, edge-to-edge padding, integrate Colophon Screen, and configure R8/ProGuard shrinking. | `./gradlew assembleRelease && android layout` |
| **Days 10–11** | Phase 6: Tri-Track Deploy | Generate signed `.aab`/`.apk`, validate with `bundletool`, deploy Track 1 (Google Play IAS) and Track 3 (GitHub Releases FOSS APK). | `./gradlew uploadReleasePrivateBundle` |
| **Days 12–13** | Phase 7: Technical Dossier | Author architectural `README.md`, record 3-minute technical walkthrough screencast, submit Track 2 (Closed Testing). | `gh pr status && ls -lh docs/architecture.md` |
| **Day 14** | Phase 7: Campus Demo Day | Live on-campus defense before faculty and peers; attendees install apps directly via Track 1 / Track 3 QR codes. | `sha256sum app-release-signed.apk` |

---

## Part 4: CLI Quick Reference

### 4.1 Android CLI (`android`)
- `android --version`: Display active Android CLI version.
- `android run`: Build, install, and launch the debug APK on connected device.
- `android layout`: Inspect live Compose view hierarchy and composable bounds.
- `android logcat`: Stream filtered logcat output for the app package.

### 4.2 Package Dispatcher (`inst`)
- `inst <package>`: Probe and install binaries across uv, Homebrew, npm, and cargo.
- `inst -x <tool>`: Run an ephemeral tool without persistent global installation.

### 4.3 Skill Registry & Token Guard (`agy-skills`)
- `agy-skills status --json`: Output active session token consumption.
- `agy-skills audit`: Verify active skills and rule compliance.

### 4.4 Git Activity & Audit (`git-ledger`)
- `git ledger --md`: Generate Markdown commit and attribution summary.
- `git ledger --last --md`: Standup view of recent multi-crew commits.
- `git ledger --diff`: High-signal, token-dense read-only diff audit.

### 4.5 Gradle Wrapper (`./gradlew`)
- `./gradlew assembleDebug`: Compile debug APK.
- `./gradlew testDebugUnitTest`: Run local JUnit unit tests.
- `./gradlew verifyZeroEgress`: Assert merged manifest contains zero `android.permission.INTERNET`.
- `./gradlew bundleRelease`: Compile production Android App Bundle (`.aab`).

### 4.6 ADB & Screen Mirroring (`adb`, `scrcpy`)
- `adb devices`: List connected physical devices.
- `adb tcpip 5555`: Enable Wireless ADB daemon.
- `scrcpy --max-size 1024 --video-bit-rate 2M`: Low-latency screen mirror over USB.
