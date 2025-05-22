import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function login() {
    const {startSSOFlow}=useSSO()
    const router=useRouter();
    const handleGoogleSignIn = async () =>{
        try {
            const {createdSessionId,setActive}=await startSSOFlow({strategy:"oauth_google"})
            if(setActive && createdSessionId)
            {
                setActive({session:createdSessionId});
                router.replace("/(tabs)");
            }
        } catch (error) {
            console.log("error in authentication: ",error);
        }
    }
  return (
    <View style={styles.container}>
      {/* BRAND SECTION */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary}></Ionicons>
        </View>
        <Text style={styles.appName}>Spot Light</Text>
        <Text style={styles.tagline}>dont miss anything</Text>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/Online wishes-bro.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue With Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By Continuing, you agree to out Terms and privacy Policy
        </Text>
      </View>
    </View>
  );
}
