import BellOnIcon from "@/component/icons/bell-on-icon";
import LockverifiedIcon from "@/component/icons/lock-verified-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import SignalIcon from "@/component/icons/signal-icon";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import PlatformPicker from "@/component/ui/platform-picker/platform-picker";
import SettingsCard from "@/component/ui/settings/settings-card";
import { createScheduleEventNotification } from "@/helpers/create-schedule-event-notifications";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { NotificationSoundMode } from "@/types/notification";
import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type soundType = "enable" | "silent";

const soundSettings = [
  { label: "Звук приложения по умолчанию", value: "enable" },
  { label: "Беззвучно", value: "silent" },
];

export default function Notifications() {
  const isAndroid = Platform.OS === "android";
  const { notfication, reminderPreferences, setNotificationSetting } = useAppSettingsStore();

  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const insets = useSafeAreaInsets();

  const handleSoundChange = async (value: string) => {
    setNotificationSetting({ sound: value as soundType });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      sound: value as NotificationSoundMode,
    });
  };

  const toggleAllowNotification = async (value: boolean) => {
    setNotificationSetting({ enable: value });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      enable: value,
    });
  };

  const toggleAllowVibration = async (value: boolean) => {
    setNotificationSetting({ vibration: value });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      vibration: value,
    });
  };

  const toggleAllowDisplayOnLockScreen = async (value: boolean) => {
    setNotificationSetting({ showOnLockScreen: value });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      showOnLockScreen: value,
    });
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        {/* Allow Sounds */}
        <SettingsCard
          title="Звук уведомления"
          description="Изменить звук уведомлений"
          svgIcon={<BellOnIcon color={color} />}
          interaction="press"
          onPress={() => bottomSheetRef.current?.open()}
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
            description="Устройство вибрирует, когда подходит  напоминание"
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

      {/* Sounds Settings Bottom Sheet */}
      <BottomSheetWrapper ref={bottomSheetRef} title="Звук уведомления" snapPointPercent="30%">
        <View>
          <PlatformPicker
            pickerRef={null}
            selectedValue={notfication.sound}
            handleOnValueChange={handleSoundChange}
            items={soundSettings}
          />
        </View>
      </BottomSheetWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
});
