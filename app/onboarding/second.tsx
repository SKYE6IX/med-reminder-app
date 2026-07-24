import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";
import { useTranslation } from "@/i18next/i18next";

export default function OnboardingSecondScreen() {
  const { t } = useTranslation();
  return (
    <FullScreenView>
      <Image
        source={require("@/assets/images/onboarding-image-screen-2.png")}
        style={styles.image}
        contentPosition="top center"
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title">{t("onboarding.step2.title")}</ThemedText>
        <ThemedText type="subtitle">{t("onboarding.step2.text")}</ThemedText>
      </View>
      <CustomLink label={t("common.next")} href="/onboarding/third" style={styles.link} />
    </FullScreenView>
  );
}

const styles = StyleSheet.create({
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
