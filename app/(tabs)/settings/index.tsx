import { useAuthStore } from "@/stores/use-auth-store";
import { clearTokens } from "@/utils/tokenUtils";
import { useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import BellIcon from "@/component/icons/bell-icon";
import EyeIcon from "@/component/icons/eye-icon";
import InfoCircle from "@/component/icons/info-circle";
import LockIcon from "@/component/icons/lock-icon";
import LogoutIcon from "@/component/icons/log-out-icon";
import PeopleGroupIcon from "@/component/icons/people-group";
import SoundIcon from "@/component/icons/sound-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import SettingsCard from "@/component/ui/settings-card/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";

import { useUserData } from "@/hooks/use-user-data";

export default function Settings() {
  const { user } = useUserData();

  const isIOS = Platform.OS === "ios";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setIsAuthenticated } = useAuthStore();
  const logoutUser = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          styles.contentStyle,
          { paddingTop: !isIOS ? insets.top : undefined, paddingBottom: 10 },
        ]}
      >
        {/* PROFILE SETTINGS ✅ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Профиль</Text>
          <SettingsCard
            title={user?.name || ""}
            description="Посмотреть профиль"
            interaction="press"
            avatarUrl="url"
            onPress={() => router.navigate("/(tabs)/settings/profile")}
          />

          <SettingsCard
            title="Моя семья"
            description="Управление данными семьи"
            interaction="press"
            svgIcon={<PeopleGroupIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/relations")}
          />
        </View>

        {/* NOTIFICATION & REMINDER SETTINGS ✅ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Напоминания и оповещения</Text>
          <SettingsCard
            title="Настройки уведомлений"
            description="Включите или выключите уведомления"
            interaction="press"
            svgIcon={<BellIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/notifications")}
          />
          <SettingsCard
            title="Настройки напоминаний"
            description="Выберите звук для напоминаний о приёме лекарств"
            interaction="press"
            svgIcon={<SoundIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/reminders")}
          />
        </View>

        {/* GENERAL SETTINGS (Subscription)  */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Общие</Text>
          <SettingsCard
            title="Подписки"
            description="Управление подпиской"
            interaction="press"
            svgIcon={<EyeIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/subscription")}
          />
        </View>

        {/* SECURITY SETTINGS ✅*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Безопасность</Text>
          <SettingsCard
            title="Приватность и безопасность"
            description="Управляйте паролями и безопасностью приложения"
            interaction="press"
            svgIcon={<LockIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/security")}
          />
        </View>

        {/* ABOUT US ✅ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>О нас</Text>
          <SettingsCard
            title="О нас"
            description="Узнайте больше о приложении и его версии"
            interaction="press"
            svgIcon={<InfoCircle color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/about")}
          />
        </View>
        {/* SIGN OUT BUTTON */}
        <CustomButton
          label="Выйти"
          variant="danger"
          svgIcon={<LogoutIcon color="#F7F7F7" />}
          onPress={logoutUser}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 21,
  },
});
