import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

//Months List

const hebrewMonths = [
  { name: 'Nisan', days: 30 },
  { name: 'Iyar', days: 29 },
  { name: 'Sivan', days: 30 },
  { name: 'Tammuz', days: 29 },
  { name: 'Av', days: 30 },
  { name: 'Elul', days: 29 },
  { name: 'Tishrei', days: 30 },
  { name: 'Cheshvan', days: 30 },
  { name: 'Kislev', days: 30 },
  { name: 'Tevet', days: 29 },
  { name: 'Shevat', days: 30 },
  { name: 'Adar I', days: 30 },
  { name: 'Adar II', days: 29 },
];

const MonthAndDayDatePicker = ({ date, handleInputChange, torahScrollIndex, donorForIndex }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1); 

const inputText = date;

  const handleSubmit = () => {
    handleInputChange(`torahScroll_donorFor_${torahScrollIndex}_${donorForIndex}_date`, `${selectedDay} ${hebrewMonths[selectedMonth].name}`)
    setModalVisible(false);
  };

  const handleClear = () => { 
    handleInputChange(`torahScroll_donorFor_${torahScrollIndex}_${donorForIndex}_date`, '')
    setModalVisible(false);
  };

  return (
    <View>
      <TextInput
        placeholder={'Date of death'}
        value={inputText}
        editable={false}
        style={styles.input}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>

          <View
            style={ styles.contentContainer}
          >
            <Text style={ styles.modaleLabel }>Select Date</Text>


            <View 
                style={ styles.pickerContainer }
            >

                <Text style={ styles.pickerLabel }>Month</Text>

                <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                {hebrewMonths.map((month, index) => (
                    <Picker.Item key={index} label={month.name} value={index} />
                ))}
                </Picker>

            </View>


            <View style={styles.pickerContainer}>

                <Text style={ styles.pickerLabel }>Day</Text>

                <Picker
                selectedValue={selectedDay}
                onValueChange={(itemValue) => setSelectedDay(itemValue)}
                >
                {Array.from(
                    { length: hebrewMonths[selectedMonth].days },
                    (_, i) => i + 1
                ).map((day) => (
                    <Picker.Item key={day} label={`${day}`} value={day} />
                ))}
                </Picker>

            </View>


            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#3399FF', // Blue background for submit
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%',
    color: 'white',
  },
  clearButton: {
    borderColor: '#3399FF',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%',
  },
  submitButtonText: {
    color: 'white', 
    fontSize: 16,
    textAlign: 'center',
  },
  
  clearButtonText: {
    color: '#3399FF',
    fontSize: 16,
    textAlign: 'center',
  },
  modalBackground: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  contentContainer: {
    backgroundColor: 'white',
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modaleLabel: {
    fontSize: 20,
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 17,
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    width: 250,
    height: 220,    
  }

});

export default MonthAndDayDatePicker;
