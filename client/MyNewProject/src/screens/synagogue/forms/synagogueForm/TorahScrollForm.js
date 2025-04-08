import { Image, TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import ImgPicker from '../../../../components/ImgPicker'
import MonthAndDayDatePicker from '../../../../components/MonthAndDayDatePicker'

const TorahScrollForm = ({ handleInputChange, torahScrolls, handleRemoveTorahScroll, handleRemoveDonorForItem }) => {

    return (
    <View>
    {/* Torah Scrolls Container */}
      {torahScrolls.map((torahScroll, torahScrollIndex) => (
        <View key={torahScrollIndex} style={styles.rowContainer}>
        
            {/* Card and minus sign container */}
            <View style={styles.torahScrollContainer}>
            
                {/* Number sign */}
                <Text style={styles.cardNumber}>#{torahScrollIndex > 1 ? `${torahScrollIndex + 1} (optional)` : `${torahScrollIndex + 1}`}</Text>

                {/* Donor name input */}
                <TextInput
                placeholder="Donor name"
                value={torahScroll.donorName}
                onChangeText={(text) => handleInputChange(`torahScroll_donorName_${torahScrollIndex}`, text)}
                style={styles.input}
                />

                {/* Running over each donorFor item */}
                {torahScroll.donorFor.map((_, donorForIndex) => (
                    <View style={styles.donorForContainer} key={donorForIndex}>
                        <View style={styles.inputRow}>
                            <View style={{width: '85%'}}>

                                {/* Donor for input */}
                                <TextInput
                                    placeholder={`#${donorForIndex >= 1 ? `${donorForIndex + 1} (optional)` : donorForIndex + 1}  |  For the elevation of the soul of`}
                                    value={torahScroll.donorFor[donorForIndex].name}
                                    onChangeText={(text) => handleInputChange(`torahScroll_donorFor_${torahScrollIndex}_${donorForIndex}_name`, text)}
                                    style={styles.donorForInput}
                                />

                                {/* Date Picker */}
                                <MonthAndDayDatePicker date={torahScroll.donorFor[donorForIndex].date} handleInputChange={handleInputChange} torahScrollIndex={torahScrollIndex} donorForIndex={donorForIndex}/>

                            </View>

                            {/* Minus button for donorFor input */}
                            {donorForIndex > 0 && (
                                <TouchableOpacity onPress={() => handleRemoveDonorForItem(torahScrollIndex, donorForIndex)} style={styles.minusButtonDonorFor}>
                                    <Text style={styles.minusTextDonorFor}>-</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                    </View>
                ))}

                {/* Image picker */}
                <ImgPicker handleInputChange= {handleInputChange} text={'Torah Sctoll Image'} torahScrollIndex={torahScrollIndex}/>

                {/* Image View */}
                {torahScroll.image && <Image source={{ uri: torahScroll.image }} style={styles.imagePreview} />}
            </View>

          {/* Minus button for Torah Scroll */}
          {torahScrollIndex > 1 && (
            <TouchableOpacity onPress={() => handleRemoveTorahScroll(torahScrollIndex)} style={styles.minusButton}>
              <Text style={styles.minusText}>-</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  )
}

export default TorahScrollForm

const styles = StyleSheet.create({
    inputRow: {  
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    torahScrollContainer: {
        flex: 1, 
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        width: '75%',
    },

    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '85%',
        marginBottom: 15,
    },
    donorForInput: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
        marginBottom: 15,
    },

    cardNumber: {
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#888',
    },

    minusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10, 
    },

    minusText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#555',
    },

    minusButtonDonorFor: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },

    minusTextDonorFor: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
    },

    imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 5,
    },
    donorForContainer: {
        marginTop: 25,
        marginBottom: 25,
    }
})
