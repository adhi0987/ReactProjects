import { SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import InitialLayout from "@/components/InitialLayout";
import { styles } from "@/styles/auth.styles";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts} from"expo-font";
import { useCallback } from "react";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded]=useFonts({
    "JetBrainsMono-Medium":require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })
  const onLayoutRootView = useCallback(async ()=>{
    if(fontsLoaded)  await SplashScreen.hideAsync();
  },[fontsLoaded]);
  return (
    <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
