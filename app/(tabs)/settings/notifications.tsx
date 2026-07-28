import { useBottomSheet } from "@/component/bottom-sheet-provider";
import BellOnIcon from "@/component/icons/bell-on-icon";
import LockverifiedIcon from "@/component/icons/lock-verified-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import SignalIcon from "@/component/icons/signal-icon";
import PlatformPicker from "@/component/ui/platform-picker/platform-picker";
import SettingsCard from "@/component/ui/settings/settings-card";
import { NotificationHelper } from "@/helpers/notification-helper";
import { updateScheduleEventNotifications } from "@/helpers/update-schedule-event-notifications";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { lng, useTranslation } from "@/i18next/i18next";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { NotificationSoundMode } from "@/types/notification";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type soundType = "enable" | "silent";

const isRU = lng === "ru";
const basicSoundSettings = [
  { label: isRU ? "Звук приложения по умолчанию" : "Default app sound", value: "enable" },
  { label: isRU ? "Беззвучно" : "Silent", value: "silent" },
];

const proSoundSettings = [
  { label: isRU ? "Беззвучно" : "Silent", value: "silent" },
  { label: "Universe Wave", value: "universfield_soft.wav" },
  { label: "Earth Softy", value: "universfield_passive.wav" },
  { label: "Dragon Time", value: "dragon_wavy.wav" },
];

const RINGTONE_TRACKS = [
  { key: "universfield_soft.wav", source: require("@/assets/sounds/universfield_soft.wav") },
  {
    key: "universfield_passive.wav",
    source: require("@/assets/sounds/universfield_passive.wav"),
  },
  { key: "dragon_wavy.wav", source: require("@/assets/sounds/dragon_wavy.wav") },
];

export default function Notifications() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { openSheet } = useBottomSheet();

  const isAndroid = Platform.OS === "android";
  const { notfication, reminderPreferences, setNotificationSetting } = useAppSettingsStore();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const [selectedSound, setSelectedSounds] = useState(RINGTONE_TRACKS[0]);

  const player = useAudioPlayer(selectedSound.source, {
    downloadFirst: true,
  });

  const commitTimeoutId = useRef<NodeJS.Timeout>(null);
  const previewTimeoutId = useRef<NodeJS.Timeout>(null);

  const clearPending = () => {
    if (previewTimeoutId.current) {
      clearTimeout(previewTimeoutId.current);
      previewTimeoutId.current = null;
    }
    if (commitTimeoutId.current) {
      clearTimeout(commitTimeoutId.current);
      commitTimeoutId.current = null;
    }
  };

  const soundListSettings = isPremiumPlan ? proSoundSettings : basicSoundSettings;

  const soundSelectedValue =
    isPremiumPlan && notfication.sound === "silent"
      ? notfication.sound
      : isPremiumPlan
        ? notfication.alertSound
        : notfication.sound;

  // Audio set up
  useEffect(() => {
    const setup = async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldPlayInBackground: false,
      });
    };
    setup();
  }, []);

  const handleSoundChange = async (value: string) => {
    if (!isPremiumPlan) {
      // Settings for basic account
      setNotificationSetting({ sound: value as soundType });
      if (value === "silent") {
        await NotificationHelper.cancelAllNotifications();
      } else {
        await updateScheduleEventNotifications({
          ...notfication,
          ...reminderPreferences,
          sound: value as NotificationSoundMode,
        });
      }
    } else {
      clearPending();
      // Settings for pro account
      if (value === "silent") {
        if (player.playing) {
          player.pause();
        }
        setNotificationSetting({ sound: value });
        await NotificationHelper.cancelAllNotifications();
        return;
      }

      setNotificationSetting({ sound: "enable", alertSound: value });

      const newSound = RINGTONE_TRACKS.find((track) => track.key === value)!;
      setSelectedSounds(newSound);
      previewTimeoutId.current = setTimeout(() => {
        player.play();
        previewTimeoutId.current = null;
      }, 80);

      // We wait atleat 5 second before we recreate
      // the new sound for user notification
      commitTimeoutId.current = setTimeout(async () => {
        player.pause();
        await updateScheduleEventNotifications({
          ...notfication,
          ...reminderPreferences,
          sound: "enable",
          alertSound: value,
        });
        commitTimeoutId.current = null;
      }, 5000);
    }
  };

  const toggleAllowNotification = async (value: boolean) => {
    setNotificationSetting({ enable: value });
    await updateScheduleEventNotifications({
      ...notfication,
      ...reminderPreferences,
      enable: value,
    });
  };

  // @platform ANDROID ONLY
  const toggleAllowVibration = async (value: boolean) => {
    setNotificationSetting({ vibration: value });
    await updateScheduleEventNotifications({
      ...notfication,
      ...reminderPreferences,
      vibration: value,
    });
  };

  const toggleAllowDisplayOnLockScreen = async (value: boolean) => {
    setNotificationSetting({ showOnLockScreen: value });
    await updateScheduleEventNotifications({
      ...notfication,
      ...reminderPreferences,
      showOnLockScreen: value,
    });
  };

  const showNotificationSoundListSheet = () => {
    openSheet({
      title: t("settings_screen.notification_sound_title"),
      snapPointPercent: "35%",
      content: (
        <PlatformPicker
          pickerRef={null}
          selectedValue={soundSelectedValue}
          handleOnValueChange={handleSoundChange}
          items={soundListSettings}
        />
      ),
    });
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const top = isAndroid ? insets.top + 20 : insets.top + 10;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }}>
      <View style={styles.container}>
        {/* Allow Sounds */}
        <SettingsCard
          title={t("settings_screen.notification_sound_title")}
          description={t("settings_screen.notification_sound_description")}
          svgIcon={<BellOnIcon color={color} />}
          interaction="press"
          onPress={showNotificationSoundListSheet}
        />

        {/* Allow Notification */}
        <SettingsCard
          title={t("settings_screen.notification_allow_sound_title")}
          description={t("settings_screen.notification_allow_sound_description")}
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
          toggleValue={notfication.enable}
          onToggle={toggleAllowNotification}
        />

        {/* Allow vibration  */}
        {/* @platform ANDROID ONLY */}
        {isAndroid && (
          <SettingsCard
            title={t("settings_screen.notification_vib_title")}
            description={t("settings_screen.notification_vib_description")}
            svgIcon={<SignalIcon color={color} />}
            interaction="toggle"
            toggleValue={notfication.vibration}
            onToggle={toggleAllowVibration}
          />
        )}

        {/* Allow notification display on lock screen */}
        <SettingsCard
          title={t("settings_screen.notification_lock_screen_title")}
          description={t("settings_screen.notification_lock_screen_description")}
          svgIcon={<LockverifiedIcon color={color} />}
          interaction="toggle"
          toggleValue={notfication.showOnLockScreen}
          onToggle={toggleAllowDisplayOnLockScreen}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
});
