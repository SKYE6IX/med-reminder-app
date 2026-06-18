import { SnoozeDuration } from "@/types/notification";
import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppSettingsStore {
  notfication: {
    enable: boolean;
    sound: "enable" | "silent";
    alertSound: string;
    vibration: boolean;
    showOnLockScreen: boolean;
  };
  reminderPreferences: {
    snoozeDuration: SnoozeDuration;
    earlyReminder: boolean;
    missedDoseAlert: boolean;
  };
  useDeviceLock: boolean;
  setNotificationSetting: (options: Partial<AppSettingsStore["notfication"]>) => void;
  setReminderPreference: (options: Partial<AppSettingsStore["reminderPreferences"]>) => void;
  setUseDeviceLock: (value: boolean) => void;
  resetAppSetting: () => void;
}

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set) => ({
      notfication: {
        sound: "enable",
        alertSound: "universfield_soft.wav",
        enable: true,
        vibration: true,
        showOnLockScreen: true,
      },
      reminderPreferences: {
        snoozeDuration: 5,
        earlyReminder: false,
        missedDoseAlert: false,
      },
      useDeviceLock: false,
      setNotificationSetting(options) {
        set((state) => ({ ...state, notfication: { ...state.notfication, ...options } }));
      },
      setReminderPreference(options) {
        set((state) => ({
          ...state,
          reminderPreferences: { ...state.reminderPreferences, ...options },
        }));
      },
      setUseDeviceLock(value) {
        set((state) => ({ ...state, useDeviceLock: value }));
      },
      resetAppSetting() {
        set({
          notfication: {
            sound: "enable",
            alertSound: "universfield_soft.wav",
            enable: true,
            vibration: true,
            showOnLockScreen: true,
          },
          reminderPreferences: {
            snoozeDuration: 5,
            earlyReminder: false,
            missedDoseAlert: false,
          },
          useDeviceLock: false,
        });
      },
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
    },
  ),
);
