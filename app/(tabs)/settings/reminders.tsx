import { useBottomSheet } from "@/component/bottom-sheet-provider";
import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import BellNotificationIcon from "@/component/icons/bell-notification-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import PlatformPicker from "@/component/ui/platform-picker/platform-picker";
import SettingsCard from "@/component/ui/settings/settings-card";
import { updateScheduleEventNotifications } from "@/helpers/update-schedule-event-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import { lng, useTranslation } from "@/i18next/i18next";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { SnoozeDuration } from "@/types/notification";
import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const isRU = lng === "ru";
const snoozes = [
  { label: isRU ? "5мин" : "5min", value: "5" },
  { label: isRU ? "10мин" : "10min", value: "10" },
  { label: isRU ? "15мин" : "15min", value: "15" },
];

export default function Reminders() {
  const { t } = useTranslation();
  const { openSheet } = useBottomSheet();

  const { reminderPreferences, notfication, setReminderPreference } = useAppSettingsStore();
  const insets = useSafeAreaInsets();

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const commitTimeoutId = useRef<NodeJS.Timeout>(null);

  const handleSnoozeChange = (value: string) => {
    setReminderPreference({ snoozeDuration: Number(value) as SnoozeDuration });

    if (commitTimeoutId.current) {
      clearTimeout(commitTimeoutId.current);
    }

    commitTimeoutId.current = setTimeout(async () => {
      await updateScheduleEventNotifications({
        ...notfication,
        ...reminderPreferences,
        snoozeDuration: Number(value) as SnoozeDuration,
      });
      commitTimeoutId.current = null;
    }, 5000);
  };

  const toggleAllowEarlyReminder = async (value: boolean) => {
    setReminderPreference({ earlyReminder: value });
    await updateScheduleEventNotifications({
      ...notfication,
      ...reminderPreferences,
      earlyReminder: value,
    });
  };

  const toggleAllowMissedDosage = async (value: boolean) => {
    setReminderPreference({ missedDoseAlert: value });
    await updateScheduleEventNotifications({
      ...notfication,
      ...reminderPreferences,
      missedDoseAlert: value,
    });
  };

  const showSnoozeOptioonSheet = () => {
    openSheet({
      title: t("settings_screen.reminder_snooze_title"),
      snapPointPercent: "30%",
      content: (
        <PlatformPicker
          pickerRef={null}
          selectedValue={String(reminderPreferences.snoozeDuration)}
          handleOnValueChange={handleSnoozeChange}
          items={snoozes}
        />
      ),
    });
  };

  const top = Platform.OS === "android" ? insets.top + 20 : insets.top + 10;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }}>
      <View style={styles.container}>
        {/* Snooze Settings */}
        <SettingsCard
          title={t("settings_screen.reminder_snooze_title")}
          description={t("settings_screen.reminder_snooze_description")}
          svgIcon={<AlarmClockIcon color={color} />}
          interaction="press"
          onPress={showSnoozeOptioonSheet}
        />

        {/* Allow early reminder */}
        <SettingsCard
          title={t("settings_screen.reminder_allow_early_title")}
          description={t("settings_screen.reminder_allow_early_description")}
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
          toggleValue={reminderPreferences.earlyReminder}
          onToggle={toggleAllowEarlyReminder}
        />

        {/* Allow missed dosage notiification */}
        <SettingsCard
          title={t("settings_screen.reminder_allow_missed_title")}
          description={t("settings_screen.reminder_allow_missed_description")}
          svgIcon={<BellNotificationIcon color={color} />}
          interaction="toggle"
          toggleValue={reminderPreferences.missedDoseAlert}
          onToggle={toggleAllowMissedDosage}
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
