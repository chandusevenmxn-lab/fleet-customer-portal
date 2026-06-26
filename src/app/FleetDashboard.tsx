import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "./ctx";

type Tab = "quote" | "policy" | "print" | "reports" | "mta";

const FleetDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("quote");
  const [errorMessage, setErrorMessage] = useState('');
  const [inputs, setInputs] = useState({
    customerId: '',
    companyName: '',
    quoteId: '',
    paymentStatus: '',
    policyNumber: '',
    mtaPolicyNumber: '',
  });

  const router = useRouter();
  const { signOut } = useSession();

  const validateAndNavigate = (path: string, fieldMapping: { [key: string]: string }) => {
    const missingFieldNames = Object.keys(fieldMapping)
      .filter(field => !inputs[field as keyof typeof inputs])
      .map(field => fieldMapping[field]);

    if (missingFieldNames.length > 0) {
      setErrorMessage(`Warning: Please enter mandatory fields:\n• ${missingFieldNames.join('\n• ')}`);
      return;
    }
    setErrorMessage('');
    router.push(path as any);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "quote":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Quote</Text>
            <TextInput
              style={styles.input}
              placeholder="Customer ID *"
              placeholderTextColor="#888"
              value={inputs.customerId}
              onChangeText={(text) => {
                setInputs({...inputs, customerId: text});
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Name *"
              placeholderTextColor="#888"
              value={inputs.companyName}
              onChangeText={(text) => {
                setInputs({...inputs, companyName: text});
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => validateAndNavigate("/pages/CreateQuote", {
                customerId: "Customer ID",
                companyName: "Company Name"
              })}
            >
              <Text style={styles.buttonText}>Go to Create Quote Page</Text>
            </TouchableOpacity>
          </View>
        );
      case "policy":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Issue Policy</Text>
            <TextInput
              style={styles.input}
              placeholder="Quote ID *"
              placeholderTextColor="#888"
              value={inputs.quoteId}
              onChangeText={(text) => {
                setInputs({...inputs, quoteId: text});
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Payment Status *"
              placeholderTextColor="#888"
              value={inputs.paymentStatus}
              onChangeText={(text) => {
                setInputs({...inputs, paymentStatus: text});
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => validateAndNavigate("/pages/IssuePolicy", {
                quoteId: "Quote ID",
                paymentStatus: "Payment Status"
              })}
            >
              <Text style={styles.buttonText}>Go to Issue Policy Page</Text>
            </TouchableOpacity>
          </View>
        );
      case "print":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Print Documents</Text>
            <TextInput
              style={styles.input}
              placeholder="Policy Number *"
              placeholderTextColor="#888"
              value={inputs.policyNumber}
              onChangeText={(text) => {
                setInputs({...inputs, policyNumber: text});
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => validateAndNavigate("/pages/PrintDocuments", {
                policyNumber: "Policy Number"
              })}
            >
              <Text style={styles.buttonText}>Go to Print Documents Page</Text>
            </TouchableOpacity>
          </View>
        );
      case "reports":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.infoText}>Report generation module</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/pages/Reports")}
            >
              <Text style={styles.buttonText}>Go to Reports Page</Text>
            </TouchableOpacity>
          </View>
        );
      case "mta":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mid Term Adjustment (MTA)</Text>
            <TextInput
              style={styles.input}
              placeholder="Policy Number *"
              placeholderTextColor="#888"
              value={inputs.mtaPolicyNumber}
              onChangeText={(text) => {
                setInputs({...inputs, mtaPolicyNumber: text});
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => validateAndNavigate("/pages/MTA", {
                mtaPolicyNumber: "Policy Number"
              })}
            >
              <Text style={styles.buttonText}>Go to MTA Page</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.tabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {(["quote", "policy", "print", "reports", "mta"] as Tab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                onPress={() => handleTabChange(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab === "mta" ? "MTA" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.contentScroll}>
        <View style={styles.content}>
          {errorMessage ? (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>{errorMessage}</Text>
            </View>
          ) : null}

          {renderContent()}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => signOut()}
        >
          <Text style={styles.backButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerSection: {
    backgroundColor: "#fff",
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabsWrapper: {
    paddingBottom: 10,
  },
  tabsScroll: {
    paddingHorizontal: 15,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#e9ecef",
  },
  activeTab: {
    backgroundColor: "#1976d2",
  },
  tabText: {
    color: "#495057",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#212529",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 15,
    color: "#495057",
  },
  actionButton: {
    backgroundColor: "#1976d2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 15,
    color: "#6c757d",
    marginBottom: 15,
  },
  backButton: {
    padding: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#1976d2",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default FleetDashboard;
