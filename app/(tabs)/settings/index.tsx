import { useAuthStore } from "@/stores/use-auth-store";
import { clearTokens } from "@/utils/tokenUtils";
import { useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import BellIcon from "@/component/icons/bell-icon";
import EyeIcon from "@/component/icons/eye-icon";
import GlobeIcon from "@/component/icons/globe-icon";
import InfoCircle from "@/component/icons/info-circle";
import LockIcon from "@/component/icons/lock-icon";
import LogoutIcon from "@/component/icons/log-out-icon";
import PeopleGroupIcon from "@/component/icons/people-group";
import SoundIcon from "@/component/icons/sound-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import SettingsCard from "@/component/ui/settings/settings-card";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserQuery } from "@/hooks/use-user-data";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import { useCallback, useRef } from "react";

const logOutMutation = async () => {
  await api.post("auth/logout");
};

export default function Settings() {
  const { t } = useTranslation();
  const isIOS = Platform.OS === "ios";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const { user } = useUserQuery();
  const { isPremiumPlan } = useSubscriptionPlanQuery();
  const profileImageUrl = useProfileImage();
  const { showFeedBack } = useFeedBackStore();

  const { setIsAuthenticated } = useAuthStore();

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  // SIGN OUT MUTATIONS
  const { isPending, mutate } = useMutation({
    mutationFn: logOutMutation,
    async onSuccess() {
      // Clear out all notifications.
      await NotificationHelper.cancelAllNotifications();
      queryClient.clear();
      clearTokens();
      setIsAuthenticated(false);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else {
          showFeedBack({
            title: t("feedback.error.general.title"),
            message: t("feedback.error.general.text"),
            status: "error",
          });
        }
        console.log("An axios error occur in sign out mutation -> ", error);
      } else {
        console.log("An unknown error occur in sign out mutation   -> ", error);
      }
    },
  });

  const navigateToReminderPreference = () => {
    if (isPremiumPlan) {
      router.navigate("/(tabs)/settings/reminders");
    } else {
      openBannerRef.current?.openModal();
    }
  };

  const openAppSettings = useCallback(async () => {
    if (Platform.OS === "android") {
      try {
        const packageName = Constants.expoConfig?.android?.package;
        await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APP_LOCALE_SETTINGS, {
          data: "package:" + packageName,
        });
      } catch {
        await Linking.openSettings();
      }
    } else {
      await Linking.openSettings();
    }
  }, []);

  const top = isIOS ? 0 : insets.top + 20;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.contentStyle}>
        <Loader visible={isPending} />
        {/* PROFILE SETTINGS ✅ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            {t("settings_screen.index_profile_label")}
          </Text>
          <SettingsCard
            title={user?.name || ""}
            description={t("settings_screen.card_profile_description")}
            interaction="press"
            avatarUrl={profileImageUrl}
            onPress={() => router.navigate("/(tabs)/settings/user-details")}
          />

          <SettingsCard
            title={t("settings_screen.card_relation_title")}
            description={t("settings_screen.card_relation_description")}
            interaction="press"
            svgIcon={<PeopleGroupIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/relations")}
          />
        </View>

        {/* NOTIFICATION & REMINDER SETTINGS ✅ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            {t("settings_screen.index_notification_label")}
          </Text>
          <SettingsCard
            title={t("settings_screen.card_notification_title")}
            description={t("settings_screen.card_notification_decription")}
            interaction="press"
            svgIcon={<BellIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/notifications")}
          />

          <SettingsCard
            title={t("settings_screen.card_reminder_title")}
            description={t("settings_screen.card_reminder_description")}
            interaction="press"
            svgIcon={<SoundIcon color={color} />}
            onPress={navigateToReminderPreference}
          />
        </View>

        {/* GENERAL SETTINGS (Subscription)  */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            {t("settings_screen.index_general_label")}
          </Text>
          <SettingsCard
            title={t("settings_screen.card_subscription_title")}
            description={t("settings_screen.card_subscription_description")}
            interaction="press"
            svgIcon={<EyeIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/subscription")}
          />
          <SettingsCard
            title={t("settings_screen.card_language_title")}
            description={t("settings_screen.card_language_description")}
            interaction="press"
            svgIcon={<GlobeIcon color={color} />}
            onPress={openAppSettings}
          />
        </View>

        {/* SECURITY SETTINGS ✅*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            {t("settings_screen.index_security_label")}
          </Text>
          <SettingsCard
            title={t("settings_screen.card_security_title")}
            description={t("settings_screen.card_security_description")}
            interaction="press"
            svgIcon={<LockIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/security")}
          />
        </View>

        {/* ABOUT US ✅ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            {t("settings_screen.index_about_label")}
          </Text>
          <SettingsCard
            title={t("settings_screen.card_about_title")}
            description={t("settings_screen.card_about_description")}
            interaction="press"
            svgIcon={<InfoCircle color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/about")}
          />
        </View>

        {/* SIGN OUT BUTTON */}
        <CustomButton
          label={t("settings_screen.index_sign_out_label")}
          variant="danger"
          svgIcon={<LogoutIcon color="#F7F7F7" />}
          onPress={() => mutate()}
        />
      </ScrollView>

      {/* SUBSCRIPTION OFFER PLAN */}
      <SubscriptionBanner ref={openBannerRef} />
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
    paddingBottom: 10,
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
