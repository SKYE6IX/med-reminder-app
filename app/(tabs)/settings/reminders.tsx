import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import BellNotificationIcon from "@/component/icons/bell-notification-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Reminders() {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <SettingsCard
          title="Интервал повтора"
          description="Выберите интервал повторного напоминания"
          svgIcon={<AlarmClockIcon color={color} />}
          interaction="press"
        />

        <SettingsCard
          title="Предварительное напоминание"
          description="Напоминание до приёма лекарства"
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
        />

        <SettingsCard
          title="Уведомления о пропущенном приёме"
          description="Если доза не отмечена в течение 30 минут."
          svgIcon={<BellNotificationIcon color={color} />}
          interaction="toggle"
        />
      </View>
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
