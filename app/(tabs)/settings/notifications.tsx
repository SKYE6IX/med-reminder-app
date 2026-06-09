import BellOnIcon from "@/component/icons/bell-on-icon";
import LockverifiedIcon from "@/component/icons/lock-verified-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import SignalIcon from "@/component/icons/signal-icon";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import PlatformPicker from "@/component/ui/platform-picker/platform-picker";
import SettingsCard from "@/component/ui/settings/settings-card";
import { updateScheduleEventNotifications } from "@/helpers/update-schedule-event-notifications";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { NotificationSoundMode } from "@/types/notification";
import { useAudioPlayer } from "expo-audio";
import { useRef } from "react";
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
  const isAndroid = Platform.OS === "android";
  const { notfication, reminderPreferences, setNotificationSetting } = useAppSettingsStore();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const player = useAudioPlayer();
  const timeoutId = useRef<number>(null);

  const universfieldSoft = require("@/assets/sounds/universfield_soft.wav");
  const universfieldPassive = require("@/assets/sounds/universfield_passive.wav");
  const dragonWavy = require("@/assets/sounds/dragon_wavy.wav");

  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const insets = useSafeAreaInsets();

  const soundListSettings = isPremiumPlan ? proSoundSettings : basicSoundSettings;
  const soundSelectedValue =
    isPremiumPlan && notfication.sound === "silent"
      ? notfication.sound
      : isPremiumPlan
        ? notfication.alertSound
        : notfication.sound;

  const handleSoundChange = async (value: string) => {
    if (!isPremiumPlan) {
      // Setting coming from basic account
      setNotificationSetting({ sound: value as soundType });
      await updateScheduleEventNotifications({
        ...notfication,
        ...reminderPreferences,
        sound: value as NotificationSoundMode,
      });
    } else {
      // Setting coming from pro account
      if (value === "silent") {
        setNotificationSetting({ sound: value });
        await updateScheduleEventNotifications({
          ...notfication,
          ...reminderPreferences,
          sound: value,
        });
      } else {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        if (value === "universfield_soft.wav") {
          player.replace(universfieldSoft);
        } else if (value === "universfield_passive.wav") {
          player.replace(universfieldPassive);
        } else {
          player.replace(dragonWavy);
        }
        player.play();
        setNotificationSetting({ sound: "enable", alertSound: value });

        setTimeout(() => {
          player.pause();
        }, 5000);

        // We wait atleat 15second before we recreate
        // the new sound for user notification
        timeoutId.current = setTimeout(async () => {
          await updateScheduleEventNotifications({
            ...notfication,
            ...reminderPreferences,
            sound: "enable",
            alertSound: value,
          });
        }, 5000);
      }
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
      <BottomSheetWrapper ref={bottomSheetRef} title="Звук уведомления" snapPointPercent="35%">
        <View>
          <PlatformPicker
            pickerRef={null}
            selectedValue={soundSelectedValue}
            handleOnValueChange={handleSoundChange}
            items={soundListSettings}
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
