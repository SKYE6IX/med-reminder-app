import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import MedicationCard from "@/component/ui/medication-card/medication-card";
import Tabs from "@/component/ui/tabs";
import WeekView from "@/component/ui/week-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { mockMedicationsSchedule } from "@/mock-data";
import { MedicationScheduleResponse, ProfileResponse } from "@/types/medication";
import { toLocalTime } from "@/utils/luxonUtil";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");

  const insets = useSafeAreaInsets();

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const getFilterMedicationSchedule = () => {
    const filterList = mockMedicationsSchedule.filter((med) => med.status === activeTab);
    if (filterList.length > 1) {
      return filterList;
    }
    return mockMedicationsSchedule;
  };

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

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const getScheduleTime = (scheduleTime: string) => {
    const date = new Date(scheduleTime);
    return toLocalTime(date);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerProfileContainer}>
            <Image
              source={require("@/assets/mock-profile.jpg")}
              style={styles.headerProfileImage}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
          <Text style={[styles.headerProfileName, { color }]}>Людмила</Text>
        </View>

        <View style={styles.calederWrapper}>
          <WeekView />
        </View>

        {getFilterMedicationSchedule().length > 1 ? (
          <View style={{ flex: 1 }}>
            <View style={styles.tabsWrapper}>
              <Text style={[styles.medicationScheduleTitle, { color }]}>Лекарства на сегодня</Text>
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
                  dosageUnit={item.measurement}
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
  headerProfileImage: {
    width: "100%",
    height: "100%",
  },
  headerProfileName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  calederWrapper: {
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
    gap: 16,
  },
  medicationScheduleTitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    lineHeight: 22,
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    gap: 16,
  },
});
