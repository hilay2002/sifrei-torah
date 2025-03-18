import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const ImgPicker = ({text, handleInputChange, torahScrollIndex }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const clearImg = () => {
    if (torahScrollIndex || torahScrollIndex === 0){
      handleInputChange(`torahScroll_imageUri_${torahScrollIndex}`, '');
      } else {
        handleInputChange(`image`, '');
    }
    setModalVisible(false);
  }

  const handlePick = async (fromCamera) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };

    const picker = fromCamera ? launchCamera : launchImageLibrary;
    
    try {
      const response = await picker(options);
      if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        if (torahScrollIndex || torahScrollIndex === 0){
        handleInputChange(`torahScroll_imageUri_${torahScrollIndex}`, selectedImageUri);
        } else {
          handleInputChange(`image`, selectedImageUri);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>{text}</Text>
      </TouchableOpacity>
      
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => handlePick(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handlePick(true)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={ clearImg } style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    backgroundColor: '#3399FF',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    marginVertical: 10,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#3399FF',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#3399FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImgPicker;
