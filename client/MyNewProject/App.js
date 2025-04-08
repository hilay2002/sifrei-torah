import { StyleSheet } from 'react-native';
import React from 'react';
import SynagogueForm from './src/screens/synagogue/forms/synagogueForm/SynagogueForm';
import MySynagogues from './src/screens/synagogue/MySynagogues/MySynagogues';
import SynagogueSearch from './src/screens/synagogue/synagogueList/SynagogueSearch';
import Synagogue from './src/screens/synagogue/synagogue/Synagogue';
import Home from './src/screens/home/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/components/AuthProvider'
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Synagogue Search" component={SynagogueSearch} />
            <Stack.Screen name="Synagogue" component={Synagogue} />
            <Stack.Screen name="Synagogue Form" component={SynagogueForm} />
            <Stack.Screen name="My Synagogues" component={MySynagogues} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
