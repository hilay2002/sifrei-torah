import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MonthAndWeekDatePicker = ({ time, handleInputChange}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);

// Input Text
const month = time.month;
const week = time.week;

const monthText = (month > 0) ? `${month} ${month > 1 ? 'months' : 'month'}` : '';
const weekText = (week > 0) ? `${week} ${week > 1 ? 'weeks' : 'week'}` : '';

const inputText = [monthText, weekText].filter(Boolean).join(' and ');


// Submit And Clear Functions
  const handleSubmit = () => {
    handleInputChange('time', `${selectedMonth}_${selectedWeek}`);
    setModalVisible(false);
  };

  const handleClear = () => {
    handleInputChange('time', '');
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          placeholder={'Select Amount of time'}
          value={inputText}
          editable={false}
          style={styles.input}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.contentContainer}>
            <Text style={styles.modalLabel}>Select Date</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Month</Text>
              <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
              <Picker.Item label="0" value="0" />
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Picker.Item key={month} label={`${month}`} value={month} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Week</Text>
              <Picker selectedValue={selectedWeek} onValueChange={setSelectedWeek}>
              <Picker.Item label="0" value="0" />
                {Array.from({ length: 4 }, (_, i) => i + 1).map((week) => (
                  <Picker.Item key={week} label={`${week}`} value={week} />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
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
    width: '85%',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    backgroundColor: 'white',
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalLabel: {
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
  },
});

export default MonthAndWeekDatePicker;
