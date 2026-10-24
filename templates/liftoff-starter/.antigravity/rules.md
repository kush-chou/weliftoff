# Liftoff Zero-to-One Agentic Workspace Rules

## 1. Domain Modeling & State Containers
- Model all screen state using `ai.substrata.liftoff.core.model.UiState<out T>`.
- Eliminate defensive UI flags (`isLoading`, `hasError`, `isEmpty`) by using exhaustive `when` branching on `UiState`.
- Retain edge-to-edge drawing invariants and Material 3 design tokens.

## 2. Zero-Egress Offline Persistence
- Persist 100% of state locally using Android Room SQLite `@Entity` and `@Dao`.
- Do not introduce remote HTTP/REST dependencies, Firebase, or external network calls.
- The `android.permission.INTERNET` permission is strictly forbidden and actively audited at compile time.

## 3. Commit Hygiene & Provenance Invariants
- Keep commits atomic and bisect-safe, implementing strictly one vertical slice per turn.
- Append standardized attribution trailers to every non-merge commit:
  ```
  Agent: antigravity
  Model: <model-name>
  Co-authored-by: <student-a-handle>
  Co-authored-by: <student-b-handle>
  Prompted-by: <driver-handle>
  Audited-by: <auditor-handle>
  ```
