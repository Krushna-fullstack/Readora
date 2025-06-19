import { useState, useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { ActivityIndicator, View } from "react-native"; // Add loading indicator

const RootLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [isReady, setIsReady] = useState(false); // Track mounting state

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      setIsReady(true); // Mark as ready after auth check
    };
    initialize();
  }, []);

  // Handle navigation only AFTER mounting
  useEffect(() => {
    if (!isReady) return; // Skip until mounted

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = !!user && !!token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, isReady]);

  // Show loading indicator while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
};

export default RootLayout;
