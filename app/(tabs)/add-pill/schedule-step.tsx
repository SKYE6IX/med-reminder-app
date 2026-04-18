import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import DosageSettings from "@/component/ui/dosage-settings";
import FrequencySettings from "@/component/ui/frequency-settings";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ScheduleStepScreen() {
  const sharedStyles = useAddPillScreenStyles();
  const router = useRouter();

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  return (
    <View
      style={[
        styles.container,
        sharedStyles.container,
        // Needed to reset the padding and transfer it to the scrollView
        { paddingLeft: 0, paddingRight: 0 },
      ]}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Frequency Settings */}
        <View style={styles.frequencyContainer}>
          <Text style={sharedStyles.title}>Частота</Text>
          <FrequencySettings />
        </View>

        {/* Dosage Settings */}
        <View style={styles.dosageSettingContainer}>
          <Text style={sharedStyles.title}>Дозировка</Text>
          <DosageSettings />
        </View>

        <CustomButton
          label="Далее"
          style={sharedStyles.button}
          variant="disabled"
          textVaraint="mutedText"
          onPress={() => router.navigate("/(tabs)/add-pill/final-step")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: 32,
    paddingLeft: 20,
    paddingRight: 20,
  },
  frequencyContainer: {
    gap: 16,
  },
  dosageSettingContainer: {
    gap: 16,
  },
});
