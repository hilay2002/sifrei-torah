import React, { useEffect, useState, useContext } from 'react';
import { Image, ScrollView, Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import expressApi from '../../../../api/axios';
import TorahScrollForm from './TorahScrollForm';
import ImgPicker from '../../../../components/ImgPicker';
import MonthAndWeekDatePicker from '../../../../components/MonthAndWeekDatePicker';
import { AuthContext } from '../../../../components/AuthProvider';

import { synagogueSchema, uploadImages, removeDonorForItem, lastDonorForCutting, updateTorahScrollInput } from './utils';



const SynagogueForm = () => {

  const { user } = useContext(AuthContext);

  // Inputs State
  const [synagogueInputs, setSynagogueInputs] = useState({
        name: '',
        city: '',
        street: '',
        time: { month: '', week: '' },
        torahScrolls: [
        {
          donorName: '' ,
          donorFor: [{ name: '', date: '' }],
        },
        {
          donorName: '' ,
          donorFor: [{ name: '', date: '' }],
        }
      ],
  });
  console.log(synagogueInputs)
  const [effectsAfterSub, seteffectAfterSub] = useState(0);

  // Effect after submitting
  useEffect(() => {
    if (effectsAfterSub !== 0) {

      const validateAndUpload = async () => {
        try {


          // Validate the form data
          const { error } = synagogueSchema.validate(synagogueInputs, { abortEarly: true });
          if (error) {
            throw error; // Throw to catch and show an alert
          }

          
          // Updated Synagogue
          const updatedSynagogue = await uploadImages(synagogueInputs);


          // Removing Empty Fileds


          // Remove empty `date` fields inside donorFor
          updatedSynagogue.torahScrolls.forEach((scroll) => {
            scroll.donorFor.forEach((donor) => {
              if (donor.date === '') {
                delete donor.date;
              }
            });
          });
        
          // Remove optional `time` if it's empty or has '0' as values
          if (updatedSynagogue.time) {
            if (updatedSynagogue.time.month === '' || updatedSynagogue.time.month === '0') {
              delete updatedSynagogue.time.month;
            }
            if (updatedSynagogue.time.week === '' || updatedSynagogue.time.week === '0') {
              delete updatedSynagogue.time.week;
            }
        
            // If both month and week are removed, delete the entire time object
            if (!updatedSynagogue.time.month && !updatedSynagogue.time.week) {
              delete updatedSynagogue.time;
            }
          }
        
          // Remove optional `image` if it's empty
          if (updatedSynagogue.image === '') {
            delete updatedSynagogue.image;
          }
        
        await expressApi.post('/synagogue', updatedSynagogue);
          

        } catch (error) {
          if (error.isJoi) {
            console.log(error.details.map(err => err.message).join('\n'));
            Alert.alert('Validation Error', error.details.map(err => err.message).join('\n'));
          } else {
            console.error(error);
            Alert.alert('Error', 'Something went wrong.');
          }
        }
      };
      validateAndUpload();
    }
  }, [effectsAfterSub]); 

  // Remove Donor For Input when minus button clicked
  const handleRemoveDonorForItem = (torahScrollIndex, donorForItemIndex) => {
    setSynagogueInputs( prev => { 
      return removeDonorForItem(prev, torahScrollIndex, donorForItemIndex)
    });
  }

  // Remove torah scroll card when minus butonn clicked
  const handleRemoveTorahScroll = (torahScrollIndex) => {
    setSynagogueInputs(prev => ({
        ...prev, 
        torahScrolls: prev.torahScrolls.filter((_, index) => index !== torahScrollIndex)
    }));
};

  // Handle submit function
  const handleSubmit = async () => {

    //deleate the last unfilled, fields and card
    setSynagogueInputs( prev => {
      let updatedTorahScrolls = [...prev.torahScrolls];

      const lastTorahScroll = updatedTorahScrolls[updatedTorahScrolls.length -1]
      const numberOfCards = updatedTorahScrolls.length;

      const isTheLastTorahScrollEmpty = // check if he is empty
      !lastTorahScroll.image && 
      !lastTorahScroll.donorName && 
      lastTorahScroll.donorFor.every(ob =>    
      ob.name.trim() === '' && ob.date === '' );

      if ( !isTheLastTorahScrollEmpty || numberOfCards === 2 ) {
        return { ...prev, owner: user.uid, torahScrolls: lastDonorForCutting(updatedTorahScrolls) };
      }
      updatedTorahScrolls.pop();
      return { ...prev, owner: user.uid, torahScrolls: lastDonorForCutting(updatedTorahScrolls) };
    });
    seteffectAfterSub( prev => prev + 1);
  };
  
  
  // Handle input change function
  const handleInputChange = (field, value) => {
    setSynagogueInputs((prev) => {
      let cleanedValue = value;

      // Torah Scroll Inputs Handler
      if(field.startsWith('torahScroll')){ //when the field is one of the input of torahScroll card

        return updateTorahScrollInput(field, prev, cleanedValue);
      }

      // Synagogue Inputs Handler
      else {                      // set the new value of one of the synagogue inputs
        if (field === 'time'){      // if the input is date
          console.log('x')
          const [month, week] = cleanedValue.split('_');
          return {...prev, [field]: { month: month, week: week } };
        }
        return {...prev, [field]: cleanedValue };
        }
    });
  };
  return (
    <ScrollView style={styles.mainContainer}>

      {/* Synagogue Name */}
      <TextInput
        placeholder="Synagogue Name"
        value={synagogueInputs.name}
        onChangeText={(text) => handleInputChange('name', text)}
        style={styles.input}
      />

      {/* Synagogue City */}
      <TextInput
        placeholder="City"
        value={synagogueInputs.city}
        onChangeText={(text) => handleInputChange('city', text)}
        style={styles.input}
      />

      {/* Synagogue Street */}
      <TextInput
        placeholder="Street"
        value={synagogueInputs.street}
        onChangeText={(text) => handleInputChange('street', text)}
        style={styles.input}
      />

      <ImgPicker text={'Synagogue Image'} handleInputChange={handleInputChange }/>

      {synagogueInputs.image && <Image source={{ uri: synagogueInputs.image }} style={styles.imagePreview} />}

      {/* Torah Scroll Component */}
      <TorahScrollForm
      torahScrolls={synagogueInputs.torahScrolls} 
      handleInputChange={handleInputChange}
      handleRemoveTorahScroll={handleRemoveTorahScroll}
      handleRemoveDonorForItem={handleRemoveDonorForItem}
      />

    <View style={styles.optionalQuestion}>
      <Text style={styles.label}>
        Optional: When a new Torah scroll is donated, for how long would you like to read only from it?
      </Text>
      <MonthAndWeekDatePicker time={synagogueInputs.time} handleInputChange={handleInputChange}/>
    </View>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#3399FF',
    height: 40,
    borderRadius: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButtonContainer: {
    width: '85%',
    alignSelf: 'center',
  },
  mainContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
},
label: {
  fontSize: 16,
  color: '#333',
  marginBottom: 8,
},
optionalQuestion: {
  borderWidth: 0.3,
  borderColor: 'gray',
  borderRadius: 10,
  padding: 15,
  width: '90%',
  alignSelf: 'center',
  marginBottom: 20,
  marginTop: 10,
},
});

export default SynagogueForm;
