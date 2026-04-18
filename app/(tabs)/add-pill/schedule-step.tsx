import PlusIcon from "@/component/icons/plus-icon";
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
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
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
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Частота</Text>
          <FrequencySettings />
        </View>

        {/* Dosage Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Дозировка</Text>
          <DosageSettings />
        </View>

        {/* Time Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Время приема</Text>
          <View style={styles.timeSettingList}>
            <Text
              style={[styles.selectedTime, { backgroundColor: bGColor, color }]}
            >
              08:00
            </Text>
            <Text
              style={[styles.selectedTime, { backgroundColor: bGColor, color }]}
            >
              12:00
            </Text>
            <Text
              style={[styles.selectedTime, { backgroundColor: bGColor, color }]}
            >
              18:00
            </Text>
          </View>

          <CustomButton
            label="Установить время начала"
            variant="outline"
            textVaraint="tintText"
            svgIcon={<PlusIcon color={tintColor} size={14} />}
          />
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
  timeSettingList: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  selectedTime: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
  },
});
