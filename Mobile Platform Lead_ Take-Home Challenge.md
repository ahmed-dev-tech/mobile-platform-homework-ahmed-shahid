# **Mobile Platform Lead (iOS/Android, React** 
# **+ Native) — Take-Home Challenge (Permission.io)** 
## **Candidate policy: AI is allowed, but generic or wordy is not** 
**AI usage (allowed + expected)** 

- You may use AI tools (ChatGPT/Copilot/etc.) while working. 
- We will reject submissions that read like generic templates or “best practices” essays. 
- We’re evaluating your judgment: tradeoffs, sequencing, and how you communicate. 

**What we want to see** 

- Clear decisions (“I chose X because…”), with 1–2 alternatives you rejected. 
- Concise writing. **Wordy submissions will be rejected.** Show your voice and perspective. 
- Evidence you can ship: runnable app + small, intentional architecture. 

**Disclosure (required)** 

Add a short section in your README: 

- AI tools used 
- What you used them for 
- Your AI workflow 
- What you wrote/decided yourself 
## **Summary** 
Build a small mobile app where the **core experience** is an **anchored** **agent chat** that helps the user navigate and control UI through **validated, auditable commands**. Keep the app small; the goal is a modern UX + production-minded structure. 

- **Timebox:** 6 hours (stop at 6 hours; add “Next steps” to README) 
- **Stack:** React Native & native iOS or Android (feel free to use code kits as needed) 
- **Submission:** GitHub repo link (public is preferred) 
- **Review gate:** If we can’t run iOS *or* Android from your README in ~5 minutes, we won’t review further. 
## **The Challenge (Core)** 
### **App: 3 screens + Agent Flyout (required)** 
Create exactly **three** screens: 

1. **Home** 
1. **Explore** (must have at least one filter/sort control) 
1. **Profile** (must have at least one persistent preference/toggle) 
### The content can be placeholder. The **agent UX** is the product. **Agent Chat (required)** 
Implement a persistent (bottom sheet/drawer..) that: 

- Answers user questions about the app (where things are, what actions are possible) 
- Proposes actions and can control the UI through a **Command Router** 
- Shows **“Proposed Action”** cards for state-changing actions and requires user confirmation 
- Maintains an **Agent Activity Log** (auditable history) visible in Profile 
### **Command Router (required)** 
The agent must NOT directly manipulate UI. It must emit structured commands that go through: 

- **Allowlist** (only approved commands can run) 
- **Validation** (schema + allowed values) 
- **Confirmation rules** (state changes require confirm) 
- **Logging** (executed/rejected + reason + timestamp) 
### **Native Module (required)** 
You must implement a custom **native component** that performs a native filesystem task. 

- Create a native component with a function that allows exporting the agent activity log. 
- This function takes in a string and writes it to the device’s documents directory using native file APIs. 
- Do not use a pre-existing library from RN or Expo for accessing the filesystem. Implement this in the native component (Swift for iOS, Kotlin for Android) 
### **Minimum command set (required)** 
You must support these commands (names can differ; behaviors must match): 

1. navigate(screen) → home | explore | profile 
1. openFlyout() / closeFlyout() 
1. applyExploreFilter(filter, sort?) 
1. setPreference(key, value) → must change a Profile toggle/preference 
1. showAlert(title, message) 
1. exportAuditLog(log) 

**Confirmation rules:** setPreference must require confirmation. Document what else requires confirmation. 
### **Agent “context” file** 
Include a file at agent/CONTEXT.md that defines: 

- What the app is (short) 
- What the agent can/can’t do 
- The command contract + confirmation policy 
- 2–3 example interactions (“golden paths”) 

This file is part of the rigor, not the only focus. Your implementation must reflect it. 
## **Optional (recommended) Stretch: Web portal + deep links** 
If you have time, add a minimal web portal that triggers deep links into the app: 

- 3 buttons linking to: 
- Open Explore with filter applied 
- Open Profile 
- Open flyout with a prefilled prompt 

  If you do this, document deep link formats and how to test them in the README. 

(If you don’t do it, describe how you would.) ![ref1]
## **Constraints** 
- Pick the tools that let you move quickly. 
- Avoid unnecessary complexity. 
- Don’t commit secrets. 
- Keep writing brief and app-specific. ![ref1]
## **Deliverables** 
### **Submission rules: easy to grade** 
**Repo naming + submission** 

- Repo name: mobile-platform-homework-<first-last> Example: mobile-platform-homework-jane-doe 
- Share as: 
- GitHub repo link (preferred) OR zipped repo 
- Include “Submission checklist” completed in README 
- Default branch: main 
### **Required artifacts (gradeable)** 
Your repo must include: 

None![](Aspose.Words.a9e9b67b-6bf2-4637-8e9e-3c9c12503850.002.png)

README.md 

agent/ 

`  `CONTEXT.md 

artifacts/ 

`  `decisions.md 

`  `architecture.png (or .md diagram)   demo-ios.mp4 

`  `demo-android.mp4 
### **README.md must include** 
Show your style here, written communication should be clear and easy to understand. No AI slop. 

- # Setup (exact commands to run iOS and Android) 
- # Architecture (TL;DR) (max 12 lines) 
- # Key decisions (max 10 bullets) 
- # AI disclosure (tools + usage) 
- # Demo script (5–8 bullets for the happy path) 
- # Next steps (what you’d do with 1–2 more days) 
- # Submission checklist (checkboxes) 
### **decisions.md (max 1 page)** 
5 decisions total: 

- 3 decisions you made 
- 2 alternatives you considered and rejected Each decision must be: 
- **1 sentence “what”** 
- **1 sentence “why”** 
### **Demo videos** 
Use a hosted file service or commit to repo. 

- 30–60 seconds each (iOS + Android) 
- Must show: 
1. Open flyout → ask what it can do → agent responds grounded in the app 
1. Agent proposes navigation → app navigates 
1. Agent proposes a preference change → user confirms → preference changes 
1. Agent Activity Log shows executed/rejected commands 
### **Hard limits (enforced)** 
- README: **≤ 500 words** (excluding commands/checkboxes) 
- decisions.md: **≤ 400 words** 
- No generated essays. If it reads generic, it fails. ![ref1]
## **“Generic response” detection (we’ll reject if)** 
- Write-up contains long “best practices” paragraphs without app-specific tradeoffs 
- Architecture is described vaguely with no repo pointers 
- Decisions don’t connect to the actual code 
- The agent is a thin chat UI with no command validation/auditability 
- State changes happen without explicit confirmation rules 
- Native module / platform integration is copy-pasted without explanation or real use ![ref1]
## **One meaningful test (required)** 
Include **one** test that proves the core behavior end-to-end (your choice): 

- Command Router validation rejects invalid commands 
- Confirmation policy is enforced 
- Deep link parsing applies correct navigation/filter (if you implement deep links) 

Describe what the test proves in 2–4 sentences in README. ![ref1]
## **Guidance** 
- Keep the app small and polished. 
- Focus on the agent interaction quality, command safety, and clear boundaries. 
- If time expires, stop and document Next Steps. ![ref1]
## **What we’ll discuss in debrief** 
- Why you chose your stack and tradeoffs you made 
- How you’d harden reliability, analytics, and release process 
- How you’d expand the command surface safely 
- Deep link strategy and web-to-app flows (even if you didn’t build the web portal) ![ref1]
## **Submission checklist (copy/paste into README)** 
- Repo named mobile-platform-homework-<first-last> and default branch is main 
- README includes Setup commands for iOS + Android 
- README word count ≤ 500 (excluding commands/checkboxes) 
- agent/CONTEXT.md included 
- artifacts/decisions.md included (≤ 400 words) 
- artifacts/architecture.(png|md) included 
- artifacts/demo-ios.mp4 and artifacts/demo-android.mp4 included 
- One meaningful test included and described 
- AI disclosure included (tools used + how + what was yours) 

[ref1]: Aspose.Words.a9e9b67b-6bf2-4637-8e9e-3c9c12503850.001.png
