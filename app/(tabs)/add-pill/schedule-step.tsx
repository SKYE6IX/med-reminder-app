import CustomLink from "@/component/ui/custom-link/custom-link";
import { StyleSheet, Text, View } from "react-native";

export default function ScheduleStepScreen() {
  return (
    <View style={styles.container}>
      <Text>Schedule Step</Text>
      <CustomLink href="/add-pill/final-step" label="Go Final" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 150,
  },
});
