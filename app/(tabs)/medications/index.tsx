import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import MedicationCard from "@/component/ui/medication-card/medication-card";
import Tabs from "@/component/ui/tabs";
import { useThemeColor } from "@/hooks/use-theme-color";
import { mockMedications } from "@/mock-data";
import { ProfileResponse } from "@/types/medication";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type TABS_VALUE = "ALL" | "ACTIVE" | "INACTIVE";

const TABS = [
  { label: "Все", value: "ALL" },
  { label: "Активно", value: "ACTIVE" },
  { label: "Неактивно", value: "INACTIVE" },
];

export default function Medications() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");

  const insets = useSafeAreaInsets();

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const getFilterMedications = () => {
    const filterList = mockMedications.filter((med) => med.status.toUpperCase() === activeTab);
    if (filterList.length > 1) {
      return filterList;
    }
    return mockMedications;
    // return [];
  };

  const getStartedDate = (isoString: string) => {
    const date = new Date(isoString);
    const convertedString = getDateLocalString(date).replaceAll(".", " ");
    return formatRegularDate(convertedString);
  };

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const handleOnSwitchToggle = (status: "active" | "inactive") => {
    // Perform operation to update the active status of the
    // medication profile.
    console.log("current status -> ", status);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Text style={[styles.headerTitle, { color }]}>Мои лекарства</Text>

      {getFilterMedications().length > 1 ? (
        <>
          <View style={styles.tabWrapper}>
            <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={getFilterMedications()}
            renderItem={({ item }) => (
              <MedicationCard
                imageUrl={item.medicationImageUrl}
                name={item.medicationName}
                profile={item.profile as ProfileResponse}
                dosage={item.schedule.dosage}
                dosageUnit={item.schedule.measurement}
                hasSwitch
                showProgress
                startedDate={getStartedDate(item.schedule.startDate)}
                isActive={item.status.toUpperCase() === "ACTIVE"}
                onSwitchToggle={handleOnSwitchToggle}
                onNavigate={() => router.navigate(`/medications/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: insets.bottom + 10 },
            ]}
          />
        </>
      ) : (
        <View style={[styles.noContentWrapper, { paddingBottom: insets.bottom + 10 }]}>
          <Image
            source={require("@/assets/images/pill-bottle.png")}
            style={styles.noContentImage}
          />
          <Text style={[styles.noContentTitle, { color }]}>У тебя нет никаких лекарств.</Text>
          <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
            Теперь добавьте новое лекарство.
          </Text>
          <CustomButton label="Добавить лекарства" svgIcon={<PlusIcon size={15} />} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  tabWrapper: {
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
  noContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    gap: 20,
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
});
