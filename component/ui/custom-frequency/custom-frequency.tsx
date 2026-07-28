import { HOUR_BETWEEN_OCCURENCES, OCCURENCES_PER_DAY } from "@/constants/medication-constants";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import SelectionDot from "../selection-dot";
import { DEFAULT_PATTERN, getOptionsValueLabelKey, getUnitValueLabel, HEIGHT } from "./helper";
import { useCustomFreqStyles } from "./shared-styles";
import { CustomFrequencyProps, CustomState, Unit } from "./types";

export default function CustomFrequency({
  defaultvalue,
  isSelected,
  handleSelection,
  onCustomPatternChange,
}: CustomFrequencyProps) {
  const { t, i18n } = useTranslation();
  const sharedStyles = useCustomFreqStyles();

  // Picker Refs
  const intervalValue = useRef<Picker<number>>(null);
  const intervalUnit = useRef<Picker<Unit>>(null);
  const occurrencesPerDay = useRef<Picker<number>>(null);
  const hoursBetweenOccurrences = useRef<Picker<number>>(null);

  const [customState, setCustomState] = useState<CustomState>({
    showPicker: undefined,
    pattern: DEFAULT_PATTERN,
  });

  const isDailyUnit = customState.pattern.unit === "DAILY";
  const isOnceADay = customState.pattern.occurrencesPerDay === 1;

  const height = useSharedValue(HEIGHT.COLLAPSED);
  const optionsContainerOpacity = useSharedValue(0);

  const newHeight = useMemo(() => {
    if ((isSelected && !isDailyUnit) || (isSelected && isOnceADay)) {
      return HEIGHT.EXPANDED.BASE;
    } else if (isSelected && isDailyUnit) {
      return HEIGHT.EXPANDED.EXTRA;
    } else {
      return HEIGHT.COLLAPSED;
    }
  }, [isDailyUnit, isOnceADay, isSelected]);

  useEffect(() => {
    height.value = withSpring(newHeight, { duration: 400 });
    optionsContainerOpacity.value = withDelay(
      isSelected ? 150 : 0,
      withSpring(isSelected ? 1 : 0, { duration: 300 }),
    );
  }, [height, isSelected, newHeight, optionsContainerOpacity]);

  // Set intervalValue
  const handleSetIntervalvalue = (intervalValue: number) => {
    setCustomState((prvState) => ({
      ...prvState,
      pattern: { ...prvState.pattern, intervalValue },
    }));
    onCustomPatternChange({ ...customState.pattern, intervalValue });
  };

  // Set Unit
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

  // Set OccurencePerDay
  const handleOccurencePerDay = (occurrencesPerDay: number) => {
    if (occurrencesPerDay === 1) {
    }

    setCustomState((prvState) => ({
      ...prvState,
      pattern: { ...prvState.pattern, occurrencesPerDay },
    }));

    onCustomPatternChange({
      ...customState.pattern,
      occurrencesPerDay,
    });
  };

  // Set HoursBetweenOccurrences
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

  const handleChooseCustom = () => {
    if (isSelected) {
      setCustomState((prvState) => ({ ...prvState, showPicker: undefined }));
      return;
    }
    handleSelection(defaultvalue);
    setCustomState({ showPicker: undefined, pattern: DEFAULT_PATTERN });
  };

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const hoursBetweenValueLabelKey =
    getOptionsValueLabelKey(customState.pattern.occurrencesPerDay, HOUR_BETWEEN_OCCURENCES) ?? "";
  const occurencePerDayValueLabelKey =
    getOptionsValueLabelKey(customState.pattern.occurrencesPerDay, OCCURENCES_PER_DAY) ?? "";

  return (
    <Animated.View
      style={[
        sharedStyles.container,
        styles.container,
        {
          height,
          borderWidth: isSelected ? 0 : 1,
          borderColor,
          backgroundColor: isSelected ? tintColor : bGColor,
        },
      ]}
    >
      {/* Selection button */}
      <Pressable style={sharedStyles.frequencyPressable} onPress={handleChooseCustom}>
        <Text
          style={[sharedStyles.frequencyPressableText, { color: isSelected ? "#F7F7F7" : color }]}
        >
          {defaultvalue.label}
        </Text>
        <SelectionDot isActive={isSelected} />
      </Pressable>

      {/* Custom settings */}
      <Animated.View style={[{ opacity: optionsContainerOpacity }]}>
        {/* BASE OPTIONS  */}
        <View style={sharedStyles.opitonsItem}>
          <Text style={sharedStyles.optionsLabel}>{t("common.custom_freq_every_label")}</Text>
          <View style={sharedStyles.optionsGroup}>
            <Pressable
              style={[sharedStyles.optionsGroupItem, { width: 60 }]}
              onPress={() => intervalValue.current?.focus()}
            >
              <Text style={sharedStyles.groupItemValue}>{customState.pattern.intervalValue}</Text>
            </Pressable>

            <Pressable
              style={sharedStyles.optionsGroupItem}
              onPress={() => intervalUnit.current?.focus()}
            >
              <Text style={sharedStyles.groupItemValue}>
                {customState.pattern.unit === "HOURLY"
                  ? getUnitValueLabel("HOURLY", customState.pattern.intervalValue, i18n.language)
                  : getUnitValueLabel("DAILY", customState.pattern.intervalValue, i18n.language)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* OCCURENENCES PER DAY OPTIONS */}
        <View
          style={[
            sharedStyles.opitonsItem,
            { borderTopWidth: 1, borderColor: "#F7F7F7", paddingTop: 8 },
          ]}
        >
          <Text style={sharedStyles.optionsLabel}>{t("common.custom_freq_in_a_day_label")}</Text>
          <View style={sharedStyles.optionsGroup}>
            <Pressable
              style={sharedStyles.optionsGroupItem}
              onPress={() => occurrencesPerDay.current?.focus()}
            >
              <Text style={sharedStyles.groupItemValue}>
                {/* @ts-expect-error */}
                {t(`common.occurences_per_day.${occurencePerDayValueLabelKey}`)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* CONDITIONAL OPTION BASE ON UNIT VALUE = "DAILY" */}
        {customState.pattern.unit === "DAILY" && !isOnceADay && (
          <View
            style={[
              sharedStyles.opitonsItem,
              { borderTopWidth: 1, borderColor: "#F7F7F7", paddingTop: 8 },
            ]}
          >
            <Text style={sharedStyles.optionsLabel}>
              {t("common.custom_freq_hour_interval_label")}
            </Text>
            <View style={sharedStyles.optionsGroup}>
              <Pressable
                style={sharedStyles.optionsGroupItem}
                onPress={() => hoursBetweenOccurrences.current?.focus()}
              >
                <Text style={sharedStyles.groupItemValue}>
                  {/* @ts-expect-error */}
                  {t(`common.hour_betweeen_occurences.${hoursBetweenValueLabelKey}`)}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>

      {/* intervalValue Picker */}
      <Picker
        ref={intervalValue}
        selectedValue={customState.pattern.intervalValue}
        onValueChange={(itemValue) => handleSetIntervalvalue(itemValue)}
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

      {/* Interval Unit Picker */}
      <Picker
        ref={intervalUnit}
        selectedValue={customState.pattern.unit}
        onValueChange={(itemValue) => handleSetUnit(itemValue)}
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
        <Picker.Item label={t("common.custom_freq_hour_unit")} value="HOURLY" />
        <Picker.Item label={t("common.custom_freq_day_unit")} value="DAILY" />
      </Picker>

      {/* OCCURENCES_PER_DAY OPTIONS */}
      <Picker
        ref={occurrencesPerDay}
        selectedValue={customState.pattern.occurrencesPerDay}
        onValueChange={(itemValue) => handleOccurencePerDay(itemValue)}
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
        {OCCURENCES_PER_DAY.map((option) => (
          <Picker.Item
            key={option.value + option.labelKey}
            // @ts-expect-error
            label={t(`common.occurences_per_day.${option.labelKey}`)}
            value={option.value}
          />
        ))}
      </Picker>

      {/* HOUR_BETWEEN_OCCURENCES WHEN UNIT VALUE = "DAILY" */}
      <Picker
        ref={hoursBetweenOccurrences}
        selectedValue={
          customState.pattern.unit === "DAILY"
            ? customState.pattern.hoursBetweenOccurrences
            : undefined
        }
        onValueChange={(itemValue) => handlehoursBetweenOccurrences(itemValue)}
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
        {HOUR_BETWEEN_OCCURENCES.map((option) => (
          <Picker.Item
            key={option.value + option.labelKey}
            // @ts-expect-error
            label={t(`common.hour_betweeen_occurences.${option.labelKey}`)}
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
