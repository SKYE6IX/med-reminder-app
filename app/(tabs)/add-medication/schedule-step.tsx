import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowDown from "@/component/icons/arrow-down";
import CalenderIcon from "@/component/icons/calender-icon";
import PlusIcon from "@/component/icons/plus-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import AndroidDateTimeWrapper, {
  DateTimeWrapperRef,
} from "@/component/ui/date-time-wrapper/date-time-wrapper.android";
import IOSDateTimeWrapper from "@/component/ui/date-time-wrapper/date-time-wrapper.ios";
import DosageAmounPicker from "@/component/ui/dosage-picker/dosage-amount-picker";
import FrequencySettings from "@/component/ui/frequency-settings";
import { useThemeColor } from "@/hooks/use-theme-color";
import { SchedulePreset, useAddPillStore } from "@/stores/add-pill-store";
import { DateTime, formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { generateTimeOccurrences, updateTimeOcurrencesRule } from "@/utils/rruleUtils";

import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const getNow = () => new Date();

export default function ScheduleStepScreen() {
  const insets = useSafeAreaInsets();

  const sharedStyles = useAddPillScreenStyles();
  const isAndroid = Platform.OS === "android";

  const { openSheet } = useBottomSheet();
  const { formState, setMedicatioSchedule } = useAddPillStore();
  const router = useRouter();

  const [durations, setDurations] = useState("");
  const [fromDate, setFromDate] = useState<Date>(getNow());
  const displayStartDate = formatRegularDate(formState.schedule.startDate.replaceAll(".", " "));

  const androidTimeRef = useRef<DateTimeWrapperRef>(null); // @Platform ANDROID ONLY
  const androidDateRef = useRef<DateTimeWrapperRef>(null); // @Platform ANDROID ONLY

  const occurences = generateTimeOccurrences({
    rrule: formState.schedule.rule.recurrenceRule,
  });

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
  const handleOnTimeChange = (date: Date) => {
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
  const handleOnDateChange = (date: Date) => {
    setFromDate(date);
    if (durations.length >= 1) {
      const startDate = DateTime.fromJSDate(date);
      const endDate = startDate.plus({ days: Number(durations) - 1 });
      setMedicatioSchedule({
        startDate: getDateLocalString(startDate.toJSDate()),
        endDate: getDateLocalString(endDate.toJSDate()),
      });
    } else {
      const startingDate = getDateLocalString(date);
      setMedicatioSchedule({ startDate: startingDate });
    }
  };

  const handleOnDurationInputChange = (text: string) => {
    setDurations(text);
    if (text.length <= 0) {
      setMedicatioSchedule({ endDate: null });
    } else {
      const startDate = DateTime.fromJSDate(fromDate);
      const endDate = startDate.plus({ days: Number(text) - 1 });
      setMedicatioSchedule({
        startDate: getDateLocalString(startDate.toJSDate()),
        endDate: getDateLocalString(endDate.toJSDate()),
      });
    }
  };

  const showTimeSetting = () => {
    if (isAndroid) {
      androidTimeRef.current?.showDateTime();
    } else {
      openSheet({
        title: "Время начала",
        snapPointPercent: "40%",
        content: (
          <IOSDateTimeWrapper
            mode="time"
            onDateTimeChange={handleOnTimeChange}
            showUpdateButton={false}
          />
        ),
      });
    }
  };

  const showDateSetting = () => {
    if (isAndroid) {
      androidDateRef.current?.showDateTime();
    } else {
      openSheet({
        title: "Дата начала",
        snapPointPercent: "40%",
        content: (
          <IOSDateTimeWrapper
            mode="date"
            onDateTimeChange={handleOnDateChange}
            showUpdateButton={false}
            disabledDate
          />
        ),
      });
    }
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const colorMuted = useThemeColor({}, "textMuted");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const top = isAndroid ? insets.top + 10 : 0;

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: top, backgroundColor }} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={[styles.container]}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
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
              onPress={showTimeSetting}
            />

            {/* ONLY FOR ANDROID */}
            {isAndroid && (
              <AndroidDateTimeWrapper
                ref={androidTimeRef}
                onDateTimeChange={handleOnTimeChange}
                mode="time"
              />
            )}
          </View>

          {/* Duration days settings. (Optional) */}
          <View style={sharedStyles.sectionContainer}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={sharedStyles.title}>Период</Text>
              <Text style={[styles.durationOptionalText, { color }]}>«Необязательно»</Text>
            </View>
            <TextInput
              value={durations}
              onChangeText={handleOnDurationInputChange}
              keyboardType="number-pad"
              inputMode="numeric"
              placeholder="Сколько дней..."
              style={[
                styles.durationInput,
                {
                  color,
                  borderColor,
                  backgroundColor: bGColor,
                },
              ]}
            />
          </View>

          {/* Date Settings */}
          <View style={sharedStyles.sectionContainer}>
            <Text style={sharedStyles.title}>Дата начала</Text>
            <Pressable
              style={[styles.dateSettingPressable, { borderColor, backgroundColor: bGColor }]}
              onPress={showDateSetting}
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

            {/* ONLY FOR ANDROID */}
            {isAndroid && (
              <AndroidDateTimeWrapper
                ref={androidDateRef}
                onDateTimeChange={handleOnDateChange}
                mode="date"
              />
            )}
          </View>

          <CustomButton
            label="Далее"
            style={sharedStyles.button}
            variant="filled"
            textVaraint="regularText"
            onPress={() => router.navigate("/(tabs)/add-medication/final-step")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  durationOptionalText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16,
    marginLeft: 2,
  },
  durationInput: {
    width: "100%",
    height: 60,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 22,
  },
});
