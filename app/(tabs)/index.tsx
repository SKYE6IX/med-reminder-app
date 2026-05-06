import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import Tabs from "@/component/ui/tabs";
import WeekView from "@/component/ui/week-view";
import { DOSAGE_UNITS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserData } from "@/hooks/use-user-data";
import { MedicationScheduleResponse } from "@/types/medication";
import { getDateLocalString, toLocalTime } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import MedicationCard from "@/component/ui/medication-card/medication-card";
import { ProfileResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

type TABS_VALUE = "ALL" | "TAKEN" | "MISSED";

const TABS = [
  { label: "Все", value: "ALL" },
  { label: "Принято", value: "TAKEN" },
  { label: "Пропущено", value: "MISSED" },
];

const localDateString = getDateLocalString();

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

const getScheduleTime = (scheduleTime: string) => {
  const date = new Date(scheduleTime);
  return toLocalTime(date);
};

// Fetch schedule events query
const fetchScheduleEvents = async (params: string) => {
  const response = await api.get("medications/schedules/event", {
    params: {
      eventDate: params,
    },
  });
  return response.data;
};

export default function Home() {
  const { user } = useUserData();
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");
  const [selectedDate, setSelectedDate] = useState(localDateString);
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery<MedicationScheduleResponse[]>({
    queryKey: ["schedule-events", selectedDate],
    queryFn: () => fetchScheduleEvents(selectedDate),
    staleTime: 60 * 60 * 10000,
  });

  const hasMedicationSchedule = data && data.length >= 1 ? true : false;

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

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const handleOnDateChange = (ISODate: string) => {
    const date = new Date(ISODate);
    const toLocalDateString = getDateLocalString(date);
    setSelectedDate(toLocalDateString);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Loader visible={isLoading} />
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
          <Text style={[styles.headerProfileName, { color }]}>{user?.name}</Text>
        </View>

        {/* WEEK VIEW */}
        <View style={styles.weekViewWrapper}>
          <WeekView showDescription={hasMedicationSchedule} onDateChange={handleOnDateChange} />
        </View>

        {/* CONTENT BODY */}
        {!isLoading && (
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
                      id={item.id}
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
