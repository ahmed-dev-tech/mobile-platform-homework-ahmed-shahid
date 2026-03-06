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

const ProfileScreen = () => {
  const {state, executeCommand} = useApp();
  const [commandLog, setCommandLog] = useState<CommandLogEntry[]>([]);
  const commandRouter = CommandRouter.getInstance();

  useEffect(() => {
    // Load initial log
    setCommandLog(commandRouter.getLog());

    // Subscribe to log updates
    const unsubscribe = commandRouter.subscribe(() => {
      setCommandLog(commandRouter.getLog());
    });

    return unsubscribe;
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.preferenceItem}>
          <View>
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
            <Text style={styles.preferenceDescription}>
              Enable dark theme for the app
            </Text>
          </View>
          <Switch
            value={state.preferences.darkMode as boolean}
            onValueChange={value => togglePreference('darkMode', value)}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View>
            <Text style={styles.preferenceLabel}>Notifications</Text>
            <Text style={styles.preferenceDescription}>
              Receive agent activity notifications
            </Text>
          </View>
          <Switch
            value={state.preferences.notifications as boolean}
            onValueChange={value => togglePreference('notifications', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agent Activity Log</Text>
          <Text style={styles.logCount}>{commandLog.length} entries</Text>
        </View>

        <View style={styles.logActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportLog}>
            <Text style={styles.actionButtonText}>Export Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleClearLog}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Clear Log
            </Text>
          </TouchableOpacity>
        </View>

        {commandLog.length === 0 ? (
          <Text style={styles.emptyLog}>No activity yet</Text>
        ) : (
          commandLog.map(entry => (
            <View key={entry.id} style={styles.logEntry}>
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
                <Text style={styles.timestamp}>
                  {formatTimestamp(entry.timestamp)}
                </Text>
              </View>

              <Text style={styles.commandType}>{entry.command.type}</Text>

              <Text style={styles.payload}>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 16,
  },
  logCount: {
    fontSize: 14,
    color: '#666',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#666',
  },
  logActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
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
    color: '#999',
    fontSize: 16,
    paddingVertical: 20,
  },
  logEntry: {
    backgroundColor: '#f8f8f8',
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
    color: '#666',
  },
  commandType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  payload: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Courier',
    backgroundColor: '#fff',
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
