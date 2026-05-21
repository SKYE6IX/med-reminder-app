import { HOUR_BETWEEN_OCCURENCES, OCCURENCES_PER_DAY } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PickerIOS } from "@react-native-picker/picker";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import SelectionDot from "../selection-dot";
import { DEFAULT_PATTERN, HEIGHT, getOptionsValueLabel, getUnitValueLabel } from "./helper";
import { useCustomFreqStyles } from "./shared-styles";
import { CustomFrequencyProps, CustomState, Unit } from "./types";

export default function CustomFrequency({
  isSelected,
  defaultvalue,
  handleSelection,
  onCustomPatternChange,
}: CustomFrequencyProps) {
  const sharedStyles = useCustomFreqStyles();

  const [customState, setCustomState] = useState<CustomState>({
    showPicker: undefined,
    pattern: DEFAULT_PATTERN,
  });

  const isDailyUnit = customState.pattern.unit === "DAILY";
  const height = useSharedValue(HEIGHT.COLLAPSED);

  //   Themes
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const newHeight = useMemo(() => {
    if (isSelected) {
      if (customState.showPicker && !isDailyUnit) {
        return HEIGHT.EXPANDED.PICKER;
      } else if (customState.showPicker && isDailyUnit) {
        return HEIGHT.EXPANDED.EXTRA_WITH_PICKER;
      } else if (!customState.showPicker && isDailyUnit) {
        return HEIGHT.EXPANDED.EXTRA;
      } else {
        return HEIGHT.EXPANDED.BASE;
      }
    } else {
      return HEIGHT.COLLAPSED;
    }
  }, [customState.showPicker, isDailyUnit, isSelected]);

  useEffect(() => {
    setCustomState({ showPicker: undefined, pattern: DEFAULT_PATTERN });
  }, [isSelected]);

  useEffect(() => {
    height.value = withSpring(newHeight);
  }, [height, isSelected, newHeight]);

  // Show picker
  const handleShowPicker = (picker: CustomState["showPicker"]) => {
    if (customState.showPicker === picker) {
      setCustomState((prvState) => ({ ...prvState, showPicker: undefined }));
    } else {
      setCustomState((prvState) => ({ ...prvState, showPicker: picker }));
    }
  };

  // Set intervalValue
  const handleSetIntervalvalue = (intervalValue: number) => {
    setCustomState((prvState) => ({
      ...prvState,
      pattern: { ...prvState.pattern, intervalValue },
    }));
    onCustomPatternChange({ ...customState.pattern, intervalValue });
  };

  // Set unit
  const handleSetUnit = (unit: Unit) => {
    if (unit === "DAILY") {
      const defaultHoursBetween = 3;
      setCustomState((prvState) => ({
        ...prvState,
        pattern: { ...prvState.pattern, unit, hoursBetweenOccurrences: defaultHoursBetween },
      }));
      onCustomPatternChange({
        ...customState.pattern,
        hoursBetweenOccurrences: defaultHoursBetween,
        unit,
      });
    } else {
      setCustomState((prvState) => ({
        ...prvState,
        pattern: { ...prvState.pattern, unit },
      }));
      onCustomPatternChange({
        ...customState.pattern,
        unit,
      });
    }
  };

  // Set occurencePerDay
  const handleOccurencePerDay = (occurrencesPerDay: number) => {
    setCustomState((prvState) => ({
      ...prvState,
      pattern: { ...prvState.pattern, occurrencesPerDay },
    }));
    onCustomPatternChange({
      ...customState.pattern,
      occurrencesPerDay,
    });
  };

  // Set hoursBetweenOccurrences
  const handlehoursBetweenOccurrences = (hoursBetweenOccurrences: number) => {
    if (customState.pattern.unit === "DAILY") {
      setCustomState((prvState) => ({
        ...prvState,
        pattern: { ...prvState.pattern, hoursBetweenOccurrences },
      }));
      onCustomPatternChange({
        ...customState.pattern,
        hoursBetweenOccurrences,
      });
    }
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
        onPress={() => handleSelection(defaultvalue)}
      >
        <Text
          style={[sharedStyles.frequencyPressableText, { color: isSelected ? "#F7F7F7" : color }]}
        >
          {defaultvalue.label}
        </Text>
        <SelectionDot isActive={isSelected} />
      </Pressable>

      {/* Custom settings */}
      <View>
        <View style={styles.optionsWrapper}>
          <View style={sharedStyles.opitonsItem}>
            <Text style={sharedStyles.optionsLabel}>Каждые</Text>
            <View style={sharedStyles.optionsGroup}>
              <Pressable
                style={[sharedStyles.optionsGroupItem, { width: 50 }]}
                onPress={() => handleShowPicker("intervalValue")}
              >
                <Text style={sharedStyles.groupItemValue}>{customState.pattern.intervalValue}</Text>
              </Pressable>

              <Pressable
                style={sharedStyles.optionsGroupItem}
                onPress={() => handleShowPicker("intervalUnit")}
              >
                <Text style={sharedStyles.groupItemValue}>
                  {customState.pattern.unit === "HOURLY"
                    ? getUnitValueLabel("HOURLY", customState.pattern.intervalValue)
                    : getUnitValueLabel("DAILY", customState.pattern.intervalValue)}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* INTERVAL VALUE OPTIONS */}
          {customState.showPicker === "intervalValue" && (
            <PickerIOS
              selectedValue={customState.pattern.intervalValue}
              onValueChange={(itemValue) => handleSetIntervalvalue(itemValue as number)}
              style={{
                borderTopWidth: 1,
                borderColor: "#F7F7F7",
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

          {/* INTERVAL UNIT OPTION */}
          {customState.showPicker === "intervalUnit" && (
            <PickerIOS
              selectedValue={customState.pattern.unit}
              onValueChange={(itemValue) => handleSetUnit(itemValue as Unit)}
              style={{
                borderTopWidth: 1,
                borderColor: "#F7F7F7",
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

        {/* OCCURENCES_PER_DAY OPTIONS */}
        <View
          style={[
            styles.optionsWrapper,
            {
              borderTopWidth: 1,
              borderColor: "#F7F7F7",
              marginTop: 8,
            },
          ]}
        >
          <View style={sharedStyles.opitonsItem}>
            <Text style={sharedStyles.optionsLabel}>В день</Text>
            <View style={sharedStyles.optionsGroup}>
              <Pressable
                style={sharedStyles.optionsGroupItem}
                onPress={() => handleShowPicker("occurrencesPerDay")}
              >
                <Text style={sharedStyles.groupItemValue}>
                  {getOptionsValueLabel(customState.pattern.occurrencesPerDay, OCCURENCES_PER_DAY)}
                </Text>
              </Pressable>
            </View>
          </View>

          {customState.showPicker === "occurrencesPerDay" && (
            <PickerIOS
              selectedValue={customState.pattern.occurrencesPerDay}
              onValueChange={(itemValue) => handleOccurencePerDay(Number(itemValue))}
              style={{
                borderTopWidth: 1,
                borderColor: "#F7F7F7",
              }}
              itemStyle={{
                fontFamily: "Roboto_400Regular",
                fontSize: 20,
                lineHeight: 24,
                color: "#F7F7F7",
              }}
            >
              {OCCURENCES_PER_DAY.map((option) => (
                <PickerIOS.Item
                  key={option.value + option.label}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </PickerIOS>
          )}
        </View>

        {/* HOUR_BETWEEN_OCCURENCES WHEN UNIT VALUE = "DAILY" */}
        {customState.pattern.unit === "DAILY" && (
          <View
            style={[
              styles.optionsWrapper,
              { borderTopWidth: 1, borderColor: "#F7F7F7", marginTop: 8 },
            ]}
          >
            <View style={sharedStyles.opitonsItem}>
              <Text style={sharedStyles.optionsLabel}>Интервал между приемами</Text>
              <View style={sharedStyles.optionsGroup}>
                <Pressable
                  style={sharedStyles.optionsGroupItem}
                  onPress={() => handleShowPicker("hoursBetweenOccurrences")}
                >
                  <Text style={sharedStyles.groupItemValue}>
                    {getOptionsValueLabel(
                      customState.pattern.hoursBetweenOccurrences,
                      HOUR_BETWEEN_OCCURENCES,
                    )}
                  </Text>
                </Pressable>
              </View>
            </View>
            {customState.showPicker === "hoursBetweenOccurrences" && (
              <PickerIOS
                selectedValue={customState.pattern.hoursBetweenOccurrences}
                onValueChange={(itemValue) => handlehoursBetweenOccurrences(Number(itemValue))}
                style={{
                  borderTopWidth: 1,
                  borderColor: "#F7F7F7",
                }}
                itemStyle={{
                  fontFamily: "Roboto_400Regular",
                  fontSize: 20,
                  lineHeight: 24,
                  color: "#F7F7F7",
                }}
              >
                {HOUR_BETWEEN_OCCURENCES.map((option) => (
                  <PickerIOS.Item
                    key={option.value + option.label}
                    label={option.label}
                    value={option.value}
                  />
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
