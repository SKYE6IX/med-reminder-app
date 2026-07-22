import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { FullScreenView } from "@/component/full-screen-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";

export default function OnboardingFirstScreen() {
  return (
    <FullScreenView>
      <Image
        source={require("@/assets/images/onboarding-image-screen-1.png")}
        style={styles.image}
        contentPosition="top center"
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title">Ваше здоровье - в Ваших руках</ThemedText>
        <ThemedText type="subtitle">
          Возьмите под контроль свое самочувствие с помощью простых напоминаний о приеме лекарств.
        </ThemedText>
      </View>
      <CustomLink label="Дальше" href="/onboarding/second" style={styles.link} />
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
