# Agent Context

## What is this app?

Agent Control App is a mobile application that demonstrates an AI agent assistant controlling UI through validated, auditable commands. The app has three main screens (Home, Explore, Profile) and an agent flyout that users can interact with via natural language.

## What the agent can do

The agent can execute the following validated commands:

1. **navigate(screen)** - Navigate between Home, Explore, and Profile screens
2. **openFlyout()** - Open the agent chat interface
3. **closeFlyout()** - Close the agent chat interface
4. **applyExploreFilter(filter, sort?)** - Filter and sort items on the Explore screen
5. **setPreference(key, value)** - Update user preferences (darkMode, notifications)
6. **showAlert(title, message)** - Display system alerts to the user
7. **exportAuditLog(log)** - Export the agent activity log to device storage

## What the agent cannot do

- Execute commands not in the allowlist
- Directly manipulate UI (all changes go through the Command Router)
- Execute state-changing commands without user confirmation
- Access device features outside the defined command set
- Bypass validation or logging mechanisms

## Command Contract

### Validation Rules
- All commands must be in the allowlist
- Command payloads must match their schema
- Screen names must be: Home, Explore, or Profile
- Filter values must be non-empty strings
- Sort values must be: 'asc' or 'desc'
- Preference values must be boolean, string, or number

### Confirmation Policy

Commands requiring user confirmation:
- **setPreference** - Changes user settings
- **applyExploreFilter** - Modifies screen state
- **exportAuditLog** - Writes to device storage

Commands that execute immediately:
- **navigate** - Safe navigation actions
- **openFlyout** / **closeFlyout** - UI visibility changes
- **showAlert** - Informational only

### Logging

All commands are logged with:
- Unique ID and timestamp
- Command type and payload
- Status: executed, rejected, or pending
- Rejection reason (if applicable)

Users can view the full audit log in their Profile screen.

## Example Interactions

### Golden Path 1: Navigation
```
User: "Take me to the Explore page"
Agent: "I'll navigate you to the Explore page."
→ Command: navigate(screen: "Explore")
→ Status: Executed immediately (no confirmation needed)
```

### Golden Path 2: Filter with Confirmation
```
User: "Show me technology items"
Agent: "I'll filter the Explore page to show only technology items."
→ Proposed Action card shown
→ User confirms
→ Command: applyExploreFilter(filter: "technology", sort: "asc")
→ Status: Executed after confirmation
```

### Golden Path 3: Preference Change
```
User: "Enable dark mode"
Agent: "I'll enable dark mode for you."
→ Proposed Action card shown with setPreference details
→ User confirms
→ Command: setPreference(key: "darkMode", value: true)
→ Status: Executed after confirmation
→ Logged in activity log
```
