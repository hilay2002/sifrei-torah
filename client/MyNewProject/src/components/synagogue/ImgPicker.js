import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';


const ImgPicker = ({ handleInputChange, torahScrollIndex }) => {
  
  // Function to handle image selection from camera or gallery
  const handlePick = async (fromCamera) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };
    
    const picker = fromCamera ? launchCamera : launchImageLibrary;
  
    try {
      const response = await picker(options);
  
      // If the user selects an image successfully, update the state with the image URI
      if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        handleInputChange(`torahScroll_imageUri_${torahScrollIndex}`, selectedImageUri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <View>
      {/* Select Photo button */}
      <TouchableOpacity onPress={() => handlePick(false)} style={styles.imgPickerButton}>
        <Text style={styles.imgPickerButtonText}>Select Photo</Text>
      </TouchableOpacity>

      {/* Take Photo button */}
      <TouchableOpacity onPress={() => handlePick(true)} style={styles.imgPickerButton}>
        <Text style={styles.imgPickerButtonText}>Take Photo</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  imgPickerButton: {
    backgroundColor: '#3399FF',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  imgPickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 

export default ImgPicker;
