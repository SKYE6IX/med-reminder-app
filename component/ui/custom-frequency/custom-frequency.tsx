import { HOUR_INTERVAL_OPTION, REPEAT_OPTIONS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import SelectionDot from "../selection-dot";
import { DEFAULT_VALUE, getOptionsValueLabel, getUnitValueLabel, HEIGHT } from "./helper";
import { useCustomFreqStyles } from "./shared-styles";
import { CustomFrequencyProps, CustomState, Unit } from "./types";

export default function CustomFrequency({
  isSelected,
  handleSelection,
  onCustomValueSet,
}: CustomFrequencyProps) {
  const sharedStyles = useCustomFreqStyles();

  // Picker Refs
  const countPicker = useRef<Picker<number>>(null);
  const unitPicker = useRef<Picker<Unit>>(null);
  const repeatOptionPicker = useRef<Picker<number>>(null);
  const hourIntervalPicker = useRef<Picker<number>>(null);

  const [customState, setCustomState] = useState<CustomState>({
    showPicker: undefined,
    frequencyCount: 3,
    frequencyUnit: "HOURLY",
    repeatOption: 3,
    hourIntervalOpiton: 3,
  });

  const isDailyFreqUnit = customState.frequencyUnit === "DAILY";

  const height = useSharedValue(HEIGHT.COLLAPSED);
  const optionsContainerOpacity = useSharedValue(0);

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const newHeight = useMemo(() => {
    if (isSelected && !isDailyFreqUnit) {
      return HEIGHT.EXPANDED.BASE;
    } else if (isSelected && isDailyFreqUnit) {
      return HEIGHT.EXPANDED.EXTRA;
    } else {
      return HEIGHT.COLLAPSED;
    }
  }, [isDailyFreqUnit, isSelected]);

  useEffect(() => {
    height.value = withSpring(newHeight, { duration: 400 });
    optionsContainerOpacity.value = withDelay(
      isSelected ? 150 : 0,
      withSpring(isSelected ? 1 : 0, { duration: 300 }),
    );
  }, [height, isSelected, newHeight, optionsContainerOpacity]);

  const handleSetFreqCount = (count: number) => {
    setCustomState((prvState) => ({ ...prvState, frequencyCount: count }));
    onCustomValueSet({ count: Number(count), unit: customState.frequencyUnit });
  };

  const handleSetFreqUnit = (unit: Unit) => {
    setCustomState((prvState) => ({ ...prvState, frequencyUnit: unit }));
    onCustomValueSet({ count: Number(customState.frequencyCount), unit });
  };

  const handleSetRepeatOption = (repeat: number) => {
    setCustomState((prvState) => ({ ...prvState, repeatOption: repeat }));
    // onCustomValueSet({ count: Number(customState.frequencyCount), unit });
  };

  const handleSetHourIntervalOption = (interval: number) => {
    setCustomState((prvState) => ({ ...prvState, hourIntervalOpiton: interval }));
    // onCustomValueSet({ count: Number(customState.frequencyCount), unit });
  };

  return (
    <Animated.View
      style={[
        sharedStyles.container,
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
      <Animated.View style={[sharedStyles.opitonsContainer, { opacity: optionsContainerOpacity }]}>
        {/* BASE OPTIONS  */}
        <View style={sharedStyles.opitonsItem}>
          <Text style={sharedStyles.optionsLabel}>Каждые</Text>
          <View style={sharedStyles.optionsGroup}>
            <Pressable
              style={[sharedStyles.optionsGroupItem, { width: 50 }]}
              onPress={() => countPicker.current?.focus()}
            >
              <Text style={sharedStyles.groupItemValue}>{customState.frequencyCount}</Text>
            </Pressable>

            <Pressable
              style={sharedStyles.optionsGroupItem}
              onPress={() => unitPicker.current?.focus()}
            >
              <Text style={sharedStyles.groupItemValue}>
                {customState.frequencyUnit === "HOURLY"
                  ? getUnitValueLabel("HOURLY", customState.frequencyCount)
                  : getUnitValueLabel("DAILY", customState.frequencyCount)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* REPEAT OPTIONS */}
        <View
          style={[
            sharedStyles.opitonsItem,
            { borderTopWidth: 1, borderColor: "#F7F7F7", paddingTop: 8 },
          ]}
        >
          <Text style={sharedStyles.optionsLabel}>В день</Text>
          <View style={sharedStyles.optionsGroup}>
            <Pressable
              style={sharedStyles.optionsGroupItem}
              onPress={() => repeatOptionPicker.current?.focus()}
            >
              <Text style={sharedStyles.groupItemValue}>
                {getOptionsValueLabel(customState.repeatOption, REPEAT_OPTIONS)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* CONDITIONAL OPTION BASE ON UNIT VALUE = "DAILY" */}
        {isDailyFreqUnit && (
          <View
            style={[
              sharedStyles.opitonsItem,
              { borderTopWidth: 1, borderColor: "#F7F7F7", paddingTop: 8 },
            ]}
          >
            <Text style={sharedStyles.optionsLabel}>Интервал между приемами</Text>
            <View style={sharedStyles.optionsGroup}>
              <Pressable
                style={sharedStyles.optionsGroupItem}
                onPress={() => hourIntervalPicker.current?.focus()}
              >
                <Text style={sharedStyles.groupItemValue}>
                  {getOptionsValueLabel(customState.hourIntervalOpiton, HOUR_INTERVAL_OPTION)}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>

      {/* PIKCERS COMPONENETS */}
      {/* Count Picker */}
      <Picker
        ref={countPicker}
        selectedValue={customState.frequencyCount}
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
        selectedValue={customState.frequencyUnit}
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

      {/* Reapeat Option Picker*/}
      <Picker
        ref={repeatOptionPicker}
        selectedValue={customState.repeatOption}
        onValueChange={(itemValue) => handleSetRepeatOption(itemValue)}
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
        {REPEAT_OPTIONS.map((option) => (
          <Picker.Item
            key={option.value + option.label}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>

      {/* Hours Inteval Picker*/}
      <Picker
        ref={hourIntervalPicker}
        selectedValue={customState.hourIntervalOpiton}
        onValueChange={(itemValue) => handleSetHourIntervalOption(itemValue)}
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
        {HOUR_INTERVAL_OPTION.map((option) => (
          <Picker.Item
            key={option.value + option.label}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
});
