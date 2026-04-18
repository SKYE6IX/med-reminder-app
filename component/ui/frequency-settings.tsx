import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomFrequency from "./custom-frequency";
import SelectionDot from "./selection-dot";

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

export default function FrequencySettings() {
  const [selectedFreq, setSelectedFreq] = useState("ONCE-A-DAY");

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const handleSetSelectedFreq = (value: string) => {
    setSelectedFreq(value);
  };

  return (
    <View style={styles.frequencyContainer}>
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
  );
}

const styles = StyleSheet.create({
  frequencyContainer: {
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
});
