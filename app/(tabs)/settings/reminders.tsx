import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import BellNotificationIcon from "@/component/icons/bell-notification-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import PlatformPicker from "@/component/ui/platform-picker/platform-picker";
import SettingsCard from "@/component/ui/settings/settings-card";
import { createScheduleEventNotification } from "@/helpers/create-schedule-event-notifications";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { SnoozeDuration } from "@/types/notification";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const snoozes = [
  { label: "5мин", value: "5" },
  { label: "10мин", value: "10" },
  { label: "15мин", value: "15" },
];

export default function Reminders() {
  const { reminderPreferences, notfication, setReminderPreference } = useAppSettingsStore();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const insets = useSafeAreaInsets();

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const handleSnoozeChange = async (value: string) => {
    setReminderPreference({ snoozeDuration: Number(value) as SnoozeDuration });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      snoozeDuration: Number(value) as SnoozeDuration,
    });
  };

  const toggleAllowEarlyReminder = async (value: boolean) => {
    setReminderPreference({ earlyReminder: value });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      earlyReminder: value,
    });
  };

  const toggleAllowMissedDosage = async (value: boolean) => {
    setReminderPreference({ missedDoseAlert: value });
    await NotificationHelper.cancelAllNotifications();
    await createScheduleEventNotification({
      ...notfication,
      ...reminderPreferences,
      missedDoseAlert: value,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        {/* Snooze Settings */}
        <SettingsCard
          title="Интервал повтора"
          description="Выберите интервал повторного напоминания"
          svgIcon={<AlarmClockIcon color={color} />}
          interaction="press"
          onPress={() => bottomSheetRef.current?.open()}
        />

        {/* Allow early reminder */}
        <SettingsCard
          title="Предварительное напоминание"
          description="Напоминание до приёма лекарства"
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
          toggleValue={reminderPreferences.earlyReminder}
          onToggle={toggleAllowEarlyReminder}
        />

        {/* Allow missed dosage notiification */}
        <SettingsCard
          title="Уведомления о пропущенном приёме"
          description="Если доза не отмечена в течение 30 минут."
          svgIcon={<BellNotificationIcon color={color} />}
          interaction="toggle"
          toggleValue={reminderPreferences.missedDoseAlert}
          onToggle={toggleAllowMissedDosage}
        />
      </View>
      {/* Sounds Settings Bottom Sheet */}
      <BottomSheetWrapper ref={bottomSheetRef} title="Интервал повтора" snapPointPercent="30%">
        <View>
          <PlatformPicker
            pickerRef={null}
            selectedValue={String(reminderPreferences.snoozeDuration)}
            handleOnValueChange={handleSnoozeChange}
            items={snoozes}
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
