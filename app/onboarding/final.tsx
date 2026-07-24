import { NotificationHelper } from "@/helpers/notification-helper";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/use-auth-store";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useTranslation } from "@/i18next/i18next";

export default function OnboardingFinalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scheme = useColorScheme();
  const { completeOnaboarding } = useAuthStore();

  const requestAllowNotification = async () => {
    const isAllowed = await NotificationHelper.allowsNotifications();
    if (!isAllowed) {
      Alert.alert("Включите уведомления, чтобы получать оповещения о ваших лекарствах.");
    }
    completeOnaboarding();
    router.navigate("/welcome");
  };

  const source =
    scheme === "dark"
      ? require("@/assets/images/onboarding-image-screen-3-dark.png")
      : require("@/assets/images/onboarding-image-screen-3.png");

  return (
    <FullScreenView>
      <View style={styles.imageWrapper}>
        <Image source={source} style={styles.image} contentFit="contain" />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="title">{t("onboarding.step4.title")}</ThemedText>
        <ThemedText type="subtitle">{t("onboarding.step4.text")}</ThemedText>
      </View>
      <CustomButton
        label={t("onboarding.step4.title")}
        style={styles.button}
        onPress={requestAllowNotification}
      />
    </FullScreenView>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: "100%",
    height: "auto",
    aspectRatio: 1 / 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "auto",
    aspectRatio: 1 / 1,
  },
  textContainer: {
    gap: 16,
  },
  button: {
    marginTop: "auto",
  },
});
