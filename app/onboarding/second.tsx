import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";

export default function OnboardingSecondScreen() {
  return (
    <FullScreenView>
      <Image
        source={require("@/assets/images/onboarding-image-screen-2.png")}
        style={styles.image}
        contentPosition="top center"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title">Умные напоминания, простой контроль лекрств</ThemedText>
        <ThemedText type="subtitle">
          Следуйте графику спокойно и без лишних усилий — вы больше не пропустите приём лекарства.
        </ThemedText>
      </View>
      <CustomLink label="Дальше" href="/onboarding/third" style={styles.link} />
    </FullScreenView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 360,
    height: 400,
  },
  textContainer: {
    gap: 16,
  },
  link: {
    marginTop: "auto",
  },
});
