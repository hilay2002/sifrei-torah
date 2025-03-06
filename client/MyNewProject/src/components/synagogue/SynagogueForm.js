import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import expressApi from '../../api/axios';
import axios from 'axios';
import Joi from 'joi';
import TorahScrollForm from './TorahScrollForm';

const SynagogueForm = () => {

  // Inputs State
  const [synagogueInputs, setSynagogueInputs] = useState({
        name: '',
        city: '',
        street: '',
        torahScrolls: [
        {
          donorName: '' ,
          donorFor: [{ name: '' }],
        },
        {
          donorName: '' ,
          donorFor: [{ name: '' }],
        }
      ],
  });
  const [effectsAfterSub, seteffectAfterSub] = useState(0);

  // Effect after submitting

  useEffect(() => {
    if (effectsAfterSub !== 0) {

      const validateAndUpload = async () => {
        try {
          // Validate the form data
          const { error, value } = synagogueSchema.validate(synagogueInputs, { abortEarly: true });
      
          if (error) {
            throw error; // Throw to catch and show an alert
          }
      
          // Image upload and torah scrolls update
          const imageUploadAndTorahScrollsUpdate = async () => {
            const response = await Promise.allSettled(
              value.torahScrolls.map(async (torahScroll) => {
                const imageUrl = await uploadImage(torahScroll.image);
                return { ...torahScroll, image: imageUrl };
              })
            );
      
            const updatedTorahScrolls = response.map(result =>
              result.status === 'fulfilled' ? result.value : { ...result.reason }
            );
      
            setSynagogueInputs((prev) => ({
              ...prev,
              torahScrolls: updatedTorahScrolls,
            }));
          };
      
          imageUploadAndTorahScrollsUpdate();
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
  

  // Joi Validation Schema

const synagogueSchema = Joi.object({
  // Validation for name, city, and street
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'synagogue name is required',
    'string.min': 'synagogue name must be at least 2 characters long.',
    'string.max': 'synagogue name cannot exceed 100 characters.',
  }),

  city: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'synagogue city is required',
    'string.min': 'synagogue city must be at least 2 character long.',
    'string.max': 'synagogue city cannot exceed 100 characters.',
  }),

  street: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'synagogue street is required',
    'string.min': 'synagogue street must be at least 2 character long.',
    'string.max': 'synagogue street cannot exceed 100 characters.',
  }),

  // Validation for torahScrolls array
  torahScrolls: Joi.array().items(
    Joi.object({

      // Validation for donorName
      donorName: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Donor name is required',
        'string.min': 'Donor name must be at least 2 character long.',
        'string.max': 'Donor name cannot exceed 100 characters.',
      }),

      // Validation for donorFor array
      donorFor: Joi.array().items(
        Joi.object({
          name: Joi.string().min(2).max(100).required().messages({
            'string.empty': 'The name of the deceased, is required',
            'string.min': 'The name of the deceased, must be at least 2 character long.',
            'string.max': 'The name of the deceased, cannot exceed 100 characters.',
          })
        })
      ),

      // Validation for image (optional)
      image: Joi.string().uri().required().messages({
        'any.required': 'Image is required.',
        'string.uri': 'The image URL must be a valid URI if provided.'
      })
    })
  )
});


  // Image Upload
  const uploadImage = async (imageUri) => {
    try {
      console.log('image', imageUri)
      const imageUriFormatted = imageUri.replace("file://", ""); 
      const { signature, timestamp, apiKey, cloudName } = await getSignature();

      const formData = new FormData(); // Prepare the form data for Cloudinary
      formData.append('file', {
      uri: imageUriFormatted,
      name: 'upload.jpg',
      type: 'image/jpeg',
      });
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      formData.append('signature', signature);
      formData.append('folder', 'torah-scrolls');
  
      const uploadResponse = await axios.post( // Send image to Cloudinary
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      console.log('Upload success:', uploadResponse.data.secure_url); // Success and error handling
      return uploadResponse.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  

  // Signature Request
  const getSignature = async () => {
    try {
      const response = await expressApi.post('get-signature');
      return response.data;
    } catch (error) {
      console.error('Error getting signature:', error);
    }
  };

  // Remove Donor For Input when minus button clicked
  const handleRemoveDonorForItem = (torahScrollIndex, donorForItemIndex) => {
    setSynagogueInputs( prev => { 
      const updatedTorahScroll = [...prev.torahScrolls];

      updatedTorahScroll[torahScrollIndex].donorFor = updatedTorahScroll[torahScrollIndex]
      .donorFor.filter( (_, indext) => indext !== donorForItemIndex);

      return({
      ...prev,
      torahScrolls: updatedTorahScroll
    })
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
        const lastCardNotEmpty = (lastTorahScroll.donorName.length > 0 || lastTorahScroll.donorFor[0].name.length > 0) || lastTorahScroll.image;

        // Last DonorFor cutting function
        const lastDonorForCutting = (torahScrolls) =>{
          return torahScrolls.map( torahScroll => {

            const numberOfDonorFor = torahScroll.donorFor.length;
            const indexOfLastDonorForItem = torahScroll.donorFor.length -1;
            const lastDonorForNotEmpty = torahScroll.donorFor[indexOfLastDonorForItem].name.length > 0;

              if ( lastDonorForNotEmpty || numberOfDonorFor === 1){ // if last donorFor is not empty, leave the donorFor as is
                  return torahScroll; 
              }

              return { 
                ...torahScroll,
                donorFor: torahScroll.donorFor.slice(0, -1)
              };              
          });
        }

        if (lastCardNotEmpty || numberOfCards === 2) {
          return { ...prev, torahScrolls: lastDonorForCutting(updatedTorahScrolls) };
        }
        updatedTorahScrolls.pop();
        return { ...prev, torahScrolls: lastDonorForCutting(updatedTorahScrolls) };
      });
      seteffectAfterSub( prev => prev + 1);
  };
  
  
  // Handle input change function
  const handleInputChange = (field, text) => {

    setSynagogueInputs((prev) => {
      let cleanedValue = text;

      // Torah Scroll Inputs Handler
      if(field.startsWith('torahScroll')){ //when the field is one of the input of torahScroll card

        const inputFieldName = field.split('_')[1];
        const currentTorahScrollIndex = Number(field.split('_')[2]);
        const currentDonorForFieldIndex = Number(field.split('_')[3]);
        const donorForProperty = field.split('_')[4];

        const torahScrolls = [...prev.torahScrolls];
        const maxDonorForArrayLength = 5;
        const maxTorahScrollsArrayLength = 5;

        const torahScrollLastItemIndex = torahScrolls.length -1;
        const torahScrollSecondItemFromEnd = torahScrolls.length -2;
        const currentTorahScroll = torahScrolls[currentTorahScrollIndex];
        const currentTorahScrollfield = currentTorahScroll[inputFieldName];
        const lastTorahScrollCard = torahScrolls[maxTorahScrollsArrayLength - 1];
        const lastDonorForInCurrentTorahScrollAllowed = currentTorahScroll.donorFor[maxDonorForArrayLength - 1];
        const deletionWasMade = ((currentDonorForFieldIndex || currentDonorForFieldIndex === 0)
                ? currentTorahScrollfield[currentDonorForFieldIndex][donorForProperty].length
                : currentTorahScrollfield?.length)
                > cleanedValue.length;

          if ( torahScrollLastItemIndex === currentTorahScrollIndex ){ // when the last card in torahScrolls is being edit
            if (!deletionWasMade) {
              if ( torahScrolls.length < maxTorahScrollsArrayLength){ // add card only when the number of card is not more then 100
                  torahScrolls[torahScrolls.length] = { donorName: '', donorFor: [{ name: ''}]};
              }
            }
          }else if ( (torahScrollSecondItemFromEnd === currentTorahScrollIndex) && torahScrolls.length > 2){ //when the second card from the end, is being edit
              const isCurrentInputEmpty = cleanedValue.length === 0;
              if (isCurrentInputEmpty){ // when the input is empty
                let isCurrentTorahScrollEmpty;
                if (inputFieldName === 'donorName'){ // when the rest of the inputs are empty as well

                  isCurrentTorahScrollEmpty = currentTorahScroll.donorFor
                  .every(ob => ob.name.trim() === '') && !currentTorahScroll.image; 
                }else if (inputFieldName === 'donorFor'){

                  const isDonorForEmpty = currentTorahScroll.donorFor
                  .filter( (_,index) => index !== currentDonorForFieldIndex) 
                  .every(ob => ob.name.trim() === '')                        //////////
                  isCurrentTorahScrollEmpty = (currentTorahScroll.donorName === '' && isDonorForEmpty) && !currentTorahScroll.image;
                }
                if (isCurrentTorahScrollEmpty) { // if the second card form the end, empty. check if the last one empty as well
                  if ( lastTorahScrollCard ){ // if the max torah scroll exist
                    const isTheLastTorahScrollEmpty = // check if he is empty
                      lastTorahScrollCard.donorFor
                      .every(ob => ob.name.trim() === '') &&
                      (lastTorahScrollCard.donorName === '' && !lastTorahScrollCard.image);
                    
                    if (isTheLastTorahScrollEmpty) torahScrolls.pop();;

                  }
                  else torahScrolls.pop();
                }
                   
              }
          }
        
        if (inputFieldName === 'donorName') { // when current field is donorName
          currentTorahScroll.donorName = cleanedValue;
        }
        else if (inputFieldName === 'donorFor'){ // when current field is one of the donorFor inputs
          const lastDonorFor = currentTorahScroll.donorFor.length -1;
          const secondDonorForFeildFromTheEndIndex = currentTorahScroll.donorFor.length -2;
          if ( lastDonorFor === currentDonorForFieldIndex ) { // when the last donorFor field is being edit
            if (!deletionWasMade){
              if ( currentTorahScroll.donorFor.length < maxDonorForArrayLength){// adding one input only when the donor for array is less than 10
                const lastDonerForArrayIndexPlusOne = currentTorahScroll.donorFor.length;
                currentTorahScroll.donorFor[lastDonerForArrayIndexPlusOne] = {name: ''};
              }
            }
          }else if (secondDonorForFeildFromTheEndIndex === currentDonorForFieldIndex ){ // when the second input from the end is being edit
            const isCurrentInputEmpty = cleanedValue === '';
            if ( isCurrentInputEmpty ){ // if the second input from the end empty
              if ( !lastDonorForInCurrentTorahScrollAllowed?.name ) currentTorahScroll.donorFor.pop(); // check the last donorFor input with the max index allowed, if not exist delete the last input
            }
          }
          currentTorahScroll.donorFor[currentDonorForFieldIndex][donorForProperty] = cleanedValue; // assign the new value to the state
        }    
        else if (inputFieldName === 'imageUri'){  /// change it to else if there is not other inputs to torah scroll
          currentTorahScroll.image = cleanedValue; // adding the selected image uri to his card
        }
        return { // set the new value of donorFor array to the state
          ...prev,
          torahScrolls: torahScrolls
        };
      }
      // Synagogue Inputs Handler
      else return { ...prev, [field]: cleanedValue }; // set the new value of one of the synagogue inputs
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

      {/* Torah Scroll Component */}
      <TorahScrollForm
      torahScrolls={synagogueInputs.torahScrolls} 
      handleInputChange={handleInputChange}
      handleRemoveTorahScroll={handleRemoveTorahScroll}
      handleRemoveDonorForItem={handleRemoveDonorForItem}
      />

      {/* Minus Button */}
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
    width: '80%',
    alignSelf: 'center',
    alignItems: "flex-start",
  },
  mainContainer: {
    padding: 10,
  },
});

export default SynagogueForm;
