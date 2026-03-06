# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          React Navigation (Bottom Tabs)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  Home    │  │ Explore  │  │ Profile  │           │   │
│  │  │  Screen  │  │  Screen  │  │  Screen  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Agent Flyout (Bottom Sheet)                   │   │
│  │  - Chat Interface                                     │   │
│  │  - Intent Parser                                      │   │
│  │  - Proposed Action Cards                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    App Context (State)                       │
│  - flyoutOpen, preferences, filters, pendingCommand         │
│  - executeCommand(), confirmCommand()                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Command Router (Singleton)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1. Allowlist Check    →  Is command approved?        │  │
│  │  2. Validation         →  Schema + payload valid?     │  │
│  │  3. Confirmation Rule  →  Requires user approval?     │  │
│  │  4. Logging            →  Log to AsyncStorage         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Command Execution                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Navigation  │  │  State Mgmt  │  │   Native     │      │
│  │  Commands    │  │  Commands    │  │   Modules    │      │
│  │  - navigate  │  │  - setPrefs  │  │  - exportLog │      │
│  │  - flyout    │  │  - filter    │  │   (iOS/And.) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Storage & Persistence                       │
│  - AsyncStorage (Command Log, Preferences)                   │
│  - Device File System (Exported Logs via Native Modules)    │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

1. **App Layer**: UI screens, navigation, and agent flyout
2. **App Context**: Global state management via React Context
3. **Command Router**: Central validation, authorization, and logging
4. **Command Execution**: Handlers for each command type
5. **Storage**: AsyncStorage for app data, native file APIs for exports

## Data Flow

User Input → Agent Flyout → App Context → Command Router → Validation
→ Confirmation (if needed) → Execution → Logging → UI Update
