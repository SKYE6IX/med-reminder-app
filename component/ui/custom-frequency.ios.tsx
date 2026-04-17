import { useThemeColor } from "@/hooks/use-theme-color";
import { PickerIOS } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import SelectionDot from "./selection-dot";

type CustomFrequencyProps = {
  isSelected: boolean;
  handleSelection: (value: string) => void;
};

type Unit = "HOUR" | "DAY";

export default function CustomFrequency({
  isSelected,
  handleSelection,
}: CustomFrequencyProps) {
  const [showPicker, setShowPicker] = useState<"count" | "unit" | undefined>(
    undefined,
  );
  const [frequencyCount, setFrequencyCount] = useState<number>(1);
  const [frequencyUnit, setFrequencyUnit] = useState<Unit>("HOUR");

  const height = useSharedValue(60);

  //   Themes
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    height.value =
      isSelected && showPicker
        ? withSpring(290)
        : isSelected
          ? withSpring(100)
          : withSpring(60);
  }, [isSelected, height, showPicker]);

  const handleShowPick = (picker: "count" | "unit") => {
    if (showPicker === picker) {
      setShowPicker(undefined);
    } else {
      setShowPicker(picker);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderWidth: isSelected ? undefined : 1,
          borderColor,
          height,
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
            onPress={() => handleShowPick("count")}
          >
            <Text style={styles.customFrequencySelectionValue}>
              {frequencyCount}
            </Text>
          </Pressable>

          <Pressable
            style={styles.customFrequencySelection}
            onPress={() => handleShowPick("unit")}
          >
            <Text style={styles.customFrequencySelectionValue}>
              {frequencyUnit === "HOUR" ? "Часа" : "Дня"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View>
        {showPicker === "count" && (
          <PickerIOS
            selectedValue={frequencyCount}
            onValueChange={(itemValue) =>
              setFrequencyCount(itemValue as number)
            }
            style={{
              borderTopWidth: 1,
              borderColor,
            }}
            itemStyle={{
              fontFamily: "Roboto_400Regular",
              fontSize: 20,
              lineHeight: 24,
              color: "#F7F7F7",
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <PickerIOS.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </PickerIOS>
        )}

        {showPicker === "unit" && (
          <PickerIOS
            selectedValue={frequencyUnit}
            onValueChange={(itemValue) => setFrequencyUnit(itemValue as Unit)}
            style={{
              borderTopWidth: 1,
              borderColor,
            }}
            itemStyle={{
              fontFamily: "Roboto_400Regular",
              fontSize: 20,
              lineHeight: 24,
              color: "#F7F7F7",
            }}
          >
            <PickerIOS.Item label="Часа" value="HOUR" />
            <PickerIOS.Item label="Дня" value="DAY" />
          </PickerIOS>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    overflow: "hidden",
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
