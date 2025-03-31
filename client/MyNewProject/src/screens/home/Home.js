import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { signInWithGoogle, signOutWithGoogle } from '../../components/GoogleAuth';
import { AuthContext } from '../../components/AuthProvider';


const Home = () => {

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const createSynagogue = async () => {
    if (user){
      navigation.navigate('Synagogue Form');
    }
    else {
      await signInWithGoogle();
      if (user){
        navigation.navigate('Synagogue Form');
      }
    }
  }

    return (
<View style={{ flex: 1, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={ createSynagogue }
        >
          <Text
            style={styles.Link}
          >
            Create Synagogue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Synagogue List')}
        >
          <Text
            style={styles.Link}
          >
            Synagogue List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ signOutWithGoogle }
        >
          <Text
            style={styles.Link}
          >
            Sign Out
          </Text>
        </TouchableOpacity>

      </View>
    )
}

export default Home

const styles = StyleSheet.create({
  Link: {
    fontSize: 16,
    color: '#3399FF',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  }
})