import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/auth.styles";
import { useAuth } from "@clerk/clerk-expo";
export default function Index() {
  const {signOut}=useAuth();
  return (
    <View style={{
      flex:1,backgroundColor:"black",paddingTop:300
    }}>
      <TouchableOpacity onPress={()=>signOut()}>
        <Text style={{color:"white"}}>
          SignOut
        </Text>
      </TouchableOpacity>
    </View>
  );
}
