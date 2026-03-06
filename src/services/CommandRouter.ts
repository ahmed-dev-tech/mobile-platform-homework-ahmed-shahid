import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Command,
  CommandType,
  CommandLogEntry,
  CommandValidationResult,
  CommandExecutionResult,
} from '../types/commands';

const STORAGE_KEY = '@agent_command_log';

// Allowlist of approved commands
const ALLOWED_COMMANDS: CommandType[] = [
  'navigate',
  'openFlyout',
  'closeFlyout',
  'applyExploreFilter',
  'setPreference',
  'showAlert',
  'exportAuditLog',
];

// Commands that require user confirmation
const REQUIRES_CONFIRMATION: CommandType[] = [
  'setPreference',
  'applyExploreFilter',
  'exportAuditLog',
];

class CommandRouter {
  private static instance: CommandRouter;
  private commandLog: CommandLogEntry[] = [];
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.loadLog();
  }

  static getInstance(): CommandRouter {
    if (!CommandRouter.instance) {
      CommandRouter.instance = new CommandRouter();
    }
    return CommandRouter.instance;
  }

  // Subscribe to log updates
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Load command log from AsyncStorage
  private async loadLog() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.commandLog = JSON.parse(stored);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load command log:', error);
    }
  }

  // Save command log to AsyncStorage
  private async saveLog() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.commandLog));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save command log:', error);
    }
  }

  // Validate command against allowlist and schema
  validate(command: Command): CommandValidationResult {
    // Check if command type is in allowlist
    if (!ALLOWED_COMMANDS.includes(command.type)) {
      return {
        valid: false,
        error: `Command "${command.type}" is not in the allowlist`,
      };
    }

    // Validate command-specific payload
    switch (command.type) {
      case 'navigate':
        if (!['Home', 'Explore', 'Profile'].includes(command.payload.screen)) {
          return {
            valid: false,
            error: `Invalid screen: ${command.payload.screen}`,
          };
        }
        break;

      case 'applyExploreFilter':
        if (!command.payload.filter || typeof command.payload.filter !== 'string') {
          return {valid: false, error: 'Filter is required and must be a string'};
        }
        if (
          command.payload.sort &&
          !['asc', 'desc'].includes(command.payload.sort)
        ) {
          return {valid: false, error: 'Sort must be "asc" or "desc"'};
        }
        break;

      case 'setPreference':
        if (!command.payload.key || typeof command.payload.key !== 'string') {
          return {valid: false, error: 'Preference key is required'};
        }
        const allowedTypes = ['boolean', 'string', 'number'];
        if (!allowedTypes.includes(typeof command.payload.value)) {
          return {
            valid: false,
            error: 'Preference value must be boolean, string, or number',
          };
        }
        break;

      case 'showAlert':
        if (!command.payload.title || !command.payload.message) {
          return {valid: false, error: 'Alert title and message are required'};
        }
        break;

      case 'exportAuditLog':
        if (!command.payload.log || typeof command.payload.log !== 'string') {
          return {valid: false, error: 'Log data is required'};
        }
        break;
    }

    return {valid: true};
  }

  // Check if command requires confirmation
  requiresConfirmation(command: Command): boolean {
    return REQUIRES_CONFIRMATION.includes(command.type);
  }

  // Log a command execution
  async logCommand(
    command: Command,
    status: 'executed' | 'rejected' | 'pending',
    reason?: string,
  ): Promise<void> {
    const entry: CommandLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      command,
      status,
      reason,
    };

    this.commandLog.unshift(entry);

    // Keep only last 100 entries
    if (this.commandLog.length > 100) {
      this.commandLog = this.commandLog.slice(0, 100);
    }

    await this.saveLog();
  }

  // Get all command log entries
  getLog(): CommandLogEntry[] {
    return [...this.commandLog];
  }

  // Get log as formatted string for export
  getLogAsString(): string {
    return this.commandLog
      .map(
        entry =>
          `[${new Date(entry.timestamp).toISOString()}] ${entry.status.toUpperCase()}: ${
            entry.command.type
          }${entry.reason ? ` - ${entry.reason}` : ''}\n  Payload: ${JSON.stringify(entry.command.payload)}`,
      )
      .join('\n\n');
  }

  // Clear the log
  async clearLog(): Promise<void> {
    this.commandLog = [];
    await this.saveLog();
  }
}

export default CommandRouter;
