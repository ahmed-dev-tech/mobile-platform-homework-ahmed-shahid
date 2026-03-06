import React, {useEffect} from 'react';
import {NavigationContainer, useNavigationContainerRef, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity, Text, View, StatusBar} from 'react-native';
import Colors from './src/constants/Colors';

import {AppProvider, useApp} from './src/services/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AgentFlyout from './src/components/AgentFlyout';

const Tab = createBottomTabNavigator();

function AppContent() {
  const {state, setNavigation, executeCommand} = useApp();
  const navigationRef = useNavigationContainerRef();
  const darkMode = !!state.preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    if (navigationRef.isReady()) {
      setNavigation(navigationRef);
    }
  }, [navigationRef]);

  const handleOpenAgent = async () => {
    await executeCommand({type: 'openFlyout', payload: {}});
  };

  return (
    <>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        ref={navigationRef}
        theme={darkMode ? DarkTheme : DefaultTheme}
        onReady={() => {
          setNavigation(navigationRef);
        }}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTitleStyle: {
              fontWeight: '600',
              color: colors.text,
            },
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.subtext,
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name="explore" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name="person" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[styles.floatingButton, {backgroundColor: colors.primary}]}
          onPress={handleOpenAgent}>
          <Text style={styles.floatingButtonText}>Agent</Text>
        </TouchableOpacity>
      </View>

      <AgentFlyout />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default App;
