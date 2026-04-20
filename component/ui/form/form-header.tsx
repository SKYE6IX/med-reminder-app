import { ThemedText } from "@/component/themed-text/themed-text";
import { StyleSheet, View } from "react-native";

type FormHeaderProps = {
  title: string;
  subTitle: string;
};

export default function FormHeader({ title, subTitle }: FormHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.subTitle} type="subtitle">
        {subTitle}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
  },
  subTitle: {
    textAlign: "left",
    fontSize: 14,
  },
});
