import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';

const DOCS = [
  { id: '1', name: 'Policy Schedule', type: 'PDF' },
  { id: '2', name: 'Certificate of Insurance', type: 'PDF' },
  { id: '3', name: 'Premium Invoice', type: 'PDF' },
  { id: '4', name: 'Terms & Conditions', type: 'PDF' },
];

export default function PrintDocuments() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [showDocs, setShowDocs] = useState(false);

  const handleSearch = () => {
    if (!policyNumber) {
      setErrorMessage('Warning: Please enter a Policy Number to fetch documents.');
      return;
    }
    setErrorMessage('');
    setShowDocs(true);
  };

  if (!showDocs) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Find Documents", headerTintColor: '#2e7d32' }} />
        <View style={styles.searchBox}>
          {errorMessage ? (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Policy Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. FLT-2024-001 *"
            placeholderTextColor="#999"
            value={policyNumber}
            onChangeText={(text) => {
              setPolicyNumber(text);
              if (errorMessage) setErrorMessage('');
            }}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchText}>Fetch Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Print Documents", headerTintColor: '#2e7d32' }} />

      <View style={styles.header}>
        <Text style={styles.title}>Available Documents</Text>
        <Text style={styles.subtitle}>Policy: {policyNumber}</Text>
      </View>

      <FlatList
        data={DOCS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.docItem} onPress={() => alert(`Downloading ${item.name}...`)}>
            <View>
              <Text style={styles.docName}>{item.name}</Text>
              <Text style={styles.docType}>{item.type}</Text>
            </View>
            <Text style={styles.downloadIcon}>⬇️</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => setShowDocs(false)}>
        <Text style={styles.backText}>Change Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchBox: { padding: 25, flex: 1, justifyContent: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
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
    marginBottom: 20,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { padding: 15 },
  docItem: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  docName: { fontSize: 16, fontWeight: '600', color: '#333' },
  docType: { fontSize: 12, color: '#2e7d32', marginTop: 2 },
  downloadIcon: { fontSize: 20 },
  backButton: { padding: 20, alignItems: 'center' },
  backText: { color: '#2e7d32', fontSize: 16, fontWeight: 'bold' },
});
