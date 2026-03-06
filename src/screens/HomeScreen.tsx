import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useApp} from '../services/AppContext';

const HomeScreen = () => {
  const {executeCommand} = useApp();

  const handleOpenAgent = async () => {
    await executeCommand({type: 'openFlyout', payload: {}});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agent Control App</Text>
      <Text style={styles.subtitle}>
        Welcome to the agent-controlled mobile experience
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What is this app?</Text>
        <Text style={styles.cardText}>
          This app demonstrates an AI agent that can navigate and control the UI
          through validated, auditable commands.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How to use</Text>
        <Text style={styles.cardText}>
          1. Tap the agent button at the bottom{'\n'}
          2. Ask the agent what it can do{'\n'}
          3. Let the agent help you navigate{'\n'}
          4. View the activity log in your Profile
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleOpenAgent}>
        <Text style={styles.buttonText}>Open Agent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
