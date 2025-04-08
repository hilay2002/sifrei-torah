import { StyleSheet, Text, View, FlatList, Button } from 'react-native'
import React from 'react'
import SynagogueCard from '../../../components/SynagogueCard'

const MySynagouges = ({ navigation, route }) => {
    const { mySynagogues } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={mySynagogues}
        keyExtractor={(item) => item._id} // Assuming _id is unique
        renderItem={({ item }) => <SynagogueCard synagogue={item} navigation={navigation}/>}
        contentContainerStyle={styles.list}
      />
      <View style={styles.buttonContainer}>
        <Button title="Go to Synagogue Form" onPress={() => navigation.navigate('Synagogue Form')} />
      </View>
    </View>
  )
}

export default MySynagouges

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
})