import CalenderIcon from "@/component/icons/calender-icon";
import LineChartIcon from "@/component/icons/line-chart-icon";
import PillFilledIcon from "@/component/icons/pill-filled-icon";
import DeleteMedicationProfile from "@/component/ui/delete-medication-profile";
import Loader from "@/component/ui/loader";
import MedicationCard from "@/component/ui/medication-card/medication-card";
import DosageSettings from "@/component/ui/medication-details/dosage-settings";
import FrequencySettings from "@/component/ui/medication-details/frequency-settings";
import NoteSettings from "@/component/ui/medication-details/note-settings";
import TimeSettings from "@/component/ui/medication-details/time-settings";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfileResponse } from "@/types/medication";
import { ProfileResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const getStartedDate = (isoString: string) => {
  const date = new Date(isoString);
  const convertedString = getDateLocalString(date).replaceAll(".", " ");
  return formatRegularDate(convertedString);
};

// Medication profile details query
const fetchMedicationProfileDetails = async (id: string) => {
  const response = await api.get<MedicationProfileResponse>(`medications/${id}`);
  return response.data;
};

export default function MedicationDetails() {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const { medicationProfileId } = useLocalSearchParams();

  // Query details data
  const { data: medicationProfile, isLoading } = useQuery({
    queryKey: ["medication-profile", "details", medicationProfileId],
    queryFn: () => fetchMedicationProfileDetails(medicationProfileId as string),
    staleTime: 60 * 60 * 1000,
  });

  // Updating mutation
  const { mutate, isPending } = useUpdateMedicationMutation();

  // Update the medication profile status
  const handleOnSwitchToggle = (status: "active" | "inactive", id: string) => {
    if (status === "active") {
      mutate({ id, data: { isActive: true } });
    } else if (status === "inactive") {
      mutate({ id, data: { isActive: false } });
    }
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <ScrollView
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: isIOS ? undefined : insets.top + 10, paddingBottom: 10 },
        ]}
      >
        <Loader visible={isLoading || isPending} />
        {medicationProfile && (
          <View style={styles.contentContainer}>
            <MedicationCard
              id={medicationProfile.id}
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
                  <TimeSettings medicationProfile={medicationProfile} />
                </View>

                {/* FREQUENCY RRULES */}
                <FrequencySettings medicationProfile={medicationProfile} />
              </View>

              {/* Dosage Information */}
              <View style={styles.detailsWrapper}>
                <Text style={[styles.detailsTitle, { color }]}>Дозировка</Text>

                <View style={styles.detailsGroup}>
                  {/* DOSAGE AMOUNT */}
                  <DosageSettings medicationProfile={medicationProfile} />

                  {/* STOCK DOSAGE AMOUNT */}
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
                <NoteSettings medicationProfile={medicationProfile} />

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
            <DeleteMedicationProfile medicationProfileId={medicationProfileId as string} />
          </View>
        )}
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
