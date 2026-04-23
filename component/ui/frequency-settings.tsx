import { useThemeColor } from "@/hooks/use-theme-color";
import { RuleValue } from "@/stores/add-pill-store";
import { buildRRules } from "@/utils/rruleUtils";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomFrequency, { Unit } from "./custom-frequency";
import SelectionDot from "./selection-dot";

export interface Frequency {
  label: string;
  info?: string;
  value: RuleValue;
  rrule: string;
}

type FrequencySettingsProps = {
  currentValue: RuleValue;
  onRRulesSet: ({ rules, value }: { rules: string; value: RuleValue }) => void;
};

const DEFALUT_FREQUENCIES: Frequency[] = [
  {
    label: "Один раз в день",
    info: "Каждые 24 часа",
    rrule: "FREQ=DAILY;BYHOUR=9;BYMINUTE=0",
    value: "ONCE_A_DAY",
  },
  {
    label: "Два раза в день",
    info: "Каждые 12 часов",
    rrule: "FREQ=DAILY;BYHOUR=9,21;BYMINUTE=0",
    value: "TWICE_A_DAY",
  },
  {
    label: "Три раза в день",
    info: "Каждые 7 часов",
    rrule: "FREQ=DAILY;BYHOUR=9,14,21;BYMINUTE=0",
    value: "THREE_TIMES_A_DAY",
  },
];

export default function FrequencySettings({
  onRRulesSet,
  currentValue,
}: FrequencySettingsProps) {
  const [customFreqValues, setCustomFreqValues] = useState<{
    count: number;
    unit: Unit;
  }>({
    count: 3,
    unit: "HOURLY",
  });

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const handleSetSelectedFreq = (freq: Frequency) => {
    if (freq.value === "CUSTOM_RULES") {
      const customRules = buildRRules({
        repeatCount: customFreqValues.count,
        repeatUnit: customFreqValues.unit,
      });
      onRRulesSet({ rules: customRules, value: "CUSTOM_RULES" });
    } else {
      onRRulesSet({ rules: freq.rrule, value: freq.value });
    }
  };

  const handleOnCustomValueSet = ({
    count,
    unit,
  }: {
    count: number;
    unit: Unit;
  }) => {
    const rrules = buildRRules({ repeatCount: count, repeatUnit: unit });
    onRRulesSet({ rules: rrules, value: "CUSTOM_RULES" });
    setCustomFreqValues({ count, unit });
  };

  return (
    <View style={styles.frequencyContainer}>
      {DEFALUT_FREQUENCIES.map((freq) => {
        const isActive = freq.value === currentValue;
        return (
          <Pressable
            key={freq.value}
            style={[
              styles.frequencyPressable,
              {
                borderColor,
                borderWidth: isActive ? undefined : 1,
                backgroundColor: isActive ? tintColor : bGColor,
              },
            ]}
            onPress={() => handleSetSelectedFreq(freq)}
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
        isSelected={currentValue === "CUSTOM_RULES"}
        handleSelection={handleSetSelectedFreq}
        onCustomValueSet={handleOnCustomValueSet}
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
