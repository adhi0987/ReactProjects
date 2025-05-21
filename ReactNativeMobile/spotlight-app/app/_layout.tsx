import { Stack,Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
