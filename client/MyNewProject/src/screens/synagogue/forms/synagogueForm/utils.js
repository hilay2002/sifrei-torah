import Joi from 'joi';
import axios from 'axios';
import expressApi from '../../../../api/axios';
import ImageResizer from '@bam.tech/react-native-image-resizer';

  
// Joi Validation Schema

export const synagogueSchema = Joi.object({
// Validation for name, city, and street
name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Synagogue name is required',
    'string.min': 'Synagogue name must be at least 2 characters long.',
    'string.max': 'Synagogue name cannot exceed 100 characters.',
}),

city: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Synagogue city is required',
    'string.min': 'Synagogue city must be at least 2 characters long.',
    'string.max': 'Synagogue city cannot exceed 100 characters.',
}),

street: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Synagogue street is required',
    'string.min': 'Synagogue street must be at least 2 characters long.',
    'string.max': 'Synagogue street cannot exceed 100 characters.',
}),

owner: Joi.string().required(),

// Validation for image
image: Joi.string().uri().required().messages({
    'any.required': 'Synagogue image is required.',
    'string.uri': 'The synagogue image URL must be a valid URI if provided.'
}),

time: Joi.object({
    month: Joi.string().allow('').optional(),
    week: Joi.string().allow('').optional()
}).optional().strip(),

// Validation for torahScrolls array
torahScrolls: Joi.array().items(
    Joi.object({
    // Validation for donorName
    donorName: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Donor name is required',
        'string.min': 'Donor name must be at least 2 characters long.',
        'string.max': 'Donor name cannot exceed 100 characters.',
    }),

    // Validation for donorFor array
    donorFor: Joi.array().items(
        Joi.object({
        name: Joi.string().min(2).max(100).required().messages({
            'string.empty': 'The name of the deceased is required',
            'string.min': 'The name of the deceased must be at least 2 characters long.',
            'string.max': 'The name of the deceased cannot exceed 100 characters.',
        }),
        date: Joi.string().optional().allow(''),
        })
    ),

    // Validation for image
    image: Joi.string().uri().required().messages({
        'any.required': 'Image is required.',
        'string.uri': 'The image URL must be a valid URI if provided.'
    })
    })
)
});

// Images

// Images upload and torah scrolls image url update
let updatedTorahScrolls, synagogueImageUrl;
export const uploadImages = async (synagogue) => {
  try{
    const torahScrollResponse = await Promise.allSettled(
      synagogue.torahScrolls.map(async (torahScroll) => {
        const imageUrl = await uploadImage(await resizeImage(torahScroll.image));
        return { ...torahScroll, image: imageUrl };
      })
    );

    updatedTorahScrolls = torahScrollResponse.map(result =>
    result.status === 'fulfilled' && result.value );

    synagogueImageUrl = await uploadImage(await resizeImage(synagogue.image));
  } catch (err){
    console.error(err)
  }
    return { 
      ...synagogue,
      image: synagogueImageUrl,
      torahScrolls: updatedTorahScrolls, 
    };
  };


// Image Upload
const uploadImage = async (imageUri) => {
    try {

        const { signature, timestamp, apiKey, cloudName } = await getSignature();

        const formData = new FormData(); // Prepare the form data for Cloudinary
        formData.append('file', {
        uri: imageUri,
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
        console.error("Upload failed:", error);
    throw error;  // Rethrow the error so the outer try-catch can catch itd
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

// ImageResizing

const resizeImage = async (imageUri) => {

    const maxWidth = 800;
    const maxHeight = 800;
    const compressFormat = 'JPEG';
    const quality = 50;
    const rotation = 0;
    const outputPath = null;

    try {
        const response = await ImageResizer.createResizedImage(
        imageUri,
        maxWidth,
        maxHeight,
        compressFormat,
        quality,
        rotation,
        outputPath
        );
        
        return response.uri; // Return the new image URI for upload
    } catch (err) {
        console.log('Image resizing failed:', err);
        return null; // Handle error by returning null or throwing an error
    }
};

export const removeDonorForItem = (prev, torahScrollIndex, donorForItemIndex) => {
    const updatedTorahScroll = [...prev.torahScrolls];

    updatedTorahScroll[torahScrollIndex].donorFor = updatedTorahScroll[torahScrollIndex]
    .donorFor.filter( (_, indext) => indext !== donorForItemIndex);

    return({
    ...prev,
    torahScrolls: updatedTorahScroll
    })
}

// Last DonorFor cutting function
export const lastDonorForCutting = (torahScrolls) => {
    return torahScrolls.map( torahScroll => {

      const numberOfDonorFor = torahScroll.donorFor.length;
      const indexOfLastDonorForItem = torahScroll.donorFor.length -1;
      const lastDonorForfilled = torahScroll.donorFor[indexOfLastDonorForItem].name.length > 0 || torahScroll.donorFor[indexOfLastDonorForItem].date.length > 0;

        if ( lastDonorForfilled || numberOfDonorFor === 1 ){ // if last donorFor is not empty, leave the donorFor as is
            return torahScroll; 
        }

        return { 
          ...torahScroll,
          donorFor: torahScroll.donorFor.slice(0, -1)
        };              
    });
}
export const updateTorahScrollInput = (field, prev, cleanedValue ) => {
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
        const lastDonorForAllowdInCurrentTorahScroll = currentTorahScroll.donorFor[maxDonorForArrayLength - 1];

        const deletionWasMade = 
                ((currentDonorForFieldIndex || currentDonorForFieldIndex === 0)
                ? currentTorahScrollfield[currentDonorForFieldIndex].name.length
                : currentTorahScrollfield?.length)
                > cleanedValue.length;
                
          if ( torahScrollLastItemIndex === currentTorahScrollIndex && cleanedValue !== ''){ // when the last card in torahScrolls is being edit
            if (!deletionWasMade) {
              if ( torahScrolls.length < maxTorahScrollsArrayLength){ // add card only when the number of card is not more then 100
                  torahScrolls[torahScrolls.length] = { donorName: '', donorFor: [{ name: '', date: '' } ]};
              }
            }
          }else if ( (torahScrollSecondItemFromEnd === currentTorahScrollIndex) && torahScrolls.length > 2){ //when the second card from the end, is being edit
              const isCurrentInputEmpty = cleanedValue.length === 0;

              if (isCurrentInputEmpty){ // when the input is empty
                let isCurrentTorahScrollEmpty;
                if (inputFieldName === 'donorName'){ // when the rest of the inputs are empty as well

                  isCurrentTorahScrollEmpty = 
                  !currentTorahScroll.image && 
                  currentTorahScroll.donorFor.every(ob =>    
                  ob.name.trim() === '' && ob.date === '' );

                }else if (inputFieldName === 'donorFor'){

                  const updatedDonorFor = currentTorahScroll.donorFor.map((item, index) => { // Remove the empty property
                    if (index === currentDonorForFieldIndex) {
                        const { [donorForProperty]: _, ...rest } = item; 
                        return rest;
                    }
                    return item;
                });
                const isDonorForEmpty = updatedDonorFor.every(ob =>  // check if all the rest in donorFor are empty
                  (ob.name?.trim() === '' || ob.name === undefined) && (ob.date === '' || ob.date === undefined));

                  isCurrentTorahScrollEmpty = 
                  (!currentTorahScroll.image && !currentTorahScroll.donorName && isDonorForEmpty);

                }
                if (isCurrentTorahScrollEmpty) { // if the second card form the end, empty. check if the last one empty as well

                  if ( lastTorahScrollCard ){ // if the max torah scroll exist
                    
                    const isTheLastTorahScrollEmpty = // check if he is empty
                    !lastTorahScrollCard.image && 
                    !lastTorahScrollCard.donorName && 
                    lastTorahScrollCard.donorFor.every(ob =>    
                    ob.name.trim() === '' && ob.date === '' );
                    
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
          const lastDonorForIndex = currentTorahScroll.donorFor.length -1;
          const secondDonorForFeildFromTheEndIndex = currentTorahScroll.donorFor.length -2;

          if ( lastDonorForIndex === currentDonorForFieldIndex && cleanedValue !== '') { // when the last donorFor field is being edit
            if (!deletionWasMade){
              if ( currentTorahScroll.donorFor.length < maxDonorForArrayLength){// adding one input only when the donor for array is less than 10
                const lastDonerForArrayIndexPlusOne = currentTorahScroll.donorFor.length;
                currentTorahScroll.donorFor[lastDonerForArrayIndexPlusOne] = { name: '', date: '' };
              }
            }
          } else if (secondDonorForFeildFromTheEndIndex === currentDonorForFieldIndex ){ // when the second input from the end is being edit
              const isCurrentInputEmpty = cleanedValue === '';

              if ( isCurrentInputEmpty ){ // if the second input from the end empty
                const isTheLastDonorForfilled = lastDonorForAllowdInCurrentTorahScroll?.name || lastDonorForAllowdInCurrentTorahScroll?.date;

                if (donorForProperty === 'date'){ // if one of the date properties are empty
                  const nameOfTheDonorFor = !currentTorahScroll.donorFor[currentDonorForFieldIndex].name;

                  if ( nameOfTheDonorFor && !isTheLastDonorForfilled) currentTorahScroll.donorFor.pop(); // check the last donorFor input with the max index allowed, if not exist delete the last input

                } else {
                  const dateOfTheDonorForIsEmpty = !currentTorahScroll.donorFor[currentDonorForFieldIndex].date;
                  if ( dateOfTheDonorForIsEmpty && !isTheLastDonorForfilled ) currentTorahScroll.donorFor.pop(); // check the last donorFor input with the max index allowed, if not exist delete the last input
                }
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