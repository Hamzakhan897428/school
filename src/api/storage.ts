import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "wellrun_parent_token";
const CHILD_ID_KEY = "wellrun_selected_child_id";

// In-memory fallback if storage is unavailable
let memoryToken: string | null = null;
let memoryChildId: string | null = null;

export const storage = {
  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage.getItem(TOKEN_KEY);
        }
        return memoryToken;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return memoryToken;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      memoryToken = token;
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch {
      memoryToken = token;
    }
  },

  async clearToken(): Promise<void> {
    try {
      memoryToken = null;
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch {
      memoryToken = null;
    }
  },

  async getSelectedChildId(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage.getItem(CHILD_ID_KEY);
        }
        return memoryChildId;
      }
      return await SecureStore.getItemAsync(CHILD_ID_KEY);
    } catch {
      return memoryChildId;
    }
  },

  async setSelectedChildId(childId: string): Promise<void> {
    try {
      memoryChildId = childId;
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(CHILD_ID_KEY, childId);
        }
      } else {
        await SecureStore.setItemAsync(CHILD_ID_KEY, childId);
      }
    } catch {
      memoryChildId = childId;
    }
  },

  async clearAll(): Promise<void> {
    await this.clearToken();
    try {
      memoryChildId = null;
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem(CHILD_ID_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(CHILD_ID_KEY);
      }
    } catch {
      memoryChildId = null;
    }
  },
};

