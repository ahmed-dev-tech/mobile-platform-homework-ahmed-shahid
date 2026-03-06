# Key Architecture Decisions

This document outlines the specific technical choices made for the Agent Control App, focusing on the trade-offs between simplicity, security, and user experience.

## Core Logic & Security

### 1. Centralized Command Validation (The "Guardrail")
- **Decision**: All agent actions must pass through the `CommandRouter` singleton ([src/services/CommandRouter.ts](src/services/CommandRouter.ts)).
- **Rationale**: Instead of letting the `AgentFlyout` modify state directly, we enforce a strict allowlist and schema validation. This prevents a "malicious" or "buggy" agent from executing unauthorized actions (e.g., deleting data or accessing system settings not in the allowlist).
- **Trade-off**: Slightly more boilerplate to define command schemas, but provides a 100% auditable record of every attempted action.

### 2. Manual Confirmation for Critical State Changes
- **Decision**: Commands of types `applyExploreFilter`, `setPreference`, and `exportAuditLog` are flagged with `REQUIRES_CONFIRMATION` in the router.
- **Rationale**: Even if a command is "valid," we want the user to stay in control of their data and UI state. 
- **Code Pointer**: Handled in `AppContext.tsx` via the `executeCommand` logic which traps these commands into a `pendingCommand` state.

## UI & User Experience

### 3. Persistent Agent Chat Interface
- **Decision**: Use `BottomSheetModal` with a dedicated `BottomSheetFooter` for the agent's input area ([src/components/AgentFlyout.tsx](src/components/AgentFlyout.tsx)).
- **Rationale**: Standard Absolute positioning in Bottom Sheets often breaks when the keyboard opens or when snap points change (75% to 100%). Using the library's built-in `footerComponent` keeps the input field reliably anchored to the bottom.
- **Trade-off**: Required extracting the footer into a memoized component to prevent focus loss during parent state re-renders.

### 4. Deterministic Intent Parsing
- **Decision**: Keyword-based parsing instead of an external LLM API.
- **Rationale**: For this demo, lower latency and 100% deterministic results are more important than "smart" conversation. It allows us to prove the **Command Execution** pipe works perfectly without dealing with API keys or hallucination issues.

## State & Storage

### 5. Context over Redux
- **Decision**: React Context for global state ([src/services/AppContext.tsx](src/services/AppContext.tsx)).
- **Rationale**: With the `CommandRouter` singleton managing the "activity log" logic, the UI state is simple enough that Redux would add unnecessary weight to the bundle and complexity to the development flow.

### 6. Native Export over FS Libraries
- **Decision**: Custom Swift/Kotlin modules (`FileExportModule`) for saving the log file.
- **Rationale**: To minimize project bloat, we avoided `react-native-fs`. The native implementation targets the app's internal Document Directory, ensuring the export is secure and respects OS sandboxing limits.
