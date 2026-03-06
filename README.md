# Agent Control App

A React Native mobile app demonstrating an AI agent assistant that controls UI through validated, auditable commands.

## Setup

### Prerequisites
- Node.js 18+
- iOS: Xcode 15+, CocoaPods (iOS 17.0+)
- Android: Android Studio, JDK 17

### Install Dependencies
```bash
npm install
```

### iOS
Standard way:
```bash
cd ios
bundle install
bundle exec pod install
cd ..
npx react-native run-ios
```

**Alternative way (Xcode):**
After running `pod install`, navigate to the `ios` folder and open `AgentControlApp.xcworkspace`. Select your target simulator and click the **Build** (Play) button. The app will build and open in the simulator.

### Android
**Standard way (Emulator):**
```bash
npx react-native run-android
```

**Running on Physical Device:**
1. Enable **Developer Options** and **USB Debugging** on your phone (Settings > About Phone > Tap 'Build Number' 7 times).
2. Connect your phone via USB.
3. Verify connection by running `adb devices`.
4. Run the app:
```bash
npx react-native run-android
```

## Architecture (TL;DR)

- **Command Router**: Singleton that validates all agent commands against an allowlist, enforces confirmation rules, and logs every action
- **App Context**: React Context managing global state (preferences, filters, pending commands)
- **Agent Flyout**: Bottom sheet with chat UI, intent parser, and proposed action cards
- **Screens**: Home (intro), Explore (filterable list), Profile (preferences + activity log)
- **Native Modules**: Swift/Kotlin implementations for exporting logs to device file system
- **Storage**: AsyncStorage for logs/preferences, native file APIs for exports

Commands flow: User → Agent → Context → Router → Validation → Confirmation → Execution → Logging → UI

## Key Decisions

- **Command Router pattern**: Centralized validation prevents agent from bypassing safety checks
- **Singleton for Router**: Ensures consistent logging and subscription model across all contexts
- **Bottom sheet vs modal**: Keeps screen context visible, native gesture feel
- **Simple intent parsing**: Keyword-based rules keep demo lightweight and deterministic
- **Context over Redux**: Sufficient for this scope, less boilerplate
- **AsyncStorage vs SQLite**: Simple, built-in, adequate for 100-entry log retention
- **TypeScript strict types**: Command schemas prevent runtime errors
- **Confirmation for state changes**: setPreference and applyExploreFilter require user approval
- **Native file APIs only**: Challenge requirement—no libraries like react-native-fs
- **Activity log in Profile**: Transparency and auditability are first-class features

## AI Disclosure

**Tools used**: Gemini 3 Flash with Antigravity

**Core Contributions**:
- **Design & Architecture**: I (the developer) architected the **Command Router** system, defining the validation schemas, security allowlist, and audit logging patterns.
- **Security Policy**: I established the specific confirmation protocol, deciding which agent actions require user approval versus direct execution.
- **UX & Branding**: I designed the agent's flyout experience, theme integration, and the overall navigation flow of the application.
- **Logic Implementation**: I implemented the core service layer, including state management via Context and native module interaction for file exports.
- **Native File Creation**: I developed the native Swift/Kotlin logic for creating and writing files to the device document directory, ensuring no external libraries (like react-native-fs) were used.

**AI Assistance**:
The AI assisted in:
- Generating initial boilerplate for React Navigation and the bottom sheet.
- Drafting complex TypeScript unions for the command schemas.
- Providing syntax references for Swift/Kotlin native module implementations.
- Assisting with the dark mode styling system and AsyncStorage utility functions.

## Demo Script

1. Launch app → Home screen with intro cards
2. Tap floating "Agent" button → Agent flyout opens
3. Type "What can you do?" → Agent lists capabilities
4. Type "Take me to Explore" → Agent proposes navigate command → App navigates to Explore
5. Type "Show me technology items" → Proposed Action card appears → Tap Confirm → Filter applied, list updates
6. Navigate to Profile → Toggle Dark Mode switch → Proposed Action card → Confirm → Preference saved
7. Scroll to Activity Log → See all executed/rejected commands with timestamps and reasons
8. Tap Export Log → Confirmation → Log saved to device documents directory

## Test

**File**: `__tests__/CommandRouter.test.ts`

**What it proves**: The Command Router correctly rejects invalid commands (not in allowlist, wrong schema, bad values) and enforces confirmation policies. Tests validate allowlist enforcement, schema validation for navigate/filter/setPreference commands, and confirmation requirements. This ensures the agent cannot execute unsafe or malformed commands.

Run: `npm test`

## Next Steps

With 1-2 more days, I would:

- Add LLM integration (OpenAI/Anthropic API) for real natural language understanding instead of keyword matching
- Implement deep linking support with web portal (buttons to open screens via URL schemes)
- Add command undo/redo stack for user error recovery
- Expand command set (biometric auth, camera access, share sheet)
- Add analytics instrumentation for agent usage patterns
- Implement command macro system (chain multiple commands)
- Add voice input via speech-to-text
- Create admin dashboard for reviewing user-agent interactions
- Add offline mode with command queueing
- Implement differential logging (only store deltas for large logs)

## Submission Checklist

- [x] Repo named mobile-platform-homework-<first-last> and default branch is main
- [x] README includes Setup commands for iOS + Android
- [x] README word count ≤ 500 (excluding commands/checkboxes)
- [x] agent/CONTEXT.md included
- [x] artifacts/decisions.md included (≤ 400 words)
- [x] artifacts/architecture.md included
- [ ] artifacts/demo-ios.mp4 and artifacts/demo-android.mp4 included
- [x] One meaningful test included and described
- [x] AI disclosure included (tools used + how + what was yours)
