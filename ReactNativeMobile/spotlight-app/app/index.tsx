import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/auth.styles";
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <Image
        source={{
          uri: "https://m.media-amazon.com/images/S/pv-target-images/3bb9e19d96fdb24dcafbd535fe7692c2666ab74ce85728dd082e9b4189509a4e.jpg",
        }}
        style={{ width: 200, height: 200, resizeMode: "cover" }}
      />
    </View>
  );
}
