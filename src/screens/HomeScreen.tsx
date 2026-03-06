import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useApp} from '../services/AppContext';
import Colors from '../constants/Colors';

const HomeScreen = () => {
  const {state, executeCommand} = useApp();
  const darkMode = !!state.preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

  const handleOpenAgent = async () => {
    await executeCommand({type: 'openFlyout', payload: {}});
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Agent Control App</Text>
      <Text style={[styles.subtitle, {color: colors.subtext}]}>
        Welcome to the agent-controlled mobile experience
      </Text>

      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <Text style={[styles.cardTitle, {color: colors.text}]}>What is this app?</Text>
        <Text style={[styles.cardText, {color: colors.subtext}]}>
          This app demonstrates an AI agent that can navigate and control the UI
          through validated, auditable commands.
        </Text>
      </View>

      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <Text style={[styles.cardTitle, {color: colors.text}]}>How to use</Text>
        <Text style={[styles.cardText, {color: colors.subtext}]}>
          1. Tap the agent button at the bottom{'\n'}
          2. Ask the agent what it can do{'\n'}
          3. Let the agent help you navigate{'\n'}
          4. View the activity log in your Profile
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={handleOpenAgent}>
        <Text style={styles.buttonText}>Open Agent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  card: {
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
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
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
