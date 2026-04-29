import ChatStartIcon from "@/component/icons/chat-start-icon";
import PhoneCallIcon from "@/component/icons/phone-call-icon";
import SettingsCard from "@/component/ui/settings-card/settings-card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function About() {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  const source =
    scheme === "dark"
      ? require("@/assets/icons/app-logo-dark.png")
      : require("@/assets/icons/app-logo.png");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <View style={styles.header}>
          <View style={styles.appLogoWrapper}>
            <Image source={source} style={styles.appLogo} />
          </View>
          <Text style={[styles.appTitle, { color }]}>MedRemindR</Text>
        </View>

        <View style={[styles.versionWrapper, { backgroundColor: bgSecondary, borderColor }]}>
          <Text style={[styles.versionLabel, { color }]}>Версия</Text>
          <Text style={[styles.versionValue, { color: mutedColor }]}>40.10.2</Text>
        </View>

        <View style={styles.sectionGroup}>
          <SettingsCard
            title="Оцените приложение"
            description="Оставьте отзыв в App Store"
            svgIcon={<ChatStartIcon color={color} />}
            interaction="press"
          />

          <SettingsCard
            title="Связаться с нами"
            description="Свяжитесь с нами по электронной почте"
            svgIcon={<PhoneCallIcon color={color} />}
            interaction="press"
          />
        </View>
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
    gap: 32,
  },
  header: {
    alignItems: "center",
    gap: 14,
  },
  appLogoWrapper: {
    width: 120,
    height: 120,
  },
  appLogo: {
    width: "100%",
    height: "100%",
  },
  appTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
  },
  versionWrapper: {
    height: 48,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  versionLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },
  versionValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  sectionGroup: {
    gap: 16,
  },
});
