import BellOnIcon from "@/component/icons/bell-on-icon";
import LockverifiedIcon from "@/component/icons/lock-verified-icon";
import PhoneIcon from "@/component/icons/phone-icon";
import SignalIcon from "@/component/icons/signal-icon";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Notifications() {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <SettingsCard
          title="Звук уведомления"
          description="Изменить звук уведомлений"
          svgIcon={<BellOnIcon color={color} />}
          interaction="press"
        />

        <SettingsCard
          title="Уведомления приложения"
          description="Получать уведомления приложения"
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
        />

        <SettingsCard
          title="Вибрация"
          description="Устройство вибрирует, когда подходит  напоминание"
          svgIcon={<SignalIcon color={color} />}
          interaction="toggle"
        />

        <SettingsCard
          title="Показывать на экране блокировки"
          description="Показывать напоминания о лекарствах на экране блокировки"
          svgIcon={<LockverifiedIcon color={color} />}
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
