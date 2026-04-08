import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { OnboardingView } from "@/component/onboadring-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function WelcomeScreen() {
  const scheme = useColorScheme();

  const appNameColor = scheme === "dark" ? "#1E6EF4" : "#1256DB";

  const source =
    scheme === "dark"
      ? require("@/assets/icons/app-logo-dark.png")
      : require("@/assets/icons/app-logo.png");

  return (
    <OnboardingView>
      <View style={styles.container}>
        <Image source={source} style={styles.image} />

        <ThemedText type="title" style={[{ color: appNameColor }, styles.text]}>
          MedRemindR
        </ThemedText>
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="title">
          Контролируйте прием Ваших лекарств просто
        </ThemedText>
        <ThemedText type="subtitle">
          Все ваши таблетки в одном месте.
        </ThemedText>
      </View>

      <View style={styles.linkWrapper}>
        <CustomLink label="Создать аккаунт" href="/create-account" />
        <CustomLink
          label="Войти в аккаунт"
          href="/sign-in"
          variant="outline"
          textVaraint="mutedText"
        />
      </View>
    </OnboardingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 60,
  },
  text: {
    fontSize: 46,
    lineHeight: 55.2,
  },
  image: {
    width: 180,
    height: 180,
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
