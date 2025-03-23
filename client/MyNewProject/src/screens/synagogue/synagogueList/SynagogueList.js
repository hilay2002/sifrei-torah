import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import expressApi from '../../../api/axios';
import SynagogueCard from './SynagogueCard';

const SynagogueList = () => {
  const navigation = useNavigation();
  const [synagogues, setSynagogues] = useState([]);

  useEffect(() => {
    const fetchSynagogues = async () => {
      try {
        const response = await expressApi.get('/synagogueCards');
        setSynagogues(response.data);
      } catch (error) {
        console.error('Error fetching synagogues:', error);
      }
    };

    fetchSynagogues();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={synagogues}
        keyExtractor={(item) => item._id} // Assuming _id is unique
        renderItem={({ item }) => <SynagogueCard synagogue={item} navigation={navigation}/>}
        contentContainerStyle={styles.list}
      />
      <View style={styles.buttonContainer}>
        <Button title="Go to Synagogue Form" onPress={() => navigation.navigate('Synagogue Form')} />
      </View>
    </View>
  );
};

export default SynagogueList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buttonContainer: {
    margin: 20, // Adds space above the button
  },
});
