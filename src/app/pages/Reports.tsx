import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function Reports() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [reportYear, setReportYear] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');

  // Picker State
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear().toString());

  const handleGenerate = (type: string) => {
    if (!reportYear) {
      setErrorMessage('Warning: Please enter the fiscal year for the report.');
      return;
    }
    setErrorMessage('');
    setSelectedReport(type);
    setShowResult(true);
  };

  const confirmYear = () => {
    setReportYear(tempYear);
    setShowYearPicker(false);
    if (errorMessage) setErrorMessage('');
  };

  if (showResult) {
    return (
      <View style={styles.resultContainer}>
        <Stack.Screen options={{ title: "Report Preview" }} />
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>{selectedReport}</Text>
          <Text style={styles.resultSub}>Fiscal Year: {reportYear}</Text>

          <View style={styles.chartMock}>
            <View style={[styles.bar, { height: '40%' }]} />
            <View style={[styles.bar, { height: '70%', backgroundColor: '#2e7d32' }]} />
            <View style={[styles.bar, { height: '55%' }]} />
            <View style={[styles.bar, { height: '90%', backgroundColor: '#2e7d32' }]} />
          </View>

          <Text style={styles.infoText}>Report data for {reportYear} has been generated based on current active policies and claims history.</Text>

          <TouchableOpacity style={styles.downloadButton} onPress={() => alert('Downloading PDF...')}>
            <Text style={styles.downloadText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowResult(false)}>
            <Text style={styles.backText}>Close Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Reports", headerTintColor: '#2e7d32' }} />

      <View style={styles.content}>
        {errorMessage ? (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{errorMessage}</Text>
          </View>
        ) : null}

        <Text style={styles.header}>Fleet Performance Overview</Text>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Fiscal Year <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => setShowYearPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateInputText, !reportYear && { color: '#999' }]}>
              {reportYear || "e.g. 2024 *"}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Select report type to generate</Text>

        <TouchableOpacity style={styles.reportItem} onPress={() => handleGenerate('Premium Breakdown')}>
          <View style={styles.reportIconContainer}>
            <Text style={styles.reportIcon}>💰</Text>
          </View>
          <View style={styles.reportDetails}>
            <Text style={styles.reportName}>Premium Breakdown</Text>
            <Text style={styles.reportDesc}>Monthly and yearly premium analysis</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportItem} onPress={() => handleGenerate('Claims Summary')}>
          <View style={[styles.reportIconContainer, { backgroundColor: '#fff3e0' }]}>
            <Text style={styles.reportIcon}>📋</Text>
          </View>
          <View style={styles.reportDetails}>
            <Text style={styles.reportName}>Claims Summary</Text>
            <Text style={styles.reportDesc}>Overview of all pending and settled claims</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportItem} onPress={() => handleGenerate('Fleet Utilization')}>
          <View style={[styles.reportIconContainer, { backgroundColor: '#f3e5f5' }]}>
            <Text style={styles.reportIcon}>🚛</Text>
          </View>
          <View style={styles.reportDetails}>
            <Text style={styles.reportName}>Fleet Utilization</Text>
            <Text style={styles.reportDesc}>Vehicle activity and coverage stats</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Dashboard</Text>
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
            <Text style={styles.pickerTitle}>Select Fiscal Year</Text>

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
  content: { padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
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
  inputSection: { marginBottom: 25, backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#444' },
  required: { color: 'red' },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 15, marginLeft: 5 },
  reportItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reportIconContainer: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  reportIcon: { fontSize: 24 },
  reportDetails: { flex: 1 },
  reportName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  reportDesc: { fontSize: 12, color: '#777', marginTop: 2 },
  backButton: { padding: 20, alignItems: 'center' },
  backText: { color: '#666', fontSize: 16 },
  resultContainer: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  resultCard: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 3 },
  resultHeader: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
  resultSub: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
  chartMock: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 25, paddingHorizontal: 20 },
  bar: { width: 30, backgroundColor: '#ddd', borderRadius: 5 },
  infoText: { textAlign: 'center', fontSize: 14, color: '#888', marginBottom: 25, lineHeight: 20 },
  downloadButton: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8, alignItems: 'center' },
  downloadText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

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
