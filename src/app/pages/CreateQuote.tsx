import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function CreateQuote() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    regNumber: '',
    makeModel: '',
    year: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [premium, setPremium] = useState(0);

  // Picker State
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear().toString());

  const handleCalculate = () => {
    const missingFields = [];
    if (!formData.fullName) missingFields.push("Full Name");
    if (!formData.email) missingFields.push("Email Address");
    if (!formData.regNumber) missingFields.push("Registration Number");

    if (missingFields.length > 0) {
      setErrorMessage(`Warning: Please enter mandatory fields:\n• ${missingFields.join('\n• ')}`);
      return;
    }

    setErrorMessage('');
    const basePremium = 500;
    const yearBonus = formData.year ? (2024 - parseInt(formData.year)) * 10 : 0;
    setPremium(basePremium + yearBonus);
    setShowResult(true);
  };

  const confirmYear = () => {
    setFormData({...formData, year: tempYear});
    setShowYearPicker(false);
  };

  if (showResult) {
    return (
      <View style={styles.resultContainer}>
        <Stack.Screen options={{ title: "Quote Result" }} />
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>Quote Generated Successfully!</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Customer:</Text>
            <Text style={styles.resultValue}>{formData.fullName}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Vehicle:</Text>
            <Text style={styles.resultValue}>{formData.regNumber}</Text>
          </View>
          <View style={[styles.resultRow, styles.premiumRow]}>
            <Text style={styles.premiumLabel}>Estimated Premium:</Text>
            <Text style={styles.premiumValue}>${premium.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={() => setShowResult(false)}>
            <Text style={styles.submitText}>Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Create Quote", headerTintColor: '#2e7d32' }} />

      <View style={styles.form}>
        {errorMessage ? (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{errorMessage}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Customer Details <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          placeholderTextColor="#999"
          value={formData.fullName}
          onChangeText={(text) => {
            setFormData({...formData, fullName: text});
            if (errorMessage) setErrorMessage('');
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(text) => {
            setFormData({...formData, email: text});
            if (errorMessage) setErrorMessage('');
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          value={formData.phone}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setFormData({...formData, phone: numericText});
          }}
        />

        <Text style={styles.label}>Vehicle Information <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Registration Number *"
          placeholderTextColor="#999"
          value={formData.regNumber}
          onChangeText={(text) => {
            setFormData({...formData, regNumber: text});
            if (errorMessage) setErrorMessage('');
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Make & Model"
          placeholderTextColor="#999"
          value={formData.makeModel}
          onChangeText={(text) => setFormData({...formData, makeModel: text})}
        />

        <TouchableOpacity
          style={styles.dateInputContainer}
          onPress={() => setShowYearPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dateInputText, !formData.year && { color: '#999' }]}>
            {formData.year || "Year of Manufacture"}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleCalculate}>
          <Text style={styles.submitText}>Calculate Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Year</Text>

            <TextInput
              style={styles.pickerInputSingle}
              value={tempYear}
              keyboardType="numeric"
              maxLength={4}
              onChangeText={setTempYear}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowYearPicker(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmYear}>
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
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#333' },
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
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
  submitButton: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  backText: { color: '#666', fontSize: 16 },
  resultContainer: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  resultCard: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  resultHeader: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginBottom: 25 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  resultLabel: { fontSize: 16, color: '#666' },
  resultValue: { fontSize: 16, fontWeight: '600', color: '#333' },
  premiumRow: { marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  premiumLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  premiumValue: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    width: '60%',
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
  pickerInputSingle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
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
    paddingVertical: 8,
  },
  modalCancelText: {
    color: '#666',
    fontWeight: 'bold',
  },
  modalConfirm: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
