import { useThemeColor } from "@/hooks/use-theme-color";
import { SchedulePreset } from "@/stores/add-pill-store";
import { buildRRule } from "@/utils/rruleUtils";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomFrequency from "./custom-frequency/custom-frequency";
import { CustomPattern } from "./custom-frequency/types";
import SelectionDot from "./selection-dot";

export interface FrequencySettingsState {
  label: string;
  info?: string;
  rrule: string;
  preset: SchedulePreset | undefined;
}

type FrequencySettingsProps = {
  preset: SchedulePreset | undefined;
  onFreqSet: ({ rrule, preset }: { rrule: string; preset: SchedulePreset | undefined }) => void;
};

const DEFALUT_FREQUENCIES: FrequencySettingsState[] = [
  {
    label: "Один раз в день",
    info: "Каждые 24 часа",
    rrule: "FREQ=DAILY;BYHOUR=8;BYMINUTE=0",
    preset: "ONCE_A_DAY",
  },
  {
    label: "Два раза в день",
    info: "Каждые 12 часов",
    rrule: "FREQ=DAILY;BYHOUR=8,21;BYMINUTE=0",
    preset: "TWICE_A_DAY",
  },
  {
    label: "Три раза в день",
    info: "Каждые 8 часов",
    rrule: "FREQ=DAILY;BYHOUR=7,15,23;BYMINUTE=0",
    preset: "THREE_TIMES_A_DAY",
  },
  {
    label: "Своя частота",
    rrule: "FREQ=DAILY;BYHOUR=8,11,14;BYMINUTE=0",
    preset: "CUSTOM",
  },
];

export default function FrequencySettings({ preset, onFreqSet }: FrequencySettingsProps) {
  const regularDefualts = DEFALUT_FREQUENCIES.filter((freq) => freq.preset !== "CUSTOM");
  const customDefault = DEFALUT_FREQUENCIES[DEFALUT_FREQUENCIES.length - 1];

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const handleSetSelectedFreq = (freq: FrequencySettingsState) => {
    onFreqSet({ rrule: freq.rrule, preset: freq.preset });
  };

  const handleOnCustomPatternChange = (pattern: Partial<CustomPattern>) => {
    const rrule = buildRRule(pattern as CustomPattern);
    onFreqSet({ rrule, preset: "CUSTOM" });
  };

  return (
    <View style={styles.frequencyContainer}>
      {regularDefualts.map((freq) => {
        const isActive = freq.preset === preset;
        return (
          <Pressable
            key={freq.rrule}
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
              <Text style={[styles.frequencyTextTitle, { color: isActive ? "#F7F7F7" : color }]}>
                {freq.label}
              </Text>
              <Text style={[styles.frequencyTextSubtitle, { color: isActive ? "#F7F7F7" : color }]}>
                {freq.info}
              </Text>
            </View>
            <SelectionDot isActive={isActive} />
          </Pressable>
        );
      })}
      <CustomFrequency
        defaultvalue={customDefault}
        isSelected={preset === customDefault.preset}
        handleSelection={handleSetSelectedFreq}
        onCustomPatternChange={handleOnCustomPatternChange}
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
