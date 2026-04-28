import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import ArrowRight from "@/component/icons/arrow-right";
import CalenderIcon from "@/component/icons/calender-icon";
import ClockIcon from "@/component/icons/clock-icon";
import LineChartIcon from "@/component/icons/line-chart-icon";
import NoteIcon from "@/component/icons/note-icon";
import PillFilledIcon from "@/component/icons/pill-filled-icon";
import PillIcon from "@/component/icons/pill-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import MedicationCard from "@/component/ui/medication-card/medication-card";
import { DOSAGE_UNITS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { mockMedications } from "@/mock-data";
import { ProfileResponse } from "@/types/medication";
import { formatRegularDate, getDateLocalString, toLocalTime } from "@/utils/luxonUtil";
import { getRuleText } from "@/utils/rruleUtils";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function MedicationDetails() {
  const insets = useSafeAreaInsets();

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");

  const medicationProfile = mockMedications[4];

  const handleOnSwitchToggle = (status: "active" | "inactive") => {
    // Perform operation to update the active status of the
    // medication profile.
    console.log("current status -> ", status);
  };

  const getStartedDate = (isoString: string) => {
    const date = new Date(isoString);
    const convertedString = getDateLocalString(date).replaceAll(".", " ");
    return formatRegularDate(convertedString);
  };

  const getStartTime = (startTime: string) => {
    const date = new Date(startTime);
    return toLocalTime(date);
  };

  const getDosage = () => {
    const label = DOSAGE_UNITS.find(
      (unit) => unit.value === medicationProfile.schedule.measurement,
    )?.label;
    return `${medicationProfile.schedule.dosage + " " + label}`;
  };

  const rruleText = getRuleText(medicationProfile.schedule.recurrenceRule);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent]}
        contentInset={{ top: -(insets.top - 10) }}
      >
        <Text style={[styles.headerTitle, { color }]}>Информация о лекарстве</Text>
        <View style={styles.contentContainer}>
          <MedicationCard
            imageUrl=""
            name={medicationProfile.medicationName}
            profile={medicationProfile.profile as ProfileResponse}
            hasSwitch
            isActive={medicationProfile.status.toUpperCase() === "ACTIVE"}
            onSwitchToggle={handleOnSwitchToggle}
          />

          {/* Details Wrapper */}
          <View style={styles.detailsContainer}>
            {/* Schedule Information Wrapper */}
            <View style={styles.detailsWrapper}>
              <Text style={[styles.detailsTitle, { color }]}>Расписание</Text>
              {/* GROUP */}
              <View style={styles.detailsGroup}>
                {/* DATE STARTED */}
                <View
                  style={[styles.card, styles.detailsGroupItem, { backgroundColor: bgSecondary }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color }]}>Дата начала</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <CalenderIcon color={color} />
                    <Text style={[styles.cardTextContent, { color }]}>
                      {getStartedDate(medicationProfile.schedule.startDate)}
                    </Text>
                  </View>
                </View>

                {/* TIME STARTED */}
                <Pressable
                  style={[styles.card, styles.detailsGroupItem, { backgroundColor: bgSecondary }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color }]}>Время начала</Text>
                    <ArrowRight color={color} />
                  </View>
                  <View style={styles.cardBody}>
                    <ClockIcon color={color} />
                    <Text style={[styles.cardTextContent, { color }]}>
                      {getStartTime(medicationProfile.schedule.starTime)}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* FREQUENCY RRULES */}
              <Pressable style={[styles.card, { backgroundColor: bgSecondary }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color }]}>Частота приема</Text>
                  <ArrowRight color={color} />
                </View>
                <View style={styles.cardBody}>
                  <AlarmClockIcon color={color} />
                  <Text style={[styles.cardTextContent, { color }]}>
                    Каждые 6 часов, 3 раза в день
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Dosage Information */}
            <View style={styles.detailsWrapper}>
              <Text style={[styles.detailsTitle, { color }]}>Дозировка</Text>

              <View style={styles.detailsGroup}>
                {/* DOSAGE AMOUNT */}
                <Pressable
                  style={[styles.card, styles.detailsGroupItem, { backgroundColor: bgSecondary }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color }]}>Доза за прием</Text>
                    <ArrowRight color={color} />
                  </View>
                  <View style={styles.cardBody}>
                    <PillIcon color={color} size={16} />
                    <Text style={[styles.cardTextContent, { color }]}>
                      {getDosage().toLowerCase()}
                    </Text>
                  </View>
                </Pressable>

                {/* STOCK DOAGE AMOUNT */}
                <View
                  style={[styles.card, styles.detailsGroupItem, { backgroundColor: bgSecondary }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color }]}>Запас</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <LineChartIcon color={color} />
                    <Text style={[styles.cardTextContent, { color }]}>30 таблеток</Text>
                  </View>
                </View>
              </View>

              {/* NOTE ABOUT DOSAGE USAGE */}
              <Pressable style={[styles.card, { backgroundColor: bgSecondary }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color }]}>Заметки</Text>
                  <ArrowRight color={color} />
                </View>
                <View style={styles.cardBody}>
                  <NoteIcon color={color} />
                  <Text style={[styles.cardTextContent, { color: mutedColor }]}>
                    {medicationProfile.note ? medicationProfile.note : "Добавьте заметку..."}
                  </Text>
                </View>
              </Pressable>

              {/* TOTAL DOSAGE TAKEN INFO */}
              <View style={[styles.dosageTakenInfo, { backgroundColor: bgSecondary }]}>
                <PillFilledIcon color={color} />
                <Text style={[styles.cardTextContent, { color: mutedColor }]}>
                  20 таблеток принято
                </Text>
              </View>
            </View>
          </View>

          {/* DELETE PILL BUTTON */}
          <CustomButton label="Удалить лекарство" variant="danger" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    gap: 32,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 300,
    alignSelf: "center",
  },
  contentContainer: {
    flex: 1,
    gap: 16,
  },
  detailsContainer: {
    gap: 16,
  },
  detailsWrapper: {
    gap: 16,
  },
  detailsGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsGroupItem: {
    width: "48%",
  },
  detailsTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 21.2,
  },
  card: {
    padding: 12,
    borderRadius: 16,
    minHeight: 76,
    gap: 8,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  cardTextContent: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  dosageTakenInfo: {
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
