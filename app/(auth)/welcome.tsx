import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/i18next/i18next";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();

  const appNameColor = scheme === "dark" ? "#1E6EF4" : "#1256DB";

  const source =
    scheme === "dark"
      ? require("@/assets/icons/app-logo-dark.png")
      : require("@/assets/icons/app-logo.png");

  return (
    <FullScreenView>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image source={source} style={styles.image} contentFit="cover" />
        </View>
        <Text style={[styles.text, { color: appNameColor }]}>MedRemindR</Text>
      </View>

      <View style={styles.textContainer}>
        <ThemedText type="title">{t("welcome_screen.heading")}</ThemedText>
        <ThemedText type="subtitle">{t("welcome_screen.text")}</ThemedText>
      </View>

      <View style={styles.linkWrapper}>
        <CustomLink label={t("welcome_screen.create_account_btn")} href="/create-account" />
        <CustomLink
          label={t("welcome_screen.sign_in_btn")}
          href="/sign-in"
          variant="outline"
          textVaraint="tintText"
        />
      </View>
    </FullScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 60,
    width: "100%",
  },
  text: {
    width: "100%",
    fontFamily: "Roboto_600SemiBold",
    fontSize: 46,
    lineHeight: 55.2,
    textAlign: "center",
  },
  imageWrapper: {
    width: 180,
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    gap: 16,
  },
  linkWrapper: {
    width: "100%",
    gap: 16,
    marginTop: "auto",
  },
});
