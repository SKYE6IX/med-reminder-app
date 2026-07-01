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
import Loader from "@/component/ui/loader";
import SettingsCard from "@/component/ui/settings/settings-card";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserData } from "@/hooks/use-user-data";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

const logOutMutation = async () => {
  await api.post("auth/logout");
};

export default function Settings() {
  const isIOS = Platform.OS === "ios";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const { user } = useUserData();
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
        console.log("An axios error occur in sign out mutation -> ", error);
      } else {
        console.log("An unknown error occur in sign out mutation   -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
    },
  });

  const navigateToReminderPreference = () => {
    if (isPremiumPlan) {
      router.navigate("/(tabs)/settings/reminders");
    } else {
      openBannerRef.current?.openModal();
    }
  };

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
          <Text style={[styles.sectionTitle, { color }]}>Профиль</Text>
          <SettingsCard
            title={user?.name || ""}
            description="Посмотреть профиль"
            interaction="press"
            avatarUrl={profileImageUrl}
            onPress={() => router.navigate("/(tabs)/settings/user-details")}
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
          <Text style={[styles.sectionTitle, { color }]}>Уведомления и напоминания</Text>
          <SettingsCard
            title="Настройки уведомлений"
            description="Измените звук и видимость уведомлений"
            interaction="press"
            svgIcon={<BellIcon color={color} />}
            onPress={() => router.navigate("/(tabs)/settings/notifications")}
          />

          <SettingsCard
            title="Настройки напоминаний"
            description="Измените повторы и дополнительные напоминания"
            interaction="press"
            svgIcon={<SoundIcon color={color} />}
            onPress={navigateToReminderPreference}
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
