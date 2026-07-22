import { NotificationHelper } from "@/helpers/notification-helper";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/use-auth-store";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";

export default function OnboardingFinalScreen() {
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
        <ThemedText type="title">Разрешить уведомления</ThemedText>
        <ThemedText type="subtitle">
          Уведомления будут приходить согласно вашим настройкам.
        </ThemedText>
      </View>
      <CustomButton
        label="Разрешить уведомление"
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
