import { Stack, useRouter, useSegments } from "expo-router";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { SessionProvider, useSession } from "./ctx";
import React, { useEffect } from "react";

function RootLayoutNav() {
  const { session, signOut, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "pages" || segments[0] === "home";

    if (!session && inAuthGroup) {
      router.replace("/");
    } else if (session && !inAuthGroup) {
      router.replace("/home");
    }
  }, [session, segments, isLoading]);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Login"
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: "FLEET CUSTOMER PORTAL",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#2e7d32',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => signOut()}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="pages/CreateQuote"
        options={{ title: "Create Quote", headerTintColor: '#2e7d32' }}
      />
      <Stack.Screen
        name="pages/IssuePolicy"
        options={{ title: "Issue Policy", headerTintColor: '#2e7d32' }}
      />
      <Stack.Screen
        name="pages/PrintDocuments"
        options={{ title: "Print Documents", headerTintColor: '#2e7d32' }}
      />
      <Stack.Screen
        name="pages/MTA"
        options={{ title: "Mid Term Adjustment", headerTintColor: '#2e7d32' }}
      />
      <Stack.Screen
        name="pages/Reports"
        options={{ title: "Reports", headerTintColor: '#2e7d32' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  logoutText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
