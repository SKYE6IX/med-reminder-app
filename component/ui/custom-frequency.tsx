import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { Frequency } from "./frequency-settings";
import SelectionDot from "./selection-dot";

export type Unit = "HOURLY" | "DAILY";

export type CustomFrequencyProps = {
  isSelected: boolean;
  handleSelection: (freq: Frequency) => void;
  onCustomValueSet: ({ count, unit }: { count: number; unit: Unit }) => void;
};

const DEFAULT_VALUE: Frequency = {
  label: "Своя частота",
  rrule: "",
  value: "CUSTOM_RULES",
};

export default function CustomFrequency({
  isSelected,
  handleSelection,
  onCustomValueSet,
}: CustomFrequencyProps) {
  const countPicker = useRef<Picker<number>>(null);
  const unitPicker = useRef<Picker<Unit>>(null);

  const [frequencyCount, setFrequencyCount] = useState<number>(3);
  const [frequencyUnit, setFrequencyUnit] = useState<Unit>("HOURLY");

  const height = useSharedValue(60);
  const settingsViewOpacity = useSharedValue(0);

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    height.value = withSpring(isSelected ? 100 : 60);
    settingsViewOpacity.value = withSpring(isSelected ? 1 : 0, {
      duration: 100,
    });
  }, [height, isSelected, settingsViewOpacity]);

  const handleSetFreqCount = (count: number) => {
    setFrequencyCount(count);
    onCustomValueSet({ count, unit: frequencyUnit });
  };

  const handleSetFreqUnit = (unit: Unit) => {
    setFrequencyUnit(unit);
    onCustomValueSet({ count: frequencyCount, unit });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height,
          borderWidth: isSelected ? undefined : 1,
          borderColor,
          backgroundColor: isSelected ? tintColor : bGColor,
        },
      ]}
    >
      {/* Selection button */}
      <Pressable
        style={styles.customFrequencyPressable}
        onPress={() => handleSelection(DEFAULT_VALUE)}
      >
        <Text
          style={[
            styles.customFrequencyPressableText,
            { color: isSelected ? "#F7F7F7" : color },
          ]}
        >
          {DEFAULT_VALUE.label}
        </Text>
        <SelectionDot isActive={isSelected} />
      </Pressable>

      {/* Custom settings */}
      <Animated.View
        style={[
          styles.customFrequencyChoiceContainer,
          { opacity: settingsViewOpacity },
        ]}
      >
        <Text style={styles.customFrequencySelectionLabel}>Каждые</Text>

        <View style={styles.customFrequencySelectionGroup}>
          <Pressable
            style={[styles.customFrequencySelection, { width: 50 }]}
            onPress={() => countPicker.current?.focus()}
          >
            <Text style={styles.customFrequencySelectionValue}>
              {frequencyCount}
            </Text>
          </Pressable>

          <Pressable
            style={styles.customFrequencySelection}
            onPress={() => unitPicker.current?.focus()}
          >
            <Text style={styles.customFrequencySelectionValue}>
              {frequencyUnit === "HOURLY" ? "Часа" : "Дня"}
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Count Picker */}
      <Picker
        ref={countPicker}
        selectedValue={frequencyCount}
        onValueChange={(itemValue) => handleSetFreqCount(itemValue as number)}
        mode="dropdown"
        style={{
          opacity: 0,
          height: 0,
          pointerEvents: "none",
        }}
        itemStyle={{
          fontFamily: "Roboto_400Regular",
          fontSize: 16,
          lineHeight: 19.2,
          color,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
      </Picker>

      {/* Unit Picker */}
      <Picker
        ref={unitPicker}
        selectedValue={frequencyUnit}
        onValueChange={(itemValue) => handleSetFreqUnit(itemValue as Unit)}
        mode="dropdown"
        style={{
          opacity: 0,
          height: 0,
          pointerEvents: "none",
        }}
        itemStyle={{
          fontFamily: "Roboto_400Regular",
          fontSize: 16,
          lineHeight: 19.2,
          color,
        }}
      >
        <Picker.Item label="Часа" value="HOURLY" />
        <Picker.Item label="Дня" value="DAILY" />
      </Picker>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    height: 100,
  },
  customFrequencyPressable: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  customFrequencyPressableText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  customFrequencyChoiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  customFrequencySelectionLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    color: "#F7F7F7",
  },
  customFrequencySelectionGroup: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customFrequencySelection: {
    width: 70,
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    backgroundColor: "#FFFFFF33",
  },
  customFrequencySelectionValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
    color: "#F7F7F7",
  },
});
