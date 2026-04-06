import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { OnboardingView } from "@/component/onboadring-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";

export default function OnboardingThirdscreen() {
  const scheme = useColorScheme();

  const source =
    scheme === "dark"
      ? require("@/assets/images/onboarding-image-screen-4-dark.png")
      : require("@/assets/images/onboarding-image-screen-4.png");

  return (
    <OnboardingView>
      <View style={styles.imageWrapper}>
        <Image source={source} style={styles.image} />
      </View>

      <View style={styles.textContainer}>
        <ThemedText type="title">Для Вас и Вашей семьи</ThemedText>
        <ThemedText type="subtitle">
          Легко управляйте приёмом лекарств для всех, о ком вы заботитесь.
        </ThemedText>
      </View>

      <CustomLink label="Дальше" href="/onboarding/final" style={styles.link} />
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
  link: {
    marginTop: "auto",
  },
});
