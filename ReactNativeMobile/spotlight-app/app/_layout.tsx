import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import InitialLayout from "@/components/InitialLayout";
import { styles } from "@/styles/auth.styles";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
