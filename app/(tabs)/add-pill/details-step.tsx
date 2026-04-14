import CustomLink from "@/component/ui/custom-link/custom-link";
import { StyleSheet, Text, View } from "react-native";

export default function DetailsStepScreen() {
  return (
    <View style={styles.container}>
      <Text>Details Step</Text>
      <CustomLink label="To details" href="/add-pill/schedule-step" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 150,
  },
});
