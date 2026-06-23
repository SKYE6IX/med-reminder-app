import ArrowDown from "@/component/icons/arrow-down";
import CalenderIcon from "@/component/icons/calender-icon";
import PlusIcon from "@/component/icons/plus-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import DateTimePickerWrapper, {
  DateTimeWrapperRef,
} from "@/component/ui/date-time-wrapper/date-time-wrapper";
import DosageAmounPicker from "@/component/ui/dosage-picker/dosage-amount-picker";
import FrequencySettings from "@/component/ui/frequency-settings";
import { useThemeColor } from "@/hooks/use-theme-color";
import { SchedulePreset, useAddPillStore } from "@/stores/add-pill-store";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { generateTimeOccurrences, updateTimeOcurrencesRule } from "@/utils/rruleUtils";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ScheduleStepScreen() {
  const { formState, setMedicatioSchedule } = useAddPillStore();

  const timeRef = useRef<DateTimeWrapperRef>(null);
  const dateRef = useRef<DateTimeWrapperRef>(null);

  const displayStartDate = formatRegularDate(formState.schedule.startDate.replaceAll(".", " "));

  const sharedStyles = useAddPillScreenStyles();
  const router = useRouter();

  const occurences = generateTimeOccurrences({
    rrule: formState.schedule.rule.recurrenceRule,
  });

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const colorMuted = useThemeColor({}, "textMuted");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  // Frequency settings
  const handleSetFrequency = ({
    rrule,
    preset,
  }: {
    rrule: string;
    preset: SchedulePreset | undefined;
  }) => {
    setMedicatioSchedule({
      rule: {
        recurrenceRule: rrule,
        preset,
      },
    });
  };

  // Time settings
  const handleSetTime = (date: Date) => {
    const newRules = updateTimeOcurrencesRule({
      rrule: formState.schedule.rule.recurrenceRule,
      date,
    });
    setMedicatioSchedule({
      rule: {
        recurrenceRule: newRules,
        preset: formState.schedule.rule.preset,
      },
    });
  };

  // Date settings
  const handleSetDate = (date: Date) => {
    const startingDate = getDateLocalString(date);
    setMedicatioSchedule({ startDate: startingDate });
  };

  return (
    <View
      style={[
        styles.container,
        sharedStyles.container,
        // Needed to reset the padding and transfer it to the scrollView
        { paddingLeft: 0, paddingRight: 0 },
      ]}
    >
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        {/* Frequency Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Частота</Text>
          <FrequencySettings
            onFreqSet={handleSetFrequency}
            preset={formState.schedule.rule.preset}
          />
        </View>

        {/* Dosage Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Дозировка</Text>
          <DosageAmounPicker />
        </View>

        {/* Time Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Время приема</Text>
          <View style={styles.timeSettingList}>
            {occurences?.map((time, i) => (
              <Text
                key={time + i}
                style={[styles.selectedTime, { backgroundColor: bGColor, color }]}
              >
                {time}
              </Text>
            ))}
          </View>
          <CustomButton
            label="Установить время начала"
            variant="outline"
            textVaraint="tintText"
            svgIcon={<PlusIcon color={tintColor} size={14} />}
            onPress={() => timeRef.current?.showDateTime()}
          />
          {/* TIME PICKER */}
          <DateTimePickerWrapper
            onDateTimeChange={handleSetTime}
            ref={timeRef}
            mode="time"
            bottomSheetTitle="Время начала"
          />
        </View>

        {/* Date Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Дата начала</Text>
          <Pressable
            style={[styles.dateSettingPressable, { borderColor, backgroundColor: bGColor }]}
            onPress={() => dateRef.current?.showDateTime()}
          >
            <View style={[styles.dateSettingLeftIcon, { backgroundColor: bGTertiary }]}>
              <CalenderIcon color={tintColor} />
            </View>
            <View style={styles.dateSettingTextWrapper}>
              <Text style={[styles.dateSettingLabel, { color: colorMuted }]}>Начало</Text>
              <Text style={[styles.dateSettingValue, { color }]}>{displayStartDate}</Text>
            </View>
            <View style={styles.dateSettingRightIcon}>
              <ArrowDown />
            </View>
          </Pressable>

          <DateTimePickerWrapper
            onDateTimeChange={handleSetDate}
            ref={dateRef}
            mode="date"
            bottomSheetTitle="Дата начала"
          />
        </View>

        <CustomButton
          label="Далее"
          style={sharedStyles.button}
          variant="filled"
          textVaraint="regularText"
          onPress={() => router.navigate("/(tabs)/add-medication/final-step")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: 32,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  timeSettingList: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  selectedTime: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
  },
  dateSettingPressable: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    paddingRight: 16,
    paddingLeft: 16,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  dateSettingTextWrapper: {
    gap: 4,
  },
  dateSettingLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  dateSettingValue: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  dateSettingLeftIcon: {
    width: 40,
    height: 40,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  dateSettingRightIcon: {
    marginLeft: "auto",
  },
});
