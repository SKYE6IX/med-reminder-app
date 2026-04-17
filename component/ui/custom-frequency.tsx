import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SelectionDot from "./selection-dot";

type CustomFrequencyProps = {
  isSelected: boolean;
  handleSelection: (value: string) => void;
};

type Unit = "HOUR" | "DAY";

// TODO:
// Control the height for android. The trick used in IOS isn't working so we can
// 1. Use opacitiy to hide the tigger button for the picker.
// 2. Set the default height to 60, no need for hidden text.
// 3. Turn on the opacity back and increase the height.

export default function CustomFrequency({
  isSelected,
  handleSelection,
}: CustomFrequencyProps) {
  const countPicker = useRef<Picker<number>>(null);
  const unitPicker = useRef<Picker<Unit>>(null);

  const [frequencyCount, setFrequencyCount] = useState<number>(1);
  const [frequencyUnit, setFrequencyUnit] = useState<Unit>("HOUR");

  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  return (
    <View
      style={[
        styles.container,
        {
          borderWidth: isSelected ? undefined : 1,
          borderColor,
          backgroundColor: isSelected ? tintColor : bGColor,
        },
      ]}
    >
      {/* Button trigger */}
      <Pressable
        style={styles.customFrequencyPressable}
        onPress={() => handleSelection("CUSTOM-FREQ")}
      >
        <Text
          style={[
            styles.customFrequencyPressableText,
            { color: isSelected ? "#F7F7F7" : color },
          ]}
        >
          Своя частота
        </Text>
        <SelectionDot isActive={isSelected} />
      </Pressable>

      {/* Custom settings */}
      <View style={styles.customFrequencyChoiceContainer}>
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
              {frequencyUnit === "HOUR" ? "Часа" : "Дня"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Count Picker */}
      <Picker
        ref={countPicker}
        selectedValue={frequencyCount}
        onValueChange={(itemValue) => setFrequencyCount(itemValue as number)}
        mode="dropdown"
        style={{
          opacity: 0,
          height: 0,
          pointerEvents: "none",
        }}
        // onFocus={() => setIsSelectionVisible(true)}
        // onBlur={() => setIsSelectionVisible(false)}
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

      <Picker
        ref={unitPicker}
        selectedValue={frequencyUnit}
        onValueChange={(itemValue) => setFrequencyUnit(itemValue as Unit)}
        mode="dropdown"
        style={{
          opacity: 0,
          height: 0,
          pointerEvents: "none",
        }}
        // onFocus={() => setIsSelectionVisible(true)}
        // onBlur={() => setIsSelectionVisible(false)}
        itemStyle={{
          fontFamily: "Roboto_400Regular",
          fontSize: 16,
          lineHeight: 19.2,
          color,
        }}
      >
        <Picker.Item label="Часа" value="HOUR" />
        <Picker.Item label="Дня" value="DAY" />
      </Picker>
    </View>
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
