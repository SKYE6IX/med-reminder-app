import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildStorage, StorageValue } from "axios-cache-interceptor";

export const asyncStorageAdapter = buildStorage({
  async find(key) {
    const item = await AsyncStorage.getItem(`axios-cache:${key}`);
    if (!item) return undefined;
    return JSON.parse(item) as StorageValue;
  },

  async set(key, value) {
    await AsyncStorage.setItem(`axios-cache:${key}`, JSON.stringify(value));
  },

  async remove(key) {
    await AsyncStorage.removeItem(`axios-cache:${key}`);
  },
});
