import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import CustomFrequency from "@/component/ui/custom-frequency";
import DosageSettings from "@/component/ui/dosage-settings";
import SelectionDot from "@/component/ui/selection-dot";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const FREQUENCIES = [
  {
    label: "Один раз в день",
    info: "Каждые 24 часа",
    value: "ONCE-A-DAY",
    id: 1,
  },
  {
    label: "Два раза в день",
    info: "Каждые 12 часов",
    value: "TWICE-A-DAY",
    id: 2,
  },
  {
    label: "Три раза в день",
    info: "Каждые 8 часов",
    value: "THREE-TIMES-A-DAY",
    id: 3,
  },
];

export default function ScheduleStepScreen() {
  const [selectedFreq, setSelectedFreq] = useState("ONCE-A-DAY");

  const sharedStyles = useAddPillScreenStyles();
  const router = useRouter();

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const handleSetSelectedFreq = (value: string) => {
    setSelectedFreq(value);
  };

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
          <View style={styles.frequencyWrapper}>
            {FREQUENCIES.map((freq) => {
              const isActive = freq.value === selectedFreq;
              return (
                <Pressable
                  key={freq.id}
                  style={[
                    styles.frequencyPressable,
                    {
                      borderColor,
                      borderWidth: isActive ? undefined : 1,
                      backgroundColor: isActive ? tintColor : bGColor,
                    },
                  ]}
                  onPress={() => handleSetSelectedFreq(freq.value)}
                >
                  <View style={styles.frequencyTextWrapper}>
                    <Text
                      style={[
                        styles.frequencyTextTitle,
                        { color: isActive ? "#F7F7F7" : color },
                      ]}
                    >
                      {freq.label}
                    </Text>
                    <Text
                      style={[
                        styles.frequencyTextSubtitle,
                        { color: isActive ? "#F7F7F7" : color },
                      ]}
                    >
                      {freq.info}
                    </Text>
                  </View>
                  <SelectionDot isActive={isActive} />
                </Pressable>
              );
            })}
            <CustomFrequency
              isSelected={selectedFreq === "CUSTOM-FREQ"}
              handleSelection={handleSetSelectedFreq}
            />
          </View>
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
  frequencyWrapper: {
    gap: 8,
  },
  frequencyPressable: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
  },
  frequencyTextWrapper: {
    gap: 8,
  },
  frequencyTextTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  frequencyTextSubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },

  dosageSettingContainer: {
    gap: 16,
  },
});
