import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";
import { useTranslation } from "@/i18next/i18next";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function OnboardingFirstScreen() {
  const { t } = useTranslation();
  return (
    <FullScreenView>
      <Image
        source={require("@/assets/images/onboarding-image-screen-1.png")}
        style={styles.image}
        contentPosition="top center"
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title">{t("onboarding.step1.title")}</ThemedText>
        <ThemedText type="subtitle">{t("onboarding.step1.text")}</ThemedText>
      </View>
      <CustomLink label={t("common.next")} href="/onboarding/second" style={styles.link} />
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
