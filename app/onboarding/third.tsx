import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";
import { useTranslation } from "@/i18next/i18next";

export default function OnboardingThirdscreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();

  const source =
    scheme === "dark"
      ? require("@/assets/images/onboarding-image-screen-4-dark.png")
      : require("@/assets/images/onboarding-image-screen-4.png");

  return (
    <FullScreenView>
      <View style={styles.imageWrapper}>
        <Image source={source} style={styles.image} contentFit="contain" />
      </View>

      <View style={styles.textContainer}>
        <ThemedText type="title">{t("onboarding.step3.title")}</ThemedText>
        <ThemedText type="subtitle">{t("onboarding.step3.text")}</ThemedText>
      </View>

      <CustomLink label={t("common.next")} href="/onboarding/final" style={styles.link} />
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
  link: {
    marginTop: "auto",
  },
});
