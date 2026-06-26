import { StyleSheet, SafeAreaView } from "react-native";
import FleetDashboard from "./FleetDashboard";

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FleetDashboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
