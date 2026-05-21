import AsyncStorage from "@react-native-async-storage/async-storage";

type StorageValue = string | number | boolean | Record<string, unknown> | unknown[];

export async function saveToStorage<T extends StorageValue>(key: string, value: T) {
  try {
    const parsedValue = typeof value === "string" ? value : JSON.stringify(value);

    await AsyncStorage.setItem(key, parsedValue);
  } catch (error) {
    console.error("Storage save error:", error);
  }
}

export async function readFromStorage<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value == null) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  } catch (error) {
    console.error("Storage read error:", error);
    return null;
  }
}

export async function removeFromStorage(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Storage remove error:", error);
  }
}
