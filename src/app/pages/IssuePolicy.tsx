import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function IssuePolicy() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState({
    day: new Date().getDate().toString().padStart(2, '0'),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    year: new Date().getFullYear().toString()
  });

  const handleIssue = () => {
    const missingFields = [];
    if (!receiptId) missingFields.push("Payment Reference");
    if (!effectiveDate) missingFields.push("Effective Date");

    if (missingFields.length > 0) {
      setErrorMessage(`Warning: Please enter mandatory fields:\n• ${missingFields.join('\n• ')}`);
      return;
    }
    setErrorMessage('');
    setShowResult(true);
  };

  const confirmDate = () => {
    setEffectiveDate(`${tempDate.year}-${tempDate.month}-${tempDate.day}`);
    setShowDatePicker(false);
    if (errorMessage) setErrorMessage('');
  };

  if (showResult) {
    return (
      <View style={styles.resultContainer}>
        <Stack.Screen options={{ title: "Policy Issued" }} />
        <View style={styles.resultCard}>
          <View style={styles.successIcon}><Text style={styles.iconText}>✓</Text></View>
          <Text style={styles.resultHeader}>Policy Issued!</Text>
          <Text style={styles.resultSub}>Policy Number: <Text style={styles.bold}>FL-9920-X</Text></Text>
          <Text style={styles.infoText}>The documents have been sent to the customer's registered email address.</Text>

          <TouchableOpacity style={styles.mainButton} onPress={() => router.replace('/home')}>
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Issue Policy", headerTintColor: '#2e7d32' }} />

      <View style={styles.content}>
        {errorMessage ? (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quote Summary #Q-8829</Text>
          <Text style={styles.summaryText}>Customer: John Doe</Text>
          <Text style={styles.summaryText}>Premium: $1,250.00</Text>
        </View>

        <Text style={styles.label}>Payment Reference <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Receipt ID *"
          placeholderTextColor="#999"
          value={receiptId}
          onChangeText={(text) => {
            setReceiptId(text);
            if (errorMessage) setErrorMessage('');
          }}
        />

        <Text style={styles.label}>Effective Date <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={styles.dateInputContainer}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dateInputText, !effectiveDate && { color: '#999' }]}>
            {effectiveDate || "Select Date *"}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.issueButton} onPress={handleIssue}>
          <Text style={styles.issueText}>Confirm & Issue Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Effective Date</Text>

            <View style={styles.pickerSelectors}>
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Day</Text>
                <TextInput
                  style={styles.pickerInput}
                  value={tempDate.day}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(val) => setTempDate({...tempDate, day: val})}
                />
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Month</Text>
                <TextInput
                  style={styles.pickerInput}
                  value={tempDate.month}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(val) => setTempDate({...tempDate, month: val})}
                />
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Year</Text>
                <TextInput
                  style={styles.pickerInput}
                  value={tempDate.year}
                  keyboardType="numeric"
                  maxLength={4}
                  onChangeText={(val) => setTempDate({...tempDate, year: val})}
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
  content: { padding: 20 },
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
  summaryCard: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2e7d32',
    marginBottom: 25,
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 5 },
  summaryText: { fontSize: 16, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 8, color: '#444' },
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
  issueButton: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  issueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  backText: { color: '#666', fontSize: 16 },
  resultContainer: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  resultCard: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 4 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  iconText: { fontSize: 40, color: '#2e7d32' },
  resultHeader: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  resultSub: { fontSize: 18, color: '#666', marginBottom: 20 },
  bold: { fontWeight: 'bold', color: '#2e7d32' },
  infoText: { textAlign: 'center', color: '#888', marginBottom: 30, lineHeight: 20 },
  mainButton: { backgroundColor: '#2e7d32', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

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
