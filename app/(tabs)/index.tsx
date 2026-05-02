import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import MedicationCard from "@/component/ui/medication-card/medication-card";
import Tabs from "@/component/ui/tabs";
import WeekView from "@/component/ui/week-view";
import { DOSAGE_UNITS } from "@/constants/schedule-options";
import { useQuery } from "@/hooks/use-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserStore } from "@/stores/user-store";
import { MedicationScheduleResponse } from "@/types/medication";
import { ProfileResponse } from "@/types/user";
import { getDateLocalString, toLocalTime } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type TABS_VALUE = "ALL" | "TAKEN" | "MISSED";

const TABS = [
  { label: "Все", value: "ALL" },
  { label: "Принято", value: "TAKEN" },
  { label: "Пропущено", value: "MISSED" },
];
const localDateString = getDateLocalString();

export default function Home() {
  const { userData } = useUserStore();
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");
  const [selectedDate, setSelectedDate] = useState(localDateString);
  const insets = useSafeAreaInsets();

  const { data, loading, error } = useQuery<MedicationScheduleResponse[]>({
    url: "medications/schedules/event",
    params: {
      eventDate: selectedDate,
    },
  });

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const getFilterMedicationSchedule = () => {
    if (activeTab === "ALL") {
      return data;
    } else {
      return data?.filter((med) => med.status === activeTab);
    }
  };

  const hasMedicationSchedule = data && data.length >= 1 ? true : false;

  const getScheduleBadge = (
    medicationSchedule: MedicationScheduleResponse,
  ): "upcoming" | "taken" | "missed" => {
    if (medicationSchedule.status === "TAKEN") {
      return "taken";
    } else if (medicationSchedule.status === "MISSED") {
      return "missed";
    } else {
      return "upcoming";
    }
  };

  const getDosageUnit = (value: string) => {
    const label = DOSAGE_UNITS.find((unit) => unit.value === value.toUpperCase())?.label;
    return label;
  };

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const getScheduleTime = (scheduleTime: string) => {
    const date = new Date(scheduleTime);
    return toLocalTime(date);
  };

  const handleOnDateChange = (ISODate: string) => {
    const date = new Date(ISODate);
    const toLocalDateString = getDateLocalString(date);
    setSelectedDate(toLocalDateString);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Loader visible={loading} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerProfileContainer}>
            <Image
              source={require("@/assets/mock-profile.jpg")}
              style={styles.headerAvatar}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
          <Text style={[styles.headerProfileName, { color }]}>{userData?.name}</Text>
        </View>

        {/* WEEK VIEW */}
        <View style={styles.weekViewWrapper}>
          <WeekView showDescription={hasMedicationSchedule} onDateChange={handleOnDateChange} />
        </View>

        {/* CONTENT BODY */}
        {!loading && (
          <>
            {hasMedicationSchedule ? (
              <View style={{ flex: 1 }}>
                <View style={styles.tabsWrapper}>
                  <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
                </View>
                <FlatList
                  style={{ flex: 1 }}
                  data={getFilterMedicationSchedule()}
                  renderItem={({ item }) => (
                    <MedicationCard
                      imageUrl={item.medicationImageUrl}
                      name={item.medicationName}
                      profile={item.profile as ProfileResponse}
                      onButtonPress={() => {}}
                      badge={getScheduleBadge(item)}
                      dosage={item.dosage}
                      dosageUnit={getDosageUnit(item.measurement)}
                      scheduleTime={getScheduleTime(item.scheduleAt)}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={[
                    styles.listContentContainer,
                    { paddingBottom: insets.bottom + 10 },
                  ]}
                />
              </View>
            ) : (
              <View style={styles.noContentWrapper}>
                <Image
                  source={require("@/assets/images/pill-bottle.png")}
                  style={styles.noContentImage}
                />
                <Text style={[styles.noContentTitle, { color }]}>
                  На этот день лекарства не запланированы
                </Text>
                <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
                  Если вы ещё не добавили лекарство, сделайте это сейчас.
                </Text>

                <CustomButton label="Добавить лекарства" svgIcon={<PlusIcon size={15} />} />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 32,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerProfileContainer: {
    width: 45,
    height: 45,
    borderRadius: 9999,
    overflow: "hidden",
  },
  headerAvatar: {
    width: "100%",
    height: "100%",
  },
  headerProfileName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  weekViewWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  noContentWrapper: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  noContentImage: {
    width: 160,
    height: 160,
  },
  noContentTitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  noContentSubtitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
  tabsWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    gap: 16,
  },
});
