# Key Architecture Decisions

## Decisions Made

### 1. Command Router Pattern with Singleton
Used a centralized Command Router singleton to validate and execute all agent commands.
This ensures consistent validation, logging, and confirmation policies across the entire app without prop drilling or complex state management.

### 2. Bottom Sheet for Agent Flyout
Chose @gorhom/bottom-sheet over a modal or full-screen view for the agent interface.
The bottom sheet keeps context visible, feels native on mobile, and allows quick dismiss gestures while maintaining conversation history.

### 3. Simple Rule-Based Intent Parsing
Implemented keyword-based intent parsing directly in the agent component rather than integrating an LLM.
This keeps the demo lightweight, deterministic, and focused on the command execution architecture rather than NLP complexity.

## Alternatives Rejected

### 4. Redux vs React Context
Rejected Redux in favor of React Context for state management.
Context is sufficient for this app's scope, avoids boilerplate, and the Command Router handles most state logic independently.

### 5. AsyncStorage vs SQLite
Rejected SQLite in favor of AsyncStorage for preferences and logs.
AsyncStorage is simpler, built-in, and adequate for the ~100 log entries we retain; SQLite would be overkill for this use case.
