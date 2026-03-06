import React, {useEffect} from 'react';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

import {AppProvider, useApp} from './src/services/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AgentFlyout from './src/components/AgentFlyout';

const Tab = createBottomTabNavigator();

function AppContent() {
  const {setNavigation, executeCommand} = useApp();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (navigationRef.isReady()) {
      console.log('Navigation is ready, setting navigation ref');
      setNavigation(navigationRef);
    }
  }, [navigationRef]);

  const handleOpenAgent = async () => {
    console.log('Open Agent');
    await executeCommand({type: 'openFlyout', payload: {}});
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          console.log('Navigation container ready');
          setNavigation(navigationRef);
        }}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: '600',
            },
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#999',
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
          style={styles.floatingButton}
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
