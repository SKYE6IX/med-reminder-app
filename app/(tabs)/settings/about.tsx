import ChatStartIcon from "@/component/icons/chat-start-icon";
import PhoneCallIcon from "@/component/icons/phone-call-icon";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import * as Application from "expo-application";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import * as StoreReview from "expo-store-review";
import { useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function About() {
  const { t } = useTranslation();
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const applicationVersion = Application.nativeApplicationVersion;

  const storeName = isIOS ? "App Store" : "Play Store";

  const source =
    scheme === "dark"
      ? require("@/assets/icons/app-logo-dark.png")
      : require("@/assets/icons/app-logo.png");

  const requestAReview = useCallback(async () => {
    const isAllowed = await StoreReview.isAvailableAsync();
    if (!isAllowed) {
      console.log("Unable to leave a review now");
      return;
    }
    await StoreReview.requestReview();
  }, []);

  const openEmail = useCallback(async () => {
    const url = `mailto:${process.env.EXPO_PUBLIC_DEVELOPER_EMAIL}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, []);

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  const top = isIOS ? insets.top + 10 : insets.top + 20;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary, paddingTop: top }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.appLogoWrapper}>
            <Image source={source} style={styles.appLogo} />
          </View>
          <Text style={[styles.appTitle, { color }]}>MedRemindR</Text>
        </View>

        <View style={[styles.versionWrapper, { backgroundColor: bgSecondary, borderColor }]}>
          <Text style={[styles.versionLabel, { color }]}>
            {t("settings_screen.about_version_label")}
          </Text>
          <Text style={[styles.versionValue, { color: mutedColor }]}>{applicationVersion}</Text>
        </View>

        <View style={styles.sectionGroup}>
          <SettingsCard
            title={t("settings_screen.about_review_title")}
            description={t("settings_screen.about_review_description", { store: storeName })}
            svgIcon={<ChatStartIcon color={color} />}
            interaction="press"
            onPress={requestAReview}
          />

          <SettingsCard
            title={t("settings_screen.about_support_title")}
            description={t("settings_screen.about_support_description")}
            svgIcon={<PhoneCallIcon color={color} />}
            interaction="press"
            onPress={openEmail}
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
