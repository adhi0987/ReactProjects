import { Loader } from "@/components/Loader";
import NoNotificationFound from "@/components/NoNotificationsFound";
import NotificationItem from "@/components/NotificationItem";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notifications.styles";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Text, View } from "react-native";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;

  if (notifications.length === 0) return <NoNotificationFound />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}


