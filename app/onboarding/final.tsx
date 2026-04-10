import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { useAuthStore } from "@/hooks/use-auth-store";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { OnboardingView } from "@/component/onboadring-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";

// TODO:
// 1. Set up notification access for push notification;

export default function OnboardingFinalScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const { completeOnaboarding } = useAuthStore();

  const handleCompleteOnboarding = () => {
    completeOnaboarding();
    router.navigate("/welcome");
  };

  const source =
    scheme === "dark"
      ? require("@/assets/images/onboarding-image-screen-3-dark.png")
      : require("@/assets/images/onboarding-image-screen-3.png");

  return (
    <OnboardingView>
      <View style={styles.imageWrapper}>
        <Image source={source} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="title">Разрешить уведомления</ThemedText>
        <ThemedText type="subtitle">
          Уведомления будут приходить согласно вашим настройкам.
        </ThemedText>
      </View>
      <CustomButton
        label="Дальше"
        style={styles.button}
        onPress={handleCompleteOnboarding}
      />
    </OnboardingView>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: 360,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 313,
    height: 313,
  },
  textContainer: {
    gap: 16,
  },
  button: {
    marginTop: "auto",
  },
});
