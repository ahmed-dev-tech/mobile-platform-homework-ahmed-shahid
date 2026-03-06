export type ScreenName = 'Home' | 'Explore' | 'Profile';

export type CommandType =
  | 'navigate'
  | 'openFlyout'
  | 'closeFlyout'
  | 'applyExploreFilter'
  | 'setPreference'
  | 'showAlert'
  | 'exportAuditLog';

export interface NavigateCommand {
  type: 'navigate';
  payload: {
    screen: ScreenName;
  };
}

export interface OpenFlyoutCommand {
  type: 'openFlyout';
  payload: Record<string, never>;
}

export interface CloseFlyoutCommand {
  type: 'closeFlyout';
  payload: Record<string, never>;
}

export interface ApplyExploreFilterCommand {
  type: 'applyExploreFilter';
  payload: {
    filter: string;
    sort?: 'asc' | 'desc';
  };
}

export interface SetPreferenceCommand {
  type: 'setPreference';
  payload: {
    key: string;
    value: boolean | string | number;
  };
}

export interface ShowAlertCommand {
  type: 'showAlert';
  payload: {
    title: string;
    message: string;
  };
}

export interface ExportAuditLogCommand {
  type: 'exportAuditLog';
  payload: {
    log: string;
  };
}

export type Command =
  | NavigateCommand
  | OpenFlyoutCommand
  | CloseFlyoutCommand
  | ApplyExploreFilterCommand
  | SetPreferenceCommand
  | ShowAlertCommand
  | ExportAuditLogCommand;

export interface CommandLogEntry {
  id: string;
  timestamp: number;
  command: Command;
  status: 'executed' | 'rejected' | 'pending';
  reason?: string;
}

export interface CommandValidationResult {
  valid: boolean;
  error?: string;
}

export interface CommandExecutionResult {
  success: boolean;
  error?: string;
}
