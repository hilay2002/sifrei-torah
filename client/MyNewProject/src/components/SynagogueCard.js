import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const SynagogueCard = ({ synagogue, navigation }) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Synagogue', { synagogue })}
      >
        <Image source={{ uri: synagogue.image }} style={styles.image} />
        <Text style={styles.name}>{synagogue.name}</Text>
        <Text style={styles.address}>
          {synagogue.city}, {synagogue.street}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SynagogueCard;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  card: {
    width: '80%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover', // Ensures the image fills the space without distortion
  },
  name: {
    fontSize: 16,
    color: '#3399FF',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#A9A9A9', // Light gray
  },
});
