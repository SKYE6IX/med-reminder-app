import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { OnboardingView } from "@/component/onboarding-view";
import { ThemedText } from "@/component/themed-text/themed-text";
import CustomLink from "@/component/ui/custom-link/custom-link";

export default function OnboardingFirstScreen() {
  return (
    <OnboardingView>
      <Image
        source={require("@/assets/images/onboarding-image-screen-1.png")}
        style={styles.image}
        contentPosition="top center"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title">Ваше здоровье - в Ваших руках</ThemedText>
        <ThemedText type="subtitle">
          Возьмите под контроль свое самочувствие с помощью простых напоминаний о приеме лекарств.
        </ThemedText>
      </View>
      <CustomLink label="Дальше" href="/onboarding/second" style={styles.link} />
    </OnboardingView>
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
