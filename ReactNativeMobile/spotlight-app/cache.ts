import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/clerk-expo";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      console.log(`[SecureStore] Attempting to retrieve token with key: "${key}"`);
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`[SecureStore] Token found for key: "${key}"`);
        } else {
          console.warn(`[SecureStore] No token found for key: "${key}"`);
        }
        return item;
      } catch (error) {
        console.error(`[SecureStore] Error retrieving token for key "${key}":`, error);
        try {
          await SecureStore.deleteItemAsync(key);
          console.log(`[SecureStore] Corrupted token deleted for key: "${key}"`);
        } catch (deleteError) {
          console.error(`[SecureStore] Error deleting corrupted token for key "${key}":`, deleteError);
        }
        return null;
      }
    },

    saveToken: async (key: string, token: string) => {
      console.log(`[SecureStore] Attempting to save token for key: "${key}"`);
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(`[SecureStore] Token saved successfully for key: "${key}"`);
      } catch (error) {
        console.error(`[SecureStore] Error saving token for key "${key}":`, error);
      }
    },
  };
};

// SecureStore is not supported on the web
export const tokenCache = Platform.OS !== "web" ? createTokenCache() : undefined;

if (Platform.OS === "web") {
  console.warn("[SecureStore] SecureStore is not supported on web. Token cache is disabled.");
}
