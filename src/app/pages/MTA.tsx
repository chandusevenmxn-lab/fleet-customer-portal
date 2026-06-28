import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function MTA() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [pickerError, setPickerError] = useState('');
  const [addReg, setAddReg] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [removeReg, setRemoveReg] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState('');

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState({
    day: new Date().getDate().toString().padStart(2, '0'),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    year: new Date().getFullYear().toString()
  });

  const handleAdd = () => {
    if (!addReg) {
      setErrorMessage('Warning: Please enter the Registration Number to add a vehicle.');
      return;
    }
    if (!effectiveFrom) {
      setErrorMessage('Warning: Please select an Effective Date.');
      return;
    }
    setErrorMessage('');
    setResultType('Added');
    setShowResult(true);
  };

  const handleRemove = () => {
    if (!removeReg) {
      setErrorMessage('Warning: Please enter the Registration Number to remove a vehicle.');
      return;
    }
    setErrorMessage('');
    setResultType('Removed');
    setShowResult(true);
  };

  const confirmDate = () => {
    const selectedDate = new Date(`${tempDate.year}-${tempDate.month}-${tempDate.day}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    if (selectedDate > today) {
      setPickerError("Future dates are not allowed.");
      return;
    }

    setPickerError('');
    setEffectiveFrom(`${tempDate.year}-${tempDate.month}-${tempDate.day}`);
    setShowDatePicker(false);
    if (errorMessage) setErrorMessage('');
  };

  const openDatePicker = () => {
    setPickerError('');
    setShowDatePicker(true);
  };

  if (showResult) {
    return (
      <View style={styles.resultContainer}>
        <Stack.Screen options={{ title: "Adjustment Success" }} />
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>MTA Processed!</Text>
          <Text style={styles.resultText}>Vehicle <Text style={styles.bold}>{resultType === 'Added' ? addReg.toUpperCase() : removeReg.toUpperCase()}</Text> has been successfully {resultType.toLowerCase()} from the policy.</Text>
          <TouchableOpacity style={styles.submitButton} onPress={() => { setShowResult(false); setAddReg(''); setRemoveReg(''); setEffectiveFrom(''); }}>
            <Text style={styles.submitText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Mid Term Adjustment", headerTintColor: '#2e7d32' }} />

      <View style={styles.form}>
        {errorMessage ? (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{errorMessage}</Text>
          </View>
        ) : null}

        <Text style={styles.infoText}>Use this form to add or remove vehicles from your active policy.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Vehicle <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Registration Number *"
            placeholderTextColor="#999"
            value={addReg}
            onChangeText={(text) => {
              setAddReg(text);
              if (errorMessage) setErrorMessage('');
            }}
          />
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateInputText, !effectiveFrom && { color: '#999' }]}>
              {effectiveFrom || "Effective From (Date) *"}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addText}>Submit Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remove Vehicle <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Existing Registration Number *"
            placeholderTextColor="#999"
            value={removeReg}
            onChangeText={(text) => {
              setRemoveReg(text);
              if (errorMessage) setErrorMessage('');
            }}
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#c62828' }]} onPress={handleRemove}>
            <Text style={styles.addText}>Submit Remove Vehicle</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Effective Date</Text>

            {pickerError ? (
              <View style={styles.pickerErrorContainer}>
                <Text style={styles.pickerErrorText}>{pickerError}</Text>
              </View>
            ) : null}

            <View style={styles.pickerSelectors}>
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Day</Text>
                <TextInput
                  style={styles.pickerInput}
                  value={tempDate.day}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(val) => {
                    setTempDate({...tempDate, day: val});
                    setPickerError('');
                  }}
                />
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Month</Text>
                <TextInput
                  style={styles.pickerInput}
                  value={tempDate.month}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(val) => {
                    setTempDate({...tempDate, month: val});
                    setPickerError('');
                  }}
                />
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Year</Text>
                <TextInput
                  style={styles.pickerInput}
                  value={tempDate.year}
                  keyboardType="numeric"
                  maxLength={4}
                  onChangeText={(val) => {
                    setTempDate({...tempDate, year: val});
                    setPickerError('');
                  }}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmDate}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  form: { padding: 20 },
  required: { color: 'red' },
  warningContainer: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffb74d',
  },
  warningText: {
    color: '#e65100',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoText: { fontSize: 14, color: '#666', marginBottom: 25, fontStyle: 'italic' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  hr: { height: 1, backgroundColor: '#ddd', marginVertical: 20 },
  backButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  backText: { color: '#666', fontSize: 16 },
  resultContainer: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  resultCard: { backgroundColor: '#fff', padding: 25, borderRadius: 15, alignItems: 'center', elevation: 3 },
  resultHeader: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 15 },
  resultText: { textAlign: 'center', fontSize: 16, color: '#444', marginBottom: 25, lineHeight: 22 },
  bold: { fontWeight: 'bold', color: '#1976d2' },
  submitButton: { backgroundColor: '#2e7d32', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8 },
  submitText: { color: '#fff', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e7d32',
  },
  pickerErrorContainer: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  pickerErrorText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickerSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  columnLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  modalCancel: {
    marginRight: 20,
  },
  modalCancelText: {
    color: '#666',
    fontWeight: 'bold',
  },
  modalConfirm: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
