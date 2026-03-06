import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApp} from '../services/AppContext';
import {Command} from '../types/commands';
import Colors from '../constants/Colors';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  proposedCommand?: Command;
}

const AgentFlyout = () => {
  const {state, executeCommand, confirmCommand} = useApp();
  const insets = useSafeAreaInsets();
  const darkMode = !!state.preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your agent assistant. I can help you navigate this app and control various features. Try asking me:\n\n• What can you do?\n• Take me to the Explore page\n• Change my preferences\n• Show me my activity log",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  // Control bottom sheet based on flyoutOpen state
  useEffect(() => {
    if (state.flyoutOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [state.flyoutOpen]);

  const handleClose = useCallback(async () => {
    await executeCommand({type: 'closeFlyout', payload: {}});
  }, [executeCommand]);

  const parseUserIntent = (text: string): {response: string; command?: Command} => {
    const lower = text.toLowerCase();

    // What can you do
    if (lower.includes('what') && (lower.includes('can') || lower.includes('do'))) {
      return {
        response:
          'I can help you with several tasks:\n\n• Navigate between screens (Home, Explore, Profile)\n• Apply filters and sorting on the Explore page\n• Update your preferences like Dark Mode and Notifications\n• Export your agent activity log\n• Show alerts and notifications\n\nJust ask me what you need!',
      };
    }

    // Navigation commands
    if (lower.includes('home') || lower.includes('take me home')) {
      return {
        response: "I'll take you to the Home screen.",
        command: {type: 'navigate', payload: {screen: 'Home'}},
      };
    }

    if (lower.includes('explore') || lower.includes('browse')) {
      return {
        response: "I'll navigate you to the Explore page.",
        command: {type: 'navigate', payload: {screen: 'Explore'}},
      };
    }

    if (lower.includes('profile') || lower.includes('settings') || lower.includes('activity')) {
      return {
        response: "I'll open your Profile page.",
        command: {type: 'navigate', payload: {screen: 'Profile'}},
      };
    }

    // Filter commands
    if (lower.includes('filter') || lower.includes('show')) {
      if (lower.includes('technology') || lower.includes('tech')) {
        return {
          response: "I'll filter the Explore page to show only technology items.",
          command: {
            type: 'applyExploreFilter',
            payload: {filter: 'technology', sort: 'asc'},
          },
        };
      }
      if (lower.includes('lifestyle')) {
        return {
          response: "I'll filter the Explore page to show only lifestyle items.",
          command: {
            type: 'applyExploreFilter',
            payload: {filter: 'lifestyle', sort: 'asc'},
          },
        };
      }
      if (lower.includes('productivity')) {
        return {
          response: "I'll filter the Explore page to show only productivity items.",
          command: {
            type: 'applyExploreFilter',
            payload: {filter: 'productivity', sort: 'asc'},
          },
        };
      }
    }

    // Preference commands
    if (lower.includes('dark mode') || lower.includes('theme')) {
      if (lower.includes('enable') || lower.includes('turn on') || lower.includes('activate')) {
        return {
          response: "I'll enable dark mode for you.",
          command: {type: 'setPreference', payload: {key: 'darkMode', value: true}},
        };
      }
      if (lower.includes('disable') || lower.includes('turn off')) {
        return {
          response: "I'll disable dark mode for you.",
          command: {type: 'setPreference', payload: {key: 'darkMode', value: false}},
        };
      }
    }

    if (lower.includes('notification')) {
      if (lower.includes('enable') || lower.includes('turn on')) {
        return {
          response: "I'll enable notifications for you.",
          command: {type: 'setPreference', payload: {key: 'notifications', value: true}},
        };
      }
      if (lower.includes('disable') || lower.includes('turn off')) {
        return {
          response: "I'll disable notifications for you.",
          command: {type: 'setPreference', payload: {key: 'notifications', value: false}},
        };
      }
    }

    // Default response
    return {
      response:
        "I'm not sure I understand. Try asking me to:\n• Navigate to a screen\n• Filter items\n• Change your preferences\n• Or ask 'What can you do?'",
    };
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Parse intent and generate response
    const {response, command} = parseUserIntent(inputText);

    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      proposedCommand: command,
    };

    setMessages(prev => [...prev, agentMessage]);

    // Execute command if present
    if (command) {
      await executeCommand(command);
    }
  };

  const handleConfirm = async (confirmed: boolean) => {
    await confirmCommand(confirmed);

    // Add confirmation feedback
    const feedbackMessage: Message = {
      id: Date.now().toString(),
      text: confirmed
        ? 'Done! The action has been executed.'
        : 'Okay, I cancelled that action.',
      isUser: false,
    };
    setMessages(prev => [...prev, feedbackMessage]);
  };

  const renderMessage = ({item}: {item: Message}) => {
    if (item.isUser) {
      return (
        <View style={styles.userMessageContainer}>
          <View style={styles.userMessage}>
            <Text style={styles.userMessageText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.agentMessageContainer}>
        <View style={[styles.agentMessage, {backgroundColor: darkMode ? '#333' : '#f0f0f0'}]}>
          <Text style={[styles.agentMessageText, {color: colors.text}]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={handleClose}
      backgroundStyle={[styles.bottomSheetBackground, {backgroundColor: colors.card}]}
      handleIndicatorStyle={[styles.handleIndicator, {backgroundColor: colors.border}]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize">
      <View style={[styles.container, {backgroundColor: colors.card}]}>
        <View style={[styles.header, {backgroundColor: colors.card, borderBottomColor: colors.border}]}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Agent Assistant</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.closeButton, {color: colors.primary}]}>Close</Text>
          </TouchableOpacity>
        </View>

        {state.pendingCommand && (
          <View style={styles.confirmationCard}>
            <ScrollView
              style={styles.confirmationScroll}
              showsVerticalScrollIndicator={true}>
              <Text style={styles.confirmationTitle}>Proposed Action</Text>
              <Text style={styles.confirmationText}>
                {state.pendingCommand.type}
              </Text>
              <Text style={styles.confirmationPayload}>
                {JSON.stringify(state.pendingCommand.payload, null, 2)}
              </Text>
            </ScrollView>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => handleConfirm(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.acceptButton]}
                onPress={() => handleConfirm(true)}>
                <Text style={styles.acceptButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <BottomSheetFlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item: Message) => item.id}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        />

        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}>
          <BottomSheetTextInput
            style={[styles.input, {backgroundColor: colors.background, color: colors.text}]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor={darkMode ? '#888' : '#999'}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={[styles.sendButton, {backgroundColor: colors.primary}]} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {},
  handleIndicator: {},
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
  },
  confirmationCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
    maxHeight: '40%', // Prevent card from taking over the whole sheet
  },
  confirmationScroll: {
    maxHeight: 200, // Limit height of scrollable area
    marginBottom: 12,
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    marginBottom: 4,
  },
  confirmationPayload: {
    fontSize: 12,
    color: '#856404',
    fontFamily: 'Courier',
    marginBottom: 12,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#856404',
  },
  acceptButton: {
    backgroundColor: '#856404',
  },
  cancelButtonText: {
    color: '#856404',
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessageText: {
    color: '#fff',
    fontSize: 15,
  },
  agentMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agentMessage: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  agentMessageText: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AgentFlyout;
