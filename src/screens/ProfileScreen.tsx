import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useApp} from '../services/AppContext';
import CommandRouter from '../services/CommandRouter';
import {CommandLogEntry} from '../types/commands';
import Colors from '../constants/Colors';

const ProfileScreen = () => {
  const {state, executeCommand} = useApp();
  const [commandLog, setCommandLog] = useState<CommandLogEntry[]>([]);
  const commandRouter = CommandRouter.getInstance();
  const darkMode = !!state.preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    // Load initial log
    setCommandLog(commandRouter.getLog());

    // Subscribe to log updates
    const unsubscribe = commandRouter.subscribe(() => {
      setCommandLog(commandRouter.getLog());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const togglePreference = async (key: string, value: boolean) => {
    await executeCommand({
      type: 'setPreference',
      payload: {key, value},
    });
  };

  const handleExportLog = async () => {
    const logString = commandRouter.getLogAsString();
    await executeCommand({
      type: 'exportAuditLog',
      payload: {log: logString},
    });
  };

  const handleClearLog = () => {
    Alert.alert(
      'Clear Activity Log',
      'Are you sure you want to clear the entire activity log?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await commandRouter.clearLog();
            setCommandLog([]);
          },
        },
      ],
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      case 'pending':
        return '#FF9500';
      default:
        return '#999';
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Profile</Text>

      <View style={[styles.section, {backgroundColor: colors.surface}]}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Preferences</Text>

        <View style={[styles.preferenceItem, {borderBottomColor: colors.border}]}>
          <View>
            <Text style={[styles.preferenceLabel, {color: colors.text}]}>Dark Mode</Text>
            <Text style={[styles.preferenceDescription, {color: colors.subtext}]}>
              Enable dark theme for the app
            </Text>
          </View>
          <Switch
            value={state.preferences.darkMode as boolean}
            onValueChange={value => togglePreference('darkMode', value)}
            trackColor={{false: colors.border, true: colors.primary}}
          />
        </View>

        <View style={[styles.preferenceItem, {borderBottomColor: colors.border}]}>
          <View>
            <Text style={[styles.preferenceLabel, {color: colors.text}]}>Notifications</Text>
            <Text style={[styles.preferenceDescription, {color: colors.subtext}]}>
              Receive agent activity notifications
            </Text>
          </View>
          <Switch
            value={state.preferences.notifications as boolean}
            onValueChange={value => togglePreference('notifications', value)}
            trackColor={{false: colors.border, true: colors.primary}}
          />
        </View>
      </View>

      <View style={[styles.section, {backgroundColor: colors.surface}]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Agent Activity Log</Text>
          <Text style={[styles.logCount, {color: colors.subtext}]}>{commandLog.length} entries</Text>
        </View>

        <View style={styles.logActions}>
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: colors.primary}]}
            onPress={handleExportLog}>
            <Text style={styles.actionButtonText}>Export Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton, {borderColor: '#FF3B30'}]}
            onPress={handleClearLog}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Clear Log
            </Text>
          </TouchableOpacity>
        </View>

        {commandLog.length === 0 ? (
          <Text style={[styles.emptyLog, {color: colors.subtext}]}>No activity yet</Text>
        ) : (
          commandLog.map(entry => (
            <View
              key={entry.id}
              style={[styles.logEntry, {backgroundColor: colors.background}]}>
              <View style={styles.logHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(entry.status)},
                  ]}>
                  <Text style={styles.statusText}>
                    {entry.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.timestamp, {color: colors.subtext}]}>
                  {formatTimestamp(entry.timestamp)}
                </Text>
              </View>

              <Text style={[styles.commandType, {color: colors.text}]}>
                {entry.command.type}
              </Text>

              <Text style={[styles.payload, {backgroundColor: colors.surface, color: colors.subtext}]}>
                {JSON.stringify(entry.command.payload, null, 2)}
              </Text>

              {entry.reason && (
                <Text style={styles.reason}>Reason: {entry.reason}</Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  logCount: {
    fontSize: 14,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
  },
  logActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButtonText: {
    color: '#FF3B30',
  },
  emptyLog: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 20,
  },
  logEntry: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 11,
  },
  commandType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  payload: {
    fontSize: 12,
    fontFamily: 'Courier',
    padding: 8,
    borderRadius: 4,
  },
  reason: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
