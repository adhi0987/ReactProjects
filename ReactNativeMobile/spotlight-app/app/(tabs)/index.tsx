import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/auth.styles";
import { Link } from "expo-router";
import { SafeAreaProviderCompat } from "@react-navigation/elements";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <View style={styles.container}>
      <Link href={"/notifications"} >
        Feed Screen in tabs
      </Link>
    </View>
  );
}
