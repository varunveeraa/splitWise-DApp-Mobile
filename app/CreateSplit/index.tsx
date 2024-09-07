import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Button, Alert } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

export default function NewExpense() {
  const router = useRouter();

  const [payees, setPayees] = useState([
    { name: 'Suraj', address: '0x950E0c3E1cB69F6D28177116fbaF9c6e25F03101', selected: true },
    { name: 'Dhesiek', address: '0xf5A1966aE230700F5b73C3f0ca9054550760f927', selected: false }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAddress, setNewPayeeAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [noteModalVisible, setNoteModalVisible] = useState(false);

  const togglePayee = (index: number) => {
    setPayees(
      payees.map((payee, i) =>
        i === index ? { ...payee, selected: !payee.selected } : payee
      )
    );
  };

  const addPayee = () => {
    if (newPayeeName && newPayeeAddress) {
      setPayees([
        ...payees,
        { name: newPayeeName, address: newPayeeAddress, selected: false },
      ]);
      setNewPayeeName('');
      setNewPayeeAddress('');
      setModalVisible(false);
    } else {
      Alert.alert('Please enter both name and address for the payee.');
    }
  };

  const handleAddExpense = () => {
    const selectedPayees = payees.filter((payee) => payee.selected);
  
    if (!description || !amount || !selectedDate) {
      Alert.alert('Please fill out all fields.');
      return;
    }
  
    const expenseData = {
      amount,
      description,
      notes,
      date: formatDate(selectedDate),
      mediaSource: "drive.com" 
    };
  
    router.push({
      pathname: '/CreatSplitsPage',
      params: { expenseData: JSON.stringify(expenseData) },
    });
  };
  

  const onChangeDate = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date | null) => {
    return date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.newExpenseTitle}>New Expense</Text>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.selectPayeesLabel}>Select your payees</Text>

        <View style={styles.payeeContainer}>
          {payees.map((payee, index) => (
            <TouchableOpacity
              key={index}
              style={styles.payee}
              onPress={() => togglePayee(index)}
            >
              <FontAwesome
                name={payee.selected ? 'check-circle' : 'circle-thin'}
                size={20}
                color="white"
              />
              <View style={styles.payeeInfo}>
                <Text style={styles.payeeName}>{payee.name}</Text>
                <Text style={styles.payeeAddress}>{payee.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.smallButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.smallButtonText}>Add New Payee</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Payee</Text>

              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={18} color="white" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Payee Name"
                  placeholderTextColor="grey"
                  value={newPayeeName}
                  onChangeText={setNewPayeeName}
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome name="address-card" size={18} color="white" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Payee Address"
                  placeholderTextColor="grey"
                  value={newPayeeAddress}
                  onChangeText={setNewPayeeAddress}
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addPayee}>
                <Text style={styles.buttonText}>Add Payee</Text>
              </TouchableOpacity>

              <Button title="Cancel" color="#ff5c5c" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="format-letter-case" size={18} color="white" />
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            placeholderTextColor="grey"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="dollar" size={18} color="white" />
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="grey"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.infoText}>
          Paid by <Text style={styles.boldText}>you</Text> and split{' '}
          <Text style={styles.boldText}>equally</Text>
        </Text>

        <View style={styles.iconContainer}>
          <View style={styles.iconWithLabel}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <FontAwesome name="calendar" size={30} color={selectedDate ? 'green' : 'white'} />
            </TouchableOpacity>

            {selectedDate && (
              <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
            )}
          </View>

          <FontAwesome name="image" size={30} color="white" />

          <View style={styles.iconWithLabel}>
            <TouchableOpacity onPress={() => setNoteModalVisible(true)}>
              <MaterialCommunityIcons
                name="note-text"
                size={30}
                color={notes ? 'green' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Modal visible={noteModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Notes</Text>

              <TextInput
                style={styles.notesInput}
                placeholder="Enter notes"
                placeholderTextColor="grey"
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Save Notes</Text>
              </TouchableOpacity>

              <Button title="Cancel" color="#ff5c5c" onPress={() => setNoteModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e', 
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  newExpenseTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  selectPayeesLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  input: {
    flex: 1,
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 15,
  },
  payeeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  payee: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  payeeInfo: {
    marginLeft: 10,
  },
  payeeName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  payeeAddress: {
    fontSize: 12,
    color: 'grey',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 30,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  iconWithLabel: {
    alignItems: 'center',
  },
  selectedDateText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007aff',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  smallButton: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 25,
    alignSelf: 'center',
  },
  smallButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    backgroundColor: '#2c2c2e',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  notesInput: {
    width: '100%',
    minHeight: 120,
    backgroundColor: '#3a3a3c',
    color: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  boldText: {
    fontWeight: '800',
  },
});
