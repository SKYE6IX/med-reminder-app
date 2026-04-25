import { HOUR_INTERVAL_OPTION, REPEAT_OPTIONS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PickerIOS } from "@react-native-picker/picker";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import SelectionDot from "../selection-dot";
import { useCustomFreqStyles } from "./shared-styles";
import { CustomFrequencyProps, CustomState, TCustomFrequency, Unit } from "./types";

const DEFAULT_VALUE: TCustomFrequency = {
  label: "Своя частота",
  rrule: "",
  value: "CUSTOM_RULES",
};

const HEIGHT = {
  COLLAPSED: 60,
  EXPANDED: {
    BASE: 150, // Without extra option.
    EXTRA: 190, // With extra opiton when user pick "DAILY".
    PICKER: 375, // Full height if extra option isn't included.
    EXTRA_WITH_PICKER: 415, // Full height if extra option is included.
  },
};

const getOptionsValueLabel = (value: number, options: { label: string; value: number }[]) => {
  return options.find((option) => option.value === value)?.label;
};

export default function CustomFrequency({
  isSelected,
  handleSelection,
  onCustomValueSet,
}: CustomFrequencyProps) {
  const sharedStyles = useCustomFreqStyles();

  const [customState, setCustomState] = useState<CustomState>({
    showPicker: undefined,
    frequencyCount: 3,
    frequencyUnit: "HOURLY",
    repeatOption: 3,
    hourIntervalOpiton: 3,
  });

  const isDailyFreqUnit = customState.frequencyUnit === "DAILY";
  const height = useSharedValue(HEIGHT.COLLAPSED);

  //   Themes
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const newHeight = useMemo(() => {
    if (isSelected) {
      if (customState.showPicker && !isDailyFreqUnit) {
        return HEIGHT.EXPANDED.PICKER;
      } else if (customState.showPicker && isDailyFreqUnit) {
        return HEIGHT.EXPANDED.EXTRA_WITH_PICKER;
      } else if (!customState.showPicker && isDailyFreqUnit) {
        return HEIGHT.EXPANDED.EXTRA;
      } else {
        return HEIGHT.EXPANDED.BASE;
      }
    } else {
      return HEIGHT.COLLAPSED;
    }
  }, [customState.showPicker, isDailyFreqUnit, isSelected]);

  useEffect(() => {
    height.value = withSpring(newHeight);
  }, [height, isSelected, newHeight]);

  // Show picker
  const handleShowPick = (picker: CustomState["showPicker"]) => {
    if (customState.showPicker === picker) {
      setCustomState((prvState) => ({ ...prvState, showPicker: undefined }));
    } else {
      setCustomState((prvState) => ({ ...prvState, showPicker: picker }));
    }
  };

  // Set freqCount
  const handleSetFreqCount = (count: number) => {
    setCustomState((prvState) => ({ ...prvState, frequencyCount: count }));
    onCustomValueSet({ count: Number(count), unit: customState.frequencyUnit });
  };

  // Set freqUnit
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
          borderWidth: isSelected ? undefined : 1,
          borderColor,
          backgroundColor: isSelected ? tintColor : bGColor,
          height,
        },
      ]}
    >
      {/* Button trigger */}
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
      <View style={sharedStyles.opitonsContainer}>
        {/* BASE OPTIONS  */}
        <View style={styles.optionsWrapper}>
          <View style={sharedStyles.opitonsItem}>
            <Text style={sharedStyles.optionsLabel}>Каждые</Text>
            <View style={sharedStyles.optionsGroup}>
              <Pressable
                style={[sharedStyles.optionsGroupItem, { width: 50 }]}
                onPress={() => handleShowPick("count")}
              >
                <Text style={sharedStyles.groupItemValue}>{customState.frequencyCount}</Text>
              </Pressable>

              <Pressable
                style={sharedStyles.optionsGroupItem}
                onPress={() => handleShowPick("unit")}
              >
                <Text style={sharedStyles.groupItemValue}>
                  {customState.frequencyUnit === "HOURLY" ? "Часа" : "Дня"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* BASE OPTIONS PICKERS */}
          {customState.showPicker === "count" && (
            <PickerIOS
              selectedValue={customState.frequencyCount}
              onValueChange={(itemValue) => handleSetFreqCount(itemValue as number)}
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
          {customState.showPicker === "unit" && (
            <PickerIOS
              selectedValue={customState.frequencyUnit}
              onValueChange={(itemValue) => handleSetFreqUnit(itemValue as Unit)}
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
              <PickerIOS.Item label="Часа" value="HOURLY" />
              <PickerIOS.Item label="Дня" value="DAILY" />
            </PickerIOS>
          )}
        </View>

        {/* REPEAT OPTIONS */}
        <View
          style={[
            styles.optionsWrapper,
            {
              borderTopWidth: 1,
              borderColor,
              marginTop: 8,
            },
          ]}
        >
          <View style={sharedStyles.opitonsItem}>
            <Text style={sharedStyles.optionsLabel}>В день</Text>
            <View style={sharedStyles.optionsGroup}>
              <Pressable
                style={sharedStyles.optionsGroupItem}
                onPress={() => handleShowPick("repeat")}
              >
                <Text style={sharedStyles.groupItemValue}>
                  {getOptionsValueLabel(customState.repeatOption, REPEAT_OPTIONS)}
                </Text>
              </Pressable>
            </View>
          </View>

          {customState.showPicker === "repeat" && (
            <PickerIOS
              selectedValue={customState.repeatOption}
              onValueChange={(itemValue) => handleSetRepeatOption(Number(itemValue))}
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
              {REPEAT_OPTIONS.map((option) => (
                <PickerIOS.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </PickerIOS>
          )}
        </View>

        {/* CONDITIONAL OPTION BASE ON UNIT VALUE = "DAILY" */}
        {isDailyFreqUnit && (
          <View style={[styles.optionsWrapper, { borderTopWidth: 1, borderColor, marginTop: 8 }]}>
            <View style={sharedStyles.opitonsItem}>
              <Text style={sharedStyles.optionsLabel}>Интервал между приемами</Text>
              <View style={sharedStyles.optionsGroup}>
                <Pressable
                  style={sharedStyles.optionsGroupItem}
                  onPress={() => handleShowPick("interval")}
                >
                  <Text style={sharedStyles.groupItemValue}>
                    {getOptionsValueLabel(customState.hourIntervalOpiton, HOUR_INTERVAL_OPTION)}
                  </Text>
                </Pressable>
              </View>
            </View>
            {customState.showPicker === "interval" && (
              <PickerIOS
                selectedValue={customState.hourIntervalOpiton}
                onValueChange={(itemValue) => handleSetHourIntervalOption(Number(itemValue))}
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
                {HOUR_INTERVAL_OPTION.map((option) => (
                  <PickerIOS.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </PickerIOS>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  optionsWrapper: {
    gap: 8,
  },
});
