import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function NoNotificationFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons
        name="notifications-outline"
        size={40}
        color={COLORS.primary}
      ></Ionicons>
      <Text style={{ fontSize: 20, color: COLORS.white }}>
        No Notifications Found
      </Text>
    </View>
  );
}