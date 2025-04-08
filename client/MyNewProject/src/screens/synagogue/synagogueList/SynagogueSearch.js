import { StyleSheet, View, Button, Text, Pressable, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import expressApi from '../../../api/axios';
import SynagogueCard from '../../../components/SynagogueCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SynagogueSearch = ({navigation}) => {

  const [synagogues, setSynagogues] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [synagogueInputs, setSynagogueInputs] = useState({
    name: '',
    city: '',
    street: ''
  })

  const handleInputChange = (field, text) => {
    setSynagogueInputs( (prev) => ({ ...prev, [field]: text }));
  }

  const searchApi = async () => {
    const ifOneOfTheFilterFiledsIsEmpty = filtering && (!synagogueInputs.city || !synagogueInputs.street);
    if (ifOneOfTheFilterFiledsIsEmpty || !synagogueInputs.name){
      alert('Please fill in required fields');
      return;
    }
    const updatedSynagogueInputs = filtering ? synagogueInputs : {name: synagogueInputs.name};
    try {
        const response = await expressApi('/synagogueSearch', {
        params: updatedSynagogueInputs
      });
      setSynagogues(response.data);
    } catch (error){
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
        <View style={styles.searchBarContainer}>

          <View style={styles.inputContainer}>

            {/* Input */}
            <TextInput 
            style={styles.input}
            placeholder="Synagogue Name"
            value={synagogueInputs.name}
            onChangeText={(text) => handleInputChange('name', text)}
            >
            </TextInput>

            {/* Icon */}
            <Pressable
              style={styles.icon}
              onPress={() => setFiltering( (prev) => !prev)}
            >
              {!filtering ?
              <Icon 
                name="filter-outline"
                size={30}
              />
              :
              <Icon 
                name="filter-off-outline"
                size={30}
              />
              }
            </Pressable>
          </View>


          {/* Filter Inputs */}
          {filtering &&
          <View >
            <Text style={styles.text}>More Filters:</Text>

            {/* City */}
            <TextInput 
            style={styles.input}
            placeholder="City"
            value={synagogueInputs.city}
            onChangeText={(text) => handleInputChange('city', text)}
            >
            </TextInput>

            {/* Street */}
            <TextInput 
            style={styles.input}
            placeholder="Full Street Address"
            value={synagogueInputs.street}
            onChangeText={(text) => handleInputChange('street', text)}
            >
            </TextInput>
          </View>
          }

          {/* Search Button */}
          <View style={{ alignItems: 'flex-start' }}>
            <Button
              title="Search"
              onPress={searchApi}
            />
          </View>
        </View>



      {/* List Of Synagogue Cards */}
      <FlatList
        data={synagogues}
        keyExtractor={(item) => item._id} // Assuming _id is unique
        renderItem={({ item }) => <SynagogueCard synagogue={item} navigation={navigation}/>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default SynagogueSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: 'black',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buttonContainer: {
    margin: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '75%',
    marginBottom: 20,
  },
  searchBarContainer: {
    width: '90%',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    paddingVertical: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 30,
    alignSelf: 'center'
  },
  icon: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  text: {
    marginBottom: 5,
  }
});
