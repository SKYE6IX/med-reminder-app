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
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { NotificationSoundMode } from "@/types/notification";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type soundType = "enable" | "silent";

const basicSoundSettings = [
  { label: "Звук приложения по умолчанию", value: "enable" },
  { label: "Беззвучно", value: "silent" },
];

const proSoundSettings = [
  { label: "Беззвучно", value: "silent" },
  { label: "Universe Wave", value: "universfield_soft.wav" },
  { label: "Earth Softy", value: "universfield_passive.wav" },
  { label: "Dragon Time", value: "dragon_wavy.wav" },
];

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { openSheet } = useBottomSheet();

  const isAndroid = Platform.OS === "android";

  const { notfication, reminderPreferences, setNotificationSetting } = useAppSettingsStore();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const player = useAudioPlayer();
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

  const universfieldSoft = require("@/assets/sounds/universfield_soft.wav");
  const universfieldPassive = require("@/assets/sounds/universfield_passive.wav");
  const dragonWavy = require("@/assets/sounds/dragon_wavy.wav");

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
        player.pause();
        player.remove();
        setNotificationSetting({ sound: value });
        await NotificationHelper.cancelAllNotifications();
        return;
      }

      setNotificationSetting({ sound: "enable", alertSound: value });
      if (value === "universfield_soft.wav") {
        player.replace(universfieldSoft);
      } else if (value === "universfield_passive.wav") {
        player.replace(universfieldPassive);
      } else if (value === "dragon_wavy.wav") {
        player.replace(dragonWavy);
      }

      player.play();

      previewTimeoutId.current = setTimeout(() => {
        player.pause();
        player.remove();
        previewTimeoutId.current = null;
      }, 5000);

      // We wait atleat 6 second before we recreate
      // the new sound for user notification
      commitTimeoutId.current = setTimeout(async () => {
        await updateScheduleEventNotifications({
          ...notfication,
          ...reminderPreferences,
          sound: "enable",
          alertSound: value,
        });
        commitTimeoutId.current = null;
      }, 6000);
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
      title: "Звук уведомления",
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
          title="Звук уведомления"
          description="Изменить звук уведомлений"
          svgIcon={<BellOnIcon color={color} />}
          interaction="press"
          onPress={showNotificationSoundListSheet}
        />

        {/* Allow Notification */}
        <SettingsCard
          title="Уведомления приложения"
          description="Получать уведомления приложения"
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
          toggleValue={notfication.enable}
          onToggle={toggleAllowNotification}
        />

        {/* Allow vibration  */}
        {/* @platform ANDROID ONLY */}
        {isAndroid && (
          <SettingsCard
            title="Вибрация"
            description="Устройство вибрирует, когда приходит уведомление"
            svgIcon={<SignalIcon color={color} />}
            interaction="toggle"
            toggleValue={notfication.vibration}
            onToggle={toggleAllowVibration}
          />
        )}

        {/* Allow notification display on lock screen */}
        <SettingsCard
          title="Показывать на экране блокировки"
          description="Показывать напоминания о лекарствах на экране блокировки"
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
