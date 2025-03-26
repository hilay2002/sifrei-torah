import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  // offlineAccess: false,
  webClientId: '1067797101091-dmnfiqadr0n1ci0f19mgmo8j72v7k32k.apps.googleusercontent.com',
  // scopes: ['profile', 'email'],
});

const Home = () => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const signOut = async () => {
    try {

      // Sign out from Google
      await GoogleSignin.signOut();

      // Sign out from Firebase
      await auth().signOut();
      
      console.log('User signed out successfully');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const signInWithGoogle = async () => {
    try {

      await GoogleSignin.hasPlayServices();

      console.log('google sign in');  
      const {data} = await GoogleSignin.signIn();
      console.log('id Token:')
      console.log(data.idToken)

      console.log('google credentioal')
      const googleCredentials = auth.GoogleAuthProvider.credential(data.idToken);

      console.log('firebase auth');
      auth().signInWithCredential(googleCredentials);

    } catch (error) {
      console.error('=> Google Sign In', error);
      return null;
    }
  }

  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;


  if (!user){
    return (
      <View>
        <TouchableOpacity onPress={() => signInWithGoogle()}>
          <Text
            style={{
              color: 'white',
              backgroundColor: 'green',
              padding: 8,
              marginTop: 10,
            }}>
            SignIn With Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={signOut}
          style={[styles.button, styles.logoutButton]}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else {
    return (
      <View>
        <Text>welcome</Text>
      </View>
    );
  }
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red', // Different color for logout
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})