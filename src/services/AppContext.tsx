import React, {createContext, useContext, useState, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommandRouter from './CommandRouter';
import {Command, CommandExecutionResult} from '../types/commands';
import {NativeModules} from 'react-native';

const {FileExportModule} = NativeModules;

interface AppState {
  flyoutOpen: boolean;
  exploreFilter: string;
  exploreSort: 'asc' | 'desc';
  preferences: Record<string, boolean | string | number>;
  pendingCommand: Command | null;
}

interface AppContextType {
  state: AppState;
  executeCommand: (command: Command) => Promise<CommandExecutionResult>;
  confirmCommand: (confirmed: boolean) => Promise<void>;
  navigation: any;
  setNavigation: (nav: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PREFERENCES_KEY = '@app_preferences';

export const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [navigation, setNavigation] = useState<any>(null);
  const [state, setState] = useState<AppState>({
    flyoutOpen: false,
    exploreFilter: '',
    exploreSort: 'asc',
    preferences: {
      darkMode: false,
      notifications: true,
    },
    pendingCommand: null,
  });

  const commandRouter = CommandRouter.getInstance();

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
        if (stored) {
          const prefs = JSON.parse(stored);
          setState(prev => ({...prev, preferences: prefs}));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  const savePreferences = async (prefs: Record<string, boolean | string | number>) => {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const executeCommand = useCallback(
    async (command: Command): Promise<CommandExecutionResult> => {
      // Validate command
      const validation = commandRouter.validate(command);
      if (!validation.valid) {
        await commandRouter.logCommand(command, 'rejected', validation.error);
        return {success: false, error: validation.error};
      }

      // Check if requires confirmation
      if (commandRouter.requiresConfirmation(command)) {
        setState(prev => ({...prev, pendingCommand: command}));
        await commandRouter.logCommand(command, 'pending', 'Awaiting user confirmation');
        return {success: true};
      }

      // Execute command directly
      return await executeCommandDirect(command);
    },
    [commandRouter],
  );

  const executeCommandDirect = async (
    command: Command,
  ): Promise<CommandExecutionResult> => {
    try {
      switch (command.type) {
        case 'navigate':
          if (navigation) {
            navigation.navigate(command.payload.screen);
            await commandRouter.logCommand(command, 'executed');
            return {success: true};
          }
          throw new Error('Navigation not available');

        case 'openFlyout':
          setState(prev => ({...prev, flyoutOpen: true}));
          await commandRouter.logCommand(command, 'executed');
          return {success: true};

        case 'closeFlyout':
          setState(prev => ({...prev, flyoutOpen: false}));
          await commandRouter.logCommand(command, 'executed');
          return {success: true};

        case 'applyExploreFilter':
          setState(prev => ({
            ...prev,
            exploreFilter: command.payload.filter,
            exploreSort: command.payload.sort || 'asc',
          }));
          await commandRouter.logCommand(command, 'executed');
          return {success: true};

        case 'setPreference':
          const newPrefs = {
            ...state.preferences,
            [command.payload.key]: command.payload.value,
          };
          setState(prev => ({...prev, preferences: newPrefs}));
          await savePreferences(newPrefs);
          await commandRouter.logCommand(command, 'executed');
          return {success: true};

        case 'showAlert':
          Alert.alert(command.payload.title, command.payload.message);
          await commandRouter.logCommand(command, 'executed');
          return {success: true};

        case 'exportAuditLog':
          if (FileExportModule) {
            await FileExportModule.exportLog(command.payload.log);
            await commandRouter.logCommand(command, 'executed');
            return {success: true};
          }
          throw new Error('File export module not available');

        default:
          throw new Error(`Unknown command type`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      await commandRouter.logCommand(command, 'rejected', errorMsg);
      return {success: false, error: errorMsg};
    }
  };

  const confirmCommand = useCallback(
    async (confirmed: boolean) => {
      const {pendingCommand} = state;
      if (!pendingCommand) return;

      if (confirmed) {
        await executeCommandDirect(pendingCommand);
      } else {
        await commandRouter.logCommand(
          pendingCommand,
          'rejected',
          'User declined confirmation',
        );
      }

      setState(prev => ({...prev, pendingCommand: null}));
    },
    [state.pendingCommand],
  );

  return (
    <AppContext.Provider
      value={{state, executeCommand, confirmCommand, navigation, setNavigation}}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
