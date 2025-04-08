import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential, signOut, onAuthStateChanged } from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId: '1067797101091-dmnfiqadr0n1ci0f19mgmo8j72v7k32k.apps.googleusercontent.com',
});

const auth = getAuth();

  export const signOutWithGoogle = async () => {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();

      // Sign out from Firebase
      await signOut(auth);
      
      console.log('User signed out successfully');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  export const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true, // (Default: false)
      });

      console.log('google sign in');  
      const {data} = await GoogleSignin.signIn();
      console.log('id Token:')

      console.log('google credentioal')
      const googleCredentials = GoogleAuthProvider.credential(data.idToken);

      console.log('firebase auth');
      const userCredetial = await signInWithCredential(auth, googleCredentials);
      const uid = userCredetial.user._user.uid;
      return uid;

    } catch (error) {
      console.error('=> Google Sign In', error);
      return null;
    }
  }
