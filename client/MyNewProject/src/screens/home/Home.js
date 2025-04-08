import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { signInWithGoogle, signOutWithGoogle } from '../../components/GoogleAuth';
import { AuthContext } from '../../components/AuthProvider';
import expressApi from '../../api/axios';


const Home = () => {

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [mySynagogues, setMySynagogues] = useState();

  // when clicking on the 'MY Syngogues' button
  const mySynagoguesFunc = () => {
    if (mySynagogues.length === 1 ){
    }
    else if ( mySynagogues.length > 1){
      navigation.navigate('My Synagogues', { mySynagogues });
    }
  }

  // move to Synagogue Form component
  const createSynagogue = async () => {
    if (user){
      navigation.navigate('Synagogue Form');
    }
    else {
      const uid = await signInWithGoogle();
      if (uid){
        navigation.navigate('Synagogue Form');
      }
    }
  }

  // take the information of my synagogues
  useEffect(() => {
    const userSynagogues = async () => {
      if (user) {
        const response = await expressApi.get(`/mySynagogues/${user.uid}`);
        setMySynagogues(response.data);
      }
    }
    userSynagogues();
  }, [user])

    return (
      <View style={{ flex: 1, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>

        {/* My Synagogues Button */}
        <TouchableOpacity
          onPress={ mySynagoguesFunc }
        >
          <Text
            style={styles.Link}
          >
            {mySynagogues?.length === 1 ? 'My Synagogue' 
            : mySynagogues?.length > 1 ? 'My Syngaogues' 
            : ''}
          </Text>
        </TouchableOpacity>
        
        {/* Synagogue List component */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Synagogue Search')}
        >
          <Text
            style={styles.Link}
          >
            Synagogue Search
          </Text>
        </TouchableOpacity>

        {/* Synagogue Form Component */}
        <TouchableOpacity
          onPress={ createSynagogue }
        >
          <Text
            style={styles.Link}
          >
            Create Synagogue
          </Text>
        </TouchableOpacity>

        {/* Sign Out Function */}
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