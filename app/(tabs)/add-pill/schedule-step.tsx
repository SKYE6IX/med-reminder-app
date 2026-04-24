import ArrowDown from "@/component/icons/arrow-down";
import CalenderIcon from "@/component/icons/calender-icon";
import PlusIcon from "@/component/icons/plus-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import DateTimePickerWrapper, {
  DateTimeWrapperRef,
} from "@/component/ui/date-time-wrapper";
import DosageSettings from "@/component/ui/dosage-settings";
import FrequencySettings from "@/component/ui/frequency-settings";
import { useThemeColor } from "@/hooks/use-theme-color";
import { RuleValue, useAddPillStore } from "@/stores/add-pill-store";
import { DosageMeasurement } from "@/types/medication";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { generateTimeOccurrences, updateTimeRules } from "@/utils/rruleUtils";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ScheduleStepScreen() {
  const { formState, setMedicatioSchedule, setMedicationDetails } =
    useAddPillStore();

  const timeRef = useRef<DateTimeWrapperRef>(null);
  const dateRef = useRef<DateTimeWrapperRef>(null);

  const displayStartDate = formatRegularDate(
    formState.schedule.startDate.replaceAll(".", " "),
  );

  // *** //
  // We use this to target the first letter since there is no way to do this in
  // Text. And the other date generation can be acesss ahead.
  const [firstLetter, ...restArr] = Array.from(displayStartDate);
  const rest = restArr.join("");
  // ****/

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

  // Rules settings
  const handleSetRRules = ({
    rules,
    value,
  }: {
    rules: string;
    value: RuleValue;
  }) => {
    setMedicatioSchedule({
      rule: {
        recurrenceRule: rules,
        value,
      },
    });
  };

  // Time settings
  const handleSetTime = (date: Date) => {
    const newRules = updateTimeRules({
      rrules: formState.schedule.rule.recurrenceRule,
      date,
    });
    setMedicatioSchedule({
      rule: {
        recurrenceRule: newRules,
        value: formState.schedule.rule.value,
      },
    });
  };

  // Date settings
  const handleSetDate = (date: Date) => {
    const startingDate = getDateLocalString(date);
    setMedicatioSchedule({ startDate: startingDate });
  };

  // Dosage setting
  const handleOnDosageSettingChange = ({
    amount,
    unit,
  }: Partial<{ amount: number; unit: DosageMeasurement }>) => {
    setMedicatioSchedule({ dosage: amount ?? formState.schedule.dosage });
    setMedicationDetails({
      medicationMeasurement: unit ?? formState.medicationMeasurement,
    });
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Frequency Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Частота</Text>
          <FrequencySettings
            onRRulesSet={handleSetRRules}
            currentValue={formState.schedule.rule.value}
          />
        </View>

        {/* Dosage Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Дозировка</Text>
          <DosageSettings
            dosageAmountState={formState.schedule.dosage}
            dosageUnitState={formState.medicationMeasurement}
            onDasgeSettingsChange={handleOnDosageSettingChange}
          />
        </View>

        {/* Time Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Время приема</Text>
          <View style={styles.timeSettingList}>
            {occurences.map((time, i) => (
              <Text
                key={time + i}
                style={[
                  styles.selectedTime,
                  { backgroundColor: bGColor, color },
                ]}
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
            onDateTimeSelected={handleSetTime}
            ref={timeRef}
            mode="time"
            bottomSheetTitle="Время начала"
          />
        </View>

        {/* Date Settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Дата начала</Text>
          <Pressable
            style={[
              styles.dateSettingPressable,
              { borderColor, backgroundColor: bGColor },
            ]}
            onPress={() => dateRef.current?.showDateTime()}
          >
            <View
              style={[
                styles.dateSettingLeftIcon,
                { backgroundColor: bGTertiary },
              ]}
            >
              <CalenderIcon color={tintColor} />
            </View>
            <View style={styles.dateSettingTextWrapper}>
              <Text style={[styles.dateSettingLabel, { color: colorMuted }]}>
                Начало
              </Text>

              <Text style={[styles.dateSettingValue, { color }]}>
                <Text style={styles.dateSettingValueUpperCase}>
                  {firstLetter}
                </Text>
                {rest}
              </Text>
            </View>
            <View style={styles.dateSettingRightIcon}>
              <ArrowDown />
            </View>
          </Pressable>

          <DateTimePickerWrapper
            onDateTimeSelected={handleSetDate}
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
          onPress={() => router.navigate("/(tabs)/add-pill/final-step")}
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
  dateSettingValueUpperCase: {
    textTransform: "capitalize",
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
