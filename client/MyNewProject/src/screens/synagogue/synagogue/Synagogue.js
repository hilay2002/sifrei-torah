import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from 'react-native';

const Synagogue = ({ route }) => {
  const { synagogue } = route.params; 

  return (
    <ScrollView style={styles.container}>
      {/* Display Synagogue Name and Address */}
      <Text style={styles.name}>{synagogue.name}</Text>
      <Text style={styles.address}>
        {synagogue.city}, {synagogue.street}
      </Text>

      {/* Display Torah Scroll Images in a Grid */}
      <Text style={styles.sectionTitle}>Torah Scrolls</Text>
      <FlatList
        data={synagogue.torahScrolls}
        keyExtractor={(item) => item._id}
        numColumns={3}
        scrollEnabled={false} // Disables scrolling inside FlatList to prevent conflict
        renderItem={({ item }) => (
          <View style={styles.scrollContainer}>
            <Image source={{ uri: item.image }} style={styles.scrollImage} />
          </View>
        )}
      />
    </ScrollView>
  );
};

export default Synagogue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  address: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    margin: 8, 
    alignItems: 'center',
  },
  scrollImage: {
    width: 120, 
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
