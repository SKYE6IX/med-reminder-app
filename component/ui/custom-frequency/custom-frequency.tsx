import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import SelectionDot from "../selection-dot";
import { useCustomFreqStyles } from "./shared-styles";
import { CustomFrequencyProps, TCustomFrequency, Unit } from "./types";

// How many time per day -> Which will be used to generate hour.
// So if user chose every 3 hours and 2 times per day.
// We will the two time to create two time start from 9. but no more than 23:59

// When user choose Day interval, we have to show how many time per each of those days
// But this time we need to also show them to choose a time interval in whcih they need to
// take each pills on each of if their pills.

const DEFAULT_VALUE: TCustomFrequency = {
  label: "Своя частота",
  rrule: "",
  value: "CUSTOM_RULES",
};

export default function CustomFrequency({
  isSelected,
  handleSelection,
  onCustomValueSet,
}: CustomFrequencyProps) {
  const sharedStyles = useCustomFreqStyles();
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
        sharedStyles.container,
        styles.container,
        {
          height: "auto",
          borderWidth: isSelected ? undefined : 1,
          borderColor,
          backgroundColor: isSelected ? tintColor : bGColor,
        },
      ]}
    >
      {/* Selection button */}
      <Pressable
        style={sharedStyles.frequencyPressable}
        onPress={() => handleSelection(DEFAULT_VALUE)}
      >
        <Text
          style={[sharedStyles.frequencyPressableText, { color: isSelected ? "#F7F7F7" : color }]}
        >
          {DEFAULT_VALUE.label}
        </Text>
        <SelectionDot isActive={isSelected} />
      </Pressable>

      {/* Custom settings */}
      <Animated.View style={[sharedStyles.opitonsContainer, { opacity: settingsViewOpacity }]}>
        <Text style={sharedStyles.optionsLabel}>Каждые</Text>

        <View style={sharedStyles.optionsGroup}>
          <Pressable
            style={[sharedStyles.optionsGroupItem, { width: 50 }]}
            onPress={() => countPicker.current?.focus()}
          >
            <Text style={sharedStyles.groupItemValue}>{frequencyCount}</Text>
          </Pressable>

          <Pressable
            style={sharedStyles.optionsGroupItem}
            onPress={() => unitPicker.current?.focus()}
          >
            <Text style={sharedStyles.groupItemValue}>
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
    height: 100,
  },
});
