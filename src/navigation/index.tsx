import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

// Screens
import Login from './screens/Login';
import Register from './screens/Register';
import ChatList from './screens/ChatList';
import Chat from './screens/Chat';
import NewChat from './screens/NewChat';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user, loading, isAuthenticated } = useAuth();



  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && user ? (
          // Authenticated stack
          <>
            <Stack.Screen name="ChatList" component={ChatList} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="NewChat" component={NewChat} />
          </>
        ) : (
          // Auth stack
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
