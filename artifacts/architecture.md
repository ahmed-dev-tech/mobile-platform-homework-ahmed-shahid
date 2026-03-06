# Architecture Overview

This project implements a **Sandboxed Agent Architecture**, where the agent's ability to affect the app is decoupled from the UI and passing through a dedicated validation layer.

## Component Overview

1.  **Agent Interface (`src/components/AgentFlyout.tsx`)**:
    *   Powered by `@gorhom/bottom-sheet` and its `BottomSheetModal`.
    *   Maintains chat state using local `useState` for performance and focus stability.
    *   Triggers actions via the `executeCommand` hook globally.

2.  **Command Validation Layer (`src/services/CommandRouter.ts`)**:
    *   **The Guardrail**: Implements a singleton `CommandRouter`.
    *   **Allowlisting**: Screens every request against `ALLOWED_COMMANDS`.
    *   **Audit Logging**: Every command (Executed, Rejected, or Pending) is persisted to `AsyncStorage`.

3.  **Global State Management (`src/services/AppContext.tsx`)**:
    *   Acts as the central "Dispatch" for the whole application.
    *   Integrates the `CommandRouter` with actual React Navigation ([src/screens/HomeScreen.tsx](src/screens/HomeScreen.tsx), etc.).
    *   Handles the `pendingCommand` state which renders the **Action Confirmation Card** to the user.

4.  **Native Persistence Bridge**:
    *   **iOS**: `ios/FileExportModule.swift` handles file writing via standard Swift `FileManager`.
    *   **Android**: `android/app/src/main/java/com/agentcontrolapp/FileExportModule.kt` uses Kotlin's `java.io.File` APIs.

## Data Flow (Input to Execution)

1.  **User Input**: User asks "Take me Home" in `AgentFlyout`.
2.  **Intent Parsing**: Local logic in `AgentFlyout` maps "Home" to a `{type: 'navigate', payload: {screen: 'Home'}}` command object.
3.  **Context Dispatch**: `executeCommand(command)` is called within `AppContext`.
4.  **Router Approval**: `CommandRouter` checks the allowlist. Since `navigate` is "safe," it avoids the confirmation trap.
5.  **Execution & Log**: `AppContext` updates `navigationRef.current`. `CommandRouter` logs the timestamp and success to the user's permanent activity log.
6.  **Auditability**: The user visits the **Profile** screen to see the history of what the agent has done.
