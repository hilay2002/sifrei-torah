import { StyleSheet } from 'react-native';
import React from 'react';
import SynagogueForm from './src/screens/synagogue/synagogueForm/SynagogueForm';
import SynagogueList from './src/screens/synagogue/synagogueList/SynagogueList';
import Synagogue from './src/screens/synagogue/synagogue/Synagogue';
import Home from './src/screens/home/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Synagogue List" component={SynagogueList} />
          <Stack.Screen name="Synagogue" component={Synagogue} />
          <Stack.Screen name="Synagogue Form" component={SynagogueForm} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
